// =====================================================================
// ECLIPSE: GAME LOGIC
// You shouldn't need to edit this file. Puzzles and the launch date live in venns.js.
// =====================================================================

const GAIN = { C: 10, H: 25, T: 50 };
const ICON = { C: "🌘", H: "🌗", T: "🌑" };
const RANK = { C: 1, H: 2, T: 3 };
const ROUND_SECS = 45;
const TIME_ZONE = "Europe/London";   // a new puzzle starts at midnight UK time
const STORE_KEY = "eclipse-v1";
const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

// ---------- Answer matching ----------
function norm(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and").replace(/^(the|a|an)\s+/, "").replace(/[^a-z0-9]/g, "");
}
function buildIndex(v) {
  const map = new Map();
  v.answers.forEach(([name, tier, alts], i) => {
    [name, ...(alts ? alts.split(";") : [])].forEach(k => map.set(norm(k), i));
  });
  return map;
}
function lookup(map, raw) {
  const n = norm(raw);
  if (!n) return -1;
  const tries = [n];
  if (n.endsWith("ies")) tries.push(n.slice(0, -3) + "y");
  if (n.endsWith("es")) tries.push(n.slice(0, -2));
  if (n.endsWith("s")) tries.push(n.slice(0, -1));
  for (const t of tries) if (map.has(t)) return map.get(t);
  return -1;
}

// ---------- Dates (UK time) ----------
function ukParts(date = new Date()) {
  const out = {};
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(date).forEach(p => out[p.type] = p.value);
  return out;
}
function todayKey() { const p = ukParts(); return `${p.year}-${p.month}-${p.day}`; }
function toUTC(key) { const [y, m, d] = key.split("-").map(Number); return Date.UTC(y, m - 1, d); }
function dayIndexOf(key) { return Math.round((toUTC(key) - toUTC(LAUNCH_DATE)) / 864e5); }
function keyOfIndex(i) { return new Date(toUTC(LAUNCH_DATE) + i * 864e5).toISOString().slice(0, 10); }
function niceDate(key) {
  return new Date(toUTC(key)).toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
}
function secondsToMidnight() {
  const p = ukParts();
  return 86400 - (+p.hour * 3600 + +p.minute * 60 + +p.second);
}
function setsAvailable() { return Math.max(1, Math.floor(VENNS.length / VENNS_PER_DAY)); }
function vennsForDay(i) {
  const set = ((i % setsAvailable()) + setsAvailable()) % setsAvailable();
  return VENNS.slice(set * VENNS_PER_DAY, set * VENNS_PER_DAY + VENNS_PER_DAY);
}

