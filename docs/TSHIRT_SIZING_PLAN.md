# Plan: Add T-shirt Sizing Page

This document outlines the plan to add a new page for **T-shirt sizing** where users can vote using sizes **XS, S, M, L, XL, XXL** instead of numeric planning poker points.

---

## 1. Current Architecture Summary

- **Routes**: `/` (SignIn) and `/:sessionName` (Room). No session-type distinction today.
- **Cards**: `src/components/Cards/Cards.js` uses a fixed list of numeric points `[0.5, 1, 2, 3, 5, 8, 13, -1]` and images under `public/img/` (e.g. `1.png`, `13.png`).
- **Storage**: Firebase Realtime Database stores per-player `point` (number), `connected`, and `cheated`. Unvoted = `0`; voting sets `point` to the chosen value.
- **Display**: `Player.js` shows the revealed card as `img/${player.point}.png`. `Room.js` shows “Avg = X pt” when revealing votes (via `getAvgPoint`).
- **Helpers**: `playerHelper.js` uses `point === 0` for “unvoted” and numeric comparison for `isConsistent`; `mathHelper.getAvgPoint` assumes numeric `point`.

---

## 2. Design Decisions

| Decision | Recommendation |
|----------|----------------|
| **New page vs same page** | Add a **dedicated route** for T-shirt sessions so URLs are explicit and the app can switch behavior cleanly (e.g. `/tshirt/:sessionName`). |
| **Session type storage** | Store a **session type** when the session is first created (e.g. in Firebase at `sessionName/sessionType`: `"points"` or `"tshirt"`). Default existing sessions to `"points"` so current behavior is unchanged. |
| **Vote storage** | Reuse the existing **`point`** field: store **strings** for T-shirt (`"XS"`, `"S"`, `"M"`, `"L"`, `"XL"`, `"XXL"`) and use **`""` (empty string)** for “no vote” in T-shirt mode. This avoids schema changes and keeps one field per player. |
| **Card UI** | T-shirt cards should be **text-based** (no new card images): display the size label (XS–XXL) on each card. Reuse `Cards` layout and styling where possible. |

---

## 3. Implementation Plan

### 3.1 Routing and entry point

- **File**: `src/components/App/App.js`
- **Changes**:
  - Add a route, e.g. `Route path="/tshirt/:sessionName"` that renders the same `Room` component (or a thin wrapper) with a prop like `mode="tshirt"`.
  - Ensure `Room` receives the session name from the route (e.g. `match.params.sessionName` for both `/sessionName` and `/tshirt/:sessionName`).

### 3.2 Sign-in and session creation

- **File**: `src/components/SignIn/SignIn.js`
- **Changes**:
  - Add a way to choose session type before joining:
    - Option A: Two buttons — “Join Planning Poker” → `history.push('/' + sessionName)` and “Join T-shirt sizing” → `history.push('/tshirt/' + sessionName)`.
    - Option B: A dropdown/radio for “Planning Poker” vs “T-shirt sizing” and a single “Join” that navigates to the correct path.
  - Optional: Add a link or hint so observers can join the T-shirt session as observer (e.g. `/tshirt/:sessionName?observer`).

- **Session type in Firebase** (optional but recommended for consistency):
  - When initializing a session (e.g. in `database.js` when the first user joins), set `sessionType` to `"tshirt"` for `/tshirt/...` and `"points"` for `/...`. This allows the Room to infer mode from data if needed (e.g. for shared links without path).

### 3.3 Database layer

- **File**: `src/libraries/database.js`
- **Changes**:
  - `initialize(sessionName, userName, sessionType)`: accept optional `sessionType` (`"points"` | `"tshirt"`). When creating or updating session metadata, set `sessionType` so future joins know the type.
  - `setPoint(value, cheated)`: already accepts any value; ensure it supports **string** values for T-shirt (e.g. `"M"`). No signature change required if Firebase is used with string values.
  - For T-shirt, “clear votes” should set `point: ""` (or the chosen “unvoted” sentinel) instead of `point: 0` when in T-shirt mode. This can be done in the caller (Room) or by passing mode into a new method like `clearVotes(mode)`.

### 3.4 Room and mode

