# Eclipse

A daily word game. Two circles, one overlap: name as many things as you can that fit **both** circles before 45 seconds run out. Every answer pulls the sun and moon together, and rare answers pull them further. Line them up for a full eclipse.

Everyone gets the same three Venns each day (Easy, Medium, Hard). A new set arrives at midnight UK time. The puzzles live in a Google Sheet, so you can edit them without touching the code.

## Files

| File | What it does |
| --- | --- |
| `config.js` | **Settings:** your Google Sheet ID and the launch date |
| `data.js` | Reads today's Venns from the Google Sheet |
| `venns.js` | Backup puzzles, used only if the sheet can't be reached |
| `game.js` | Game logic: timer, scoring, answer matching, streaks, share text |
| `index.html`, `style.css` | The page and its design |

## Set up the Google Sheet (once)

1. Open the **Eclipse Puzzles** sheet in your Google Drive.
2. Go to **File → Import → Upload** and choose `Eclipse_Puzzles.xlsx`. Pick **Replace spreadsheet**, then **Import data**. You should now have four tabs: Schedule, Venns, Answers and How to edit.
3. Click **Share**, set General access to **Anyone with the link**, role **Viewer**, then **Done**.

The sheet ID is already filled in `config.js`. If you ever use a different sheet, copy the long code from its address (between `/d/` and `/edit`) into `SHEET_ID`.

## Put the game online with GitHub Pages (free)

1. In `config.js`, set `LAUNCH_DATE` to the day you go live. That day plays Day 1 of the Schedule tab.
2. Create a new **public** repository on GitHub (for example `eclipse`).
3. Click **Add file → Upload files**, drag in all the files from this folder, then click **Commit changes**.
4. Go to **Settings → Pages**. Under **Source**, choose **Deploy from a branch**, pick branch **main** and folder **/ (root)**, then **Save**.
5. After a minute or two the game is live at `https://<your-username>.github.io/eclipse/`.

## Edit puzzles in the sheet

- **Schedule:** one row per day, in order. Put a Venn ID in Easy, Medium and Hard. The name columns next to them fill in automatically so you can check your choices. When the rows run out, the game starts again from Day 1, so keep adding days.
- **Venns:** one row per Venn (ID, Circle A, Circle B, Level). The Answers column counts answers automatically.
- **Answers:** one row per accepted answer: Venn ID, Answer, Tier (Common +10%, Good +25%, Rare +50%) and any other spellings in "Also accept", separated by semicolons.
- Keep the tab names and column headers exactly as they are; the game looks for them by name.
- Changes show up for anyone who opens the game after you save. Don't change a day that has already been played.

## Preview a future puzzle

Add `?day=5` to the end of the game's address to play puzzle #5 without affecting your stats.

## If the sheet can't be read

The game quietly falls back to the backup puzzles in `venns.js`, so players never see an error. If you see the backup Venns (Day 1 is Fruit ∩ Colour) instead of your sheet's, check that the sheet is shared as "Anyone with the link" and that the tab names haven't changed. Your browser's developer console shows the exact reason.

## Good to know

- Anyone with the sheet's link can see the answers. Moving to a database like Supabase later can hide them.
- Streaks and stats are saved in each player's own browser. There are no accounts.