// ---------- Saved progress (stays on the player's device) ----------
let memoryStore = { days: {} };
function load() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return memoryStore;
}
function save(state) {
  memoryStore = state;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
function computeStats(state, today) {
  const done = Object.keys(state.days).filter(k => state.days[k].done).sort();
  const eclipses = done.reduce((n, k) => n + state.days[k].results.filter(r => r.p >= 100).length, 0);
  let best = 0, run = 0, prev = null;
  done.forEach(k => {
    run = prev !== null && toUTC(k) - toUTC(prev) === 864e5 ? run + 1 : 1;
    best = Math.max(best, run); prev = k;
  });
  // current streak counts back from today, or from yesterday if today isn't finished yet
  let cur = 0, k = state.days[today] && state.days[today].done ? today : keyOfIndex(dayIndexOf(today) - 1);
  while (state.days[k] && state.days[k].done) { cur++; k = keyOfIndex(dayIndexOf(k) - 1); }
  return { played: done.length, eclipses, streak: cur, best };
}

// ---------- Which puzzle is this? ----------
// Normal play uses today's date. Add ?day=5 (or #day5) to the address to preview a puzzle without saving.
const previewMatch = (location.search.match(/[?&]day=(\d+)/) || location.hash.match(/^#day(\d+)$/));
const PREVIEW = previewMatch ? Math.max(1, +previewMatch[1]) : null;
const TODAY = PREVIEW ? keyOfIndex(PREVIEW - 1) : todayKey();
const DAY_INDEX = dayIndexOf(TODAY);
const PUZZLE_NO = DAY_INDEX + 1;
let DAILY = [];          // filled from the Google Sheet (or the backup) when the page loads
let PUZZLE_SOURCE = "";
const BEFORE_LAUNCH = DAY_INDEX < 0;

// ---------- Game state ----------
const $ = id => document.getElementById(id);
const els = ["intro", "play", "result", "final"].reduce((o, k) => (o[k] = $(k), o), {});
let state = load();
let day = PREVIEW ? { results: [], done: false } : (state.days[TODAY] || { results: [], done: false });
let round = 0, pct = 0, found = [], timerId = null, endsAt = 0, index = null, countdownId = null;

function persist() {
  if (PREVIEW) return;
  state.days[TODAY] = day;
  save(state);
}
function scoreOf(v, list) { return Math.min(100, list.reduce((p, i) => p + GAIN[v.answers[i][1]], 0)); }
function bestOf(v, list) {
  let best = null;
  list.forEach(i => { if (best === null || RANK[v.answers[i][1]] > RANK[v.answers[best][1]]) best = i; });
  return best === null ? null : v.answers[best].slice(0, 2);
}
// A round that was interrupted by a refresh or closed tab ends with the answers already found.
function settleInterrupted() {
  if (!day.current) return;
  const v = DAILY[day.current.round];
  if (v) day.results.push({ p: scoreOf(v, day.current.found), count: day.current.found.length, best: bestOf(v, day.current.found), found: day.current.found });
  delete day.current;
  if (day.results.length >= DAILY.length) day.done = true;
  persist();
}

// ---------- Drawing ----------
function show(which) { Object.entries(els).forEach(([k, el]) => el.hidden = k !== which); }
function setEclipse(p) {
  const d = Math.min(p, 100);
  const shift = 59 * (1 - d / 100);
  $("sunBody").style.transform = `translateX(${-shift}px)`;
  $("moon").style.transform = `translateX(${shift}px)`;
  $("pct").textContent = d + "%";
  $("ecl").classList.toggle("totality", d >= 100);
  document.body.style.setProperty("--dk", (d * 0.97) + "%");
  document.body.classList.toggle("night", d >= 55);
  $("stars").style.opacity = d < 40 ? 0 : ((d - 40) / 60 * 0.75).toFixed(2);
}
function setLabels(v) { $("labA").textContent = v.a; $("labB").textContent = v.b; }
function toast(msg, cls) { const t = $("toast"); t.textContent = msg; t.className = "toast " + cls; }
function shake(el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
function phase(p) { return p >= 100 ? "🌑" : p >= 66 ? "🌘" : p >= 33 ? "🌗" : p > 0 ? "🌖" : "🌕"; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ---------- Rounds ----------
function startRound() {
  round = day.results.length;
  const v = DAILY[round];
  index = buildIndex(v); pct = 0; found = [];
  day.current = { round, found: [] }; persist();
  setLabels(v); setEclipse(0);
  $("labels").hidden = false; $("meter").hidden = false;
  $("issue").textContent = `Venn ${round + 1} of ${DAILY.length}`;
  $("found").innerHTML = '<span class="empty">Your answers will appear here.</span>';
  toast("", "");
  show("play");
  $("guess").value = ""; $("guess").focus();
  endsAt = performance.now() + ROUND_SECS * 1000;
  clearInterval(timerId);
  timerId = setInterval(tick, 100); tick();
}
function tick() {
  const left = Math.max(0, endsAt - performance.now());
  $("timerBar").style.transform = `scaleX(${left / (ROUND_SECS * 1000)})`;
  $("timer").classList.toggle("low", left < 10000);
  if (left <= 0) endRound();
}
$("form").addEventListener("submit", e => {
  e.preventDefault();
  if (els.play.hidden) return;
  const input = $("guess"), raw = input.value.trim();
  if (!raw) return;
  input.value = "";
  const i = lookup(index, raw);
  if (i < 0) { toast(`“${raw}” isn't in this sky. Try another.`, "bad"); shake(input); return; }
  if (found.includes(i)) { toast("Already found that one.", "bad"); shake(input); return; }
  const [name, tier] = DAILY[round].answers[i];
  found.push(i);
  day.current.found = found.slice(); persist();
  pct += GAIN[tier];
  setEclipse(pct);
  toast(`${ICON[tier]} ${name}  +${GAIN[tier]}%`, "good");
  renderFound();
  if (pct >= 100) setTimeout(endRound, 900);
});
function renderFound() {
  const v = DAILY[round];
  $("found").innerHTML = found.map(i => {
    const [n, t] = v.answers[i];
    return `<span class="a ${t}">${ICON[t]} ${esc(n)}</span>`;
  }).join("");
}
function endRound() {
  if (els.play.hidden) return;
  clearInterval(timerId); timerId = null;
  const v = DAILY[round], p = scoreOf(v, found), best = bestOf(v, found);
  day.results.push({ p, count: found.length, best, found: found.slice() });
  delete day.current;
  if (day.results.length >= DAILY.length) day.done = true;
  persist();
  $("resTitle").textContent = p >= 100 ? "Eclipse 🌑" : p >= 60 ? "Deep partial eclipse" : p > 0 ? "Partial eclipse" : "Clear skies";
  $("resPct").textContent = p + "%";
  $("resCount").textContent = found.length;
  $("resBest").textContent = best ? `${ICON[best[1]]} ${best[0]}` : "None";
  const missed = v.answers.filter((a, i) => a[1] === "T" && !found.includes(i)).slice(0, 4).map(a => esc(a[0]));
  $("resMissed").innerHTML = missed.length ? `Rare answers you could have found: <b>${missed.join(", ")}</b>` : "You found every rare answer we had.";
  $("nextBtn").textContent = day.done ? "See today's sky" : "Next Venn";
  show("result");
}
$("nextBtn").addEventListener("click", () => { if (day.done) showFinal(); else startRound(); });

// ---------- End of the day ----------
function shareText(stats) {
  let best = null;
  day.results.forEach(r => { if (r.best && (!best || RANK[r.best[1]] > RANK[best[1]])) best = r.best; });
  const tot = day.results.filter(r => r.p >= 100).length;
  const link = /^https?:/.test(location.protocol) ? "\n" + location.origin + location.pathname : "";
  return `Eclipse #${PUZZLE_NO} ${day.results.map(r => phase(r.p)).join("")}\n` +
    `Full eclipses ${tot}/${day.results.length}` + (stats && !PREVIEW ? ` · Streak ${stats.streak}` : "") +
    (best ? `\nBest answer: ${best[0]} ${ICON[best[1]]}` : "") + link;
}
function showFinal() {
  const stats = computeStats(state, todayKey());
  const tot = day.results.filter(r => r.p >= 100).length;
  $("finalTitle").textContent = tot === day.results.length ? "A perfect sky" : tot > 0 ? "Today's sky" : "Clouds today";
  $("finalGrid").textContent = day.results.map(r => phase(r.p)).join(" ");
  $("stPlayed").textContent = stats.played;
  $("stEclipses").textContent = stats.eclipses;
  $("stStreak").textContent = stats.streak;
  $("stBest").textContent = stats.best;
  $("statsBox").hidden = !!PREVIEW;
  $("share").value = shareText(stats);
  $("issue").textContent = PREVIEW ? `Preview · #${PUZZLE_NO}` : `Eclipse #${PUZZLE_NO}`;
  $("copyMsg").textContent = "";
  $("againBtn").hidden = !PREVIEW;
  $("previewNote").hidden = !PREVIEW;
  $("nextWrap").hidden = !!PREVIEW;
  const bestP = Math.max(0, ...day.results.map(r => r.p));
  $("labels").hidden = true; $("meter").hidden = true;
  setEclipse(bestP);
  show("final");
  if (!PREVIEW) startCountdown();
}
function startCountdown() {
  clearInterval(countdownId);
  const draw = () => {
    const s = secondsToMidnight();
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    $("countdown").textContent = `${hh}:${mm}:${ss}`;
    if (todayKey() !== TODAY) { clearInterval(countdownId); location.reload(); }
  };
  draw(); countdownId = setInterval(draw, 1000);
}
$("copyBtn").addEventListener("click", () => {
  const t = $("share");
  const ok = () => $("copyMsg").textContent = "Copied. Paste it into your group chat.";
  const fail = () => { t.select(); $("copyMsg").textContent = "Text selected. Copy it with your keyboard or long-press."; };
  try { navigator.clipboard.writeText(t.value).then(ok, fail); } catch (e) { fail(); }
});
$("againBtn").addEventListener("click", () => { day = { results: [], done: false }; startRound(); });
$("startBtn").addEventListener("click", () => { if (!BEFORE_LAUNCH && DAILY.length) startRound(); });

// ---------- How to play ----------
const dlg = $("howto");
let pausedLeft = null;
function openHow() {
  if (!els.play.hidden && timerId) { pausedLeft = Math.max(0, endsAt - performance.now()); clearInterval(timerId); timerId = null; }
  if (!dlg.open) dlg.showModal();
}
dlg.addEventListener("close", () => {
  if (pausedLeft !== null) { endsAt = performance.now() + pausedLeft; pausedLeft = null; timerId = setInterval(tick, 100); $("guess").focus(); }
});
$("helpBtn").addEventListener("click", openHow);
$("rulesBtn").addEventListener("click", openHow);
$("closeHow").addEventListener("click", () => dlg.close());
$("dlgPlay").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

// ---------- Start-up ----------
(async function boot() {
  $("issue").textContent = PREVIEW ? `Preview · #${PUZZLE_NO}` : BEFORE_LAUNCH ? "Coming soon" : `Eclipse #${PUZZLE_NO}`;
  $("today").textContent = BEFORE_LAUNCH ? "Coming soon" : `Eclipse #${PUZZLE_NO} · ${niceDate(TODAY)}`;
  setEclipse(0);
  if (BEFORE_LAUNCH) {
    $("heroTitle").textContent = `The first eclipse is on ${niceDate(LAUNCH_DATE)}.`;
    $("startBtn").hidden = true;
    show("intro");
    return;
  }
  if (day.done) { showFinal(); return; }

  // Show the page and the how-to straight away, while today's Venns load in the background
  const playLabel = $("startBtn").textContent;
  $("startBtn").disabled = true;
  $("startBtn").textContent = "Loading today's sky…";
  show("intro");
  openHow();

  const loaded = await loadDay(DAY_INDEX);
  DAILY = loaded.venns; PUZZLE_SOURCE = loaded.source;
  settleInterrupted();
  if (day.done) { if (dlg.open) dlg.close(); showFinal(); return; }
  $("dailyCount").textContent = `${WORDS[DAILY.length] || DAILY.length} Venns · ${ROUND_SECS} seconds each`;
  $("startBtn").disabled = false;
  $("startBtn").textContent = playLabel;
  if (day.results.length > 0) {
    $("heroTitle").textContent = "Your sky is waiting.";
    $("startBtn").textContent = `Continue · Venn ${day.results.length + 1} of ${DAILY.length}`;
  }
})();

// ---------- Starfield ----------
(function stars() {
  const c = $("stars"), x = c.getContext("2d");
  function draw() {
    c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
    x.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--moon-ink").trim() || "#fff";
    let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 140; i++) { x.globalAlpha = .2 + rnd() * .6; x.beginPath(); x.arc(rnd() * c.width, rnd() * c.height, (rnd() * 1.2 + .3) * devicePixelRatio, 0, 7); x.fill(); }
  }
  draw(); addEventListener("resize", draw);
})();