- **File**: `src/components/Room/Room.js`
- **Changes**:
  - Determine **mode**: from route (e.g. `match.path.startsWith('/tshirt')`) or from Firebase `sessionData.sessionType`. Prefer route so one URL always means one mode.
  - Pass `mode="tshirt"` or `mode="points"` to:
    - `Table` (so players can show point vs size).
    - `Cards` (or the component that chooses which cards to render).
  - For “Show Votes” in T-shirt mode:
    - Do **not** show “Avg = X pt”. Instead show something like “Reveal votes” / “Votes revealed” or a simple distribution (e.g. “2× M, 1× L”) if desired later.
  - When calling `db.initialize`, pass `sessionType` if you added it to the DB API.
  - When calling `db.clearVotes()`, pass mode so the DB can set `point` to `0` vs `""` accordingly (if you implement that in the DB).

### 3.5 Cards component (T-shirt sizes on cards)

- **Option A – Separate component (recommended for clarity)**  
  - **New file**: `src/components/Cards/TshirtCards.js` (or `CardsTshirt.js`).
  - Sizes: `['XS', 'S', 'M', 'L', 'XL', 'XXL']`.
  - Render a row of **cards** (reuse `.__cards` and `.__cards__card` from `Cards.scss` or a shared base) where each card shows the **label** (e.g. “M”) as text instead of an image.
  - On click: call `db.setPoint(size, showVotes)` (e.g. `size` = `"M"`).
  - Highlight the active card when `userPoint === size` (e.g. `userPoint === "M"`).
  - Export and use in Room when `mode === 'tshirt'`.

- **Option B – Single Cards component with mode**  
  - **File**: `src/components/Cards/Cards.js`
  - Add prop `mode: 'points' | 'tshirt'`.
  - If `mode === 'tshirt'`, render the same XS–XXL list and labels and call `db.setPoint(size)`; otherwise keep current numeric + images behavior.
  - Keeps one place for “cards” but mixes two UIs in one component.

Recommendation: **Option A** (separate `TshirtCards` component) to keep responsibilities clear and avoid conditional image vs text inside one file.

### 3.6 Player and Table display

- **File**: `src/components/Player/Player.js`
- **Changes**:
  - When **votes are hidden** and the player has voted: keep showing card back (e.g. `img/back.png`); no change.
  - When **votes are revealed**:
    - If **points mode**: keep current behavior — `img/${player.point}.png`.
    - If **T-shirt mode**: `player.point` is a string (e.g. `"M"`). Instead of an image, render the **size as text** in a styled div/card (e.g. same size as the card area, centered, readable font).
  - Pass `mode` from Table so Player knows which display to use.

- **File**: `src/components/Table/Table.js`
- **Changes**:
  - Accept `mode` prop and pass it to each `Player`.

### 3.7 Helpers (player and math)

- **File**: `src/libraries/playerHelper.js`
- **Changes**:
  - **Unvoted**: Today “unvoted” is `point === 0`. For T-shirt, “unvoted” is `point === ""` (or `point === 0` for backward compatibility). Refactor into a small helper, e.g. `isUnvoted(point, mode)` that returns `true` when `(mode === 'points' && point === 0) || (mode === 'tshirt' && point === '')` (and optionally treat missing/undefined as unvoted).
  - **allPlayersVoted(players, mode)**: use `isUnvoted` so it works for both modes.
  - **isConsistent(players, mode)**: for points, keep current logic; for T-shirt, “consistent” means all (connected, voted) players have the same string `point`.
  - **getUserPoint**: already returns `players[userName].point`; works for both number and string.

- **File**: `src/libraries/mathHelper.js`
- **Changes**:
  - **getAvgPoint**: only used in points mode. In Room, call it only when `mode === 'points'`. No change inside `getAvgPoint` if it’s never called with string points. Optionally add a guard (e.g. filter out non-numeric `point`) for safety.

### 3.8 Clear votes and show votes

