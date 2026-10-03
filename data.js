// =====================================================================
// ECLIPSE: LOADING PUZZLES FROM GOOGLE SHEETS
// Reads three tabs from the sheet in config.js:
//   Schedule  (Day, Easy, Medium, Hard)       which Venn IDs to play each day
//   Venns     (Venn ID, Circle A, Circle B)    what each Venn is
//   Answers   (Venn ID, Answer, Tier, Also accept)
// If anything goes wrong, the game falls back to the backup puzzles in venns.js.
// =====================================================================

const SHEET_TABS = { schedule: "Schedule", venns: "Venns", answers: "Answers" };
const SLOTS = ["Easy", "Medium", "Hard"];
const TIER_CODES = { common: "C", good: "H", rare: "T", c: "C", h: "H", t: "T" };

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function toObjects(rows) {
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r.some(c => c.trim()))
    .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

async function fetchTab(name, mustHave) {
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(SHEET_ID)}/gviz/tq` +
    `?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Couldn't read the ${name} tab (HTTP ${res.status}).`);
  const text = await res.text();
  if (/^\s*</.test(text)) throw new Error(`The ${name} tab didn't come back as data. Is the sheet shared as "Anyone with the link"?`);
  const rows = toObjects(parseCSV(text));
  // Google returns the first tab if a tab name is wrong, so check the columns are the ones we expect
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const missing = mustHave.filter(c => !cols.includes(c));
  if (missing.length) throw new Error(`The ${name} tab is missing: ${missing.join(", ")}. Check the tab name and column headers.`);
  return rows;
}

// Returns today's Venns in the game's format: [{ a, b, answers: [[name, "C"|"H"|"T", "alt;alt"]] }]
async function loadDayFromSheet(dayIndex) {
  const [schedule, venns, answers] = await Promise.all([
    fetchTab(SHEET_TABS.schedule, SLOTS),
    fetchTab(SHEET_TABS.venns, ["Venn ID", "Circle A", "Circle B"]),
    fetchTab(SHEET_TABS.answers, ["Venn ID", "Answer", "Tier"]),
  ]);
  const days = schedule.filter(r => SLOTS.some(s => r[s]));
  if (!days.length) throw new Error("The Schedule tab has no days in it.");
  const row = days[((dayIndex % days.length) + days.length) % days.length];
  const ids = SLOTS.map(s => row[s]).filter(Boolean);

  const info = new Map(venns.map(v => [v["Venn ID"], v]));
  return ids.map(id => {
    const v = info.get(id);
    if (!v) throw new Error(`Venn ID ${id} is in the Schedule but not in the Venns tab.`);
    const list = answers
      .filter(a => a["Venn ID"] === id && a["Answer"])
      .map(a => {
        const tier = TIER_CODES[(a["Tier"] || "").toLowerCase()];
        const alts = (a["Also accept"] || "").split(";").map(s => s.trim()).filter(Boolean).join(";");
        return tier ? [a["Answer"], tier, alts] : null;
      })
      .filter(Boolean);
    if (!list.length) throw new Error(`Venn ${id} has no answers in the Answers tab.`);
    return { a: v["Circle A"], b: v["Circle B"], answers: list };
  });
}

async function loadDay(dayIndex) {
  if (SHEET_ID) {
    try {
      return { venns: await loadDayFromSheet(dayIndex), source: "sheet" };
    } catch (e) {
      console.warn("Eclipse: using backup puzzles because the Google Sheet couldn't be used.", e.message);
    }
  }
  return { venns: vennsForDay(dayIndex), source: "backup" };
}