- **Room.js** (and optionally **database.js**):
  - **Clear votes**: In T-shirt mode, clear to `""` instead of `0`. Either:
    - Implement `clearVotes(mode)` in `database.js` that sets `point` to `0` or `""` by mode, or
    - Have Room call a T-shirt-specific clear that writes `""`, or
    - Use a single clear that sets `point` to a value derived from session type (e.g. read `sessionType` once and then set `0` or `""`).
  - **Show votes**: Same as today for T-shirt (set `showPoints`); only the label next to the button changes (no “Avg = X pt” in T-shirt mode).

### 3.9 Styling

- **New or shared**: Reuse `Cards.scss` for T-shirt card layout (e.g. same `. __cards__card` height and hover), or add `TshirtCards.scss` with the same structure so XS–XXL cards look like the existing card strip.
- **Player**: Add a class for the “revealed T-shirt size” (e.g. `.__player__size`) so the text is clearly visible and matches the card style (font size, weight, alignment).

### 3.10 Assets and accessibility

- **Assets**: No new images required if T-shirt cards are text-only. If you later add icons for XS–XXL, they can live under `public/img/` (e.g. `tshirt-xs.png`) and be referenced from `TshirtCards` or `Player` when showing the revealed size.
- **Accessibility**: Ensure T-shirt cards and the revealed size text have proper labels (e.g. `aria-label` or visible text) so screen readers announce the chosen size.

---

## 4. Testing and edge cases

- **Existing sessions**: Sessions created before this change have no `sessionType`; treat as `"points"` so existing links and data keep working.
- **Mixed URL and data**: If someone bookmarks `/tshirt/mySession` but the session was created as points (or vice versa), prefer the **URL** so the UI and cards match what the user expects.
- **Observer**: Observer link for T-shirt should be `/tshirt/:sessionName?observer`; Room already handles `?observer` for hiding the voting controls.
- **Consistency / confetti**: Reuse the same confetti logic when `isConsistent(players, mode)` is true (all same point in points mode, all same size in T-shirt mode).

---

## 5. Suggested implementation order

1. **Routing**: Add `/tshirt/:sessionName` and pass `mode` into Room.
2. **SignIn**: Add session type choice and navigate to `/` or `/tshirt/...`.
3. **TshirtCards**: New component with XS–XXL labels; wire click to `db.setPoint(size)`.
4. **Room**: Use TshirtCards when `mode === 'tshirt'`; hide “Avg” and adjust Clear/Show votes for T-shirt.
5. **playerHelper**: Add `isUnvoted`, then update `allPlayersVoted` and `isConsistent` for `mode`.
6. **Player**: When `mode === 'tshirt'` and revealed, show `player.point` as text.
7. **database**: Optional `sessionType` and `clearVotes(mode)`; then wire SignIn/Room.
8. **Styling and polish**: TshirtCards and Player size text; accessibility and any links (e.g. observer).

---

## 6. File checklist

| File | Action |
|------|--------|
| `src/components/App/App.js` | Add route `/tshirt/:sessionName`, pass `mode` to Room |
| `src/components/SignIn/SignIn.js` | Add session type choice; navigate to `/` or `/tshirt/...` |
| `src/components/Room/Room.js` | Derive `mode`, render TshirtCards vs Cards, pass `mode` to Table, adjust Show/Clear and Avg |
| `src/components/Cards/Cards.js` | No change (or extend with mode if you choose Option B) |
| `src/components/Cards/TshirtCards.js` | **New**: XS–XXL cards, `db.setPoint(size)` |
| `src/components/Cards/TshirtCards.scss` | **New** (or reuse Cards.scss): card strip styling for text labels |
| `src/components/Table/Table.js` | Accept `mode`, pass to Player |
| `src/components/Player/Player.js` | Accept `mode`; when revealed and t-shirt, show size as text |
| `src/libraries/playerHelper.js` | `isUnvoted(point, mode)`; `allPlayersVoted(players, mode)`; `isConsistent(players, mode)` |
| `src/libraries/database.js` | Optional: `sessionType`, `clearVotes(mode)`; ensure `setPoint` supports string |
| `src/libraries/mathHelper.js` | Optional guard in `getAvgPoint`; Room only calls in points mode |

---

This plan reuses the existing Room, Table, Player, and database flow while introducing a clear path and component set for T-shirt sizing with XS–XXL on the cards.
