# Codebase Context: The Floor Test (Constitutional Majority Simulator)

This document provides a comprehensive overview of the design, codebase structure, state management, features, and coding rules for **The Floor Test**, an interactive gamified study web application designed to teach candidates Indian constitutional parliamentary majorities.

---

## 1. Project Architecture

The application is built as a highly interactive, responsive, **Single Page Application (SPA)** using native web standards:
*   **HTML5** (`index.html`): Declares the document structure, sidebars, tabs, modals, and container nodes.
*   **CSS3** (`style.css`): Directs a premium, institutional dark-theme design system featuring Deep Navy, Gold, Glassmorphism, custom typography (Outfit & Space Grotesk), and responsive grid/flex layout utilities.
*   **JavaScript** (`app.js`): Houses the entire application database, game state, reactivity, UI bindings, HTML5 Canvas renderer, drag-and-drop mechanics, and time-attack quiz loop.

---

## 2. Global State Management

All user progress and navigation status are stored in a single global `state` object in memory, which is synchronized with the browser's `localStorage` (`floor_test_state` key) upon updates:

```javascript
let state = {
    xp: 0,
    rank: "Backbencher",
    unlockedChapters: [1],
    currentChapter: 1,
    currentTab: "learn",
    currentCardIndex: 0
};
```

### Essential State Functions:
*   `loadState()`: Invoked on load to restore XP, rank, unlocked chapters, and active states. Re-renders progress indicators and unlocks sidebar selectors.
*   `saveState()`: Writes current memory state to `localStorage`. Must be called whenever XP, rank, unlocked chapters, or card/tab indices change.
*   `resetProgress()`: Re-initializes state to defaults, clears the local storage, and loads Chapter 1.
*   `addXP(amount)` / `deductXP(amount)`: Mutates XP, determines rank elevations, fires the level-up notification modals, and saves state.

---

## 3. Chapter Structure (`CHAPTERS_DATA`)

The core education syllabus is defined under a nested dictionary structure `CHAPTERS_DATA` in `app.js`. The database maps chapter numbers to detailed objects containing the following schema:

```typescript
interface Chapter {
    title: string;
    subtitle: string;
    ruleName: string;
    ruleFormula: string;
    concepts: Array<{ term: string; desc: string; tip: string }>;
    timeline: Array<{ year: string; title: string; desc: string; lesson: string }>;
    simulator: {
        title: string;
        desc: string;
        totalSeats: number;
        vacancies: number;
        absent: number;
        factions: Array<{ id: string; name: string; size: number; coalition: 'Treasury' | 'Opposition' | 'Neutral' }>;
        verify: (ayes: number, nays: number, presentVoting: number) => { success: boolean; threshold: number; formula: string };
    };
    questions: Array<{ text: string; options: string[]; correctIndex: number; formula: string; explanation: string }>;
}
```

### Active Chapters:
1.  **Chapter 1: Simple Majority** (Ordinary & Money Bills; Confidence/No-Confidence Motions)
    *   *Formula*: `> 50% of present & voting`. (Deducts vacancies, absentees, and abstentions).
2.  **Chapter 2: Effective & Absolute Majority** (Removing Presiding Officers / Gov formation)
    *   *Formula*: `> 50% of Effective Strength` (Total - Vacancies). (Does NOT deduct absentees and abstentions).
3.  **Chapter 3: Special Majority (Art. 368)** (Constitutional Amendments)
    *   *Formula*: `> 50% of Total Strength AND >= 2/3 of Present & Voting` (Double-sieve logic).
4.  **Chapter 4: Presidential Impeachment (Art. 61)** (Special Majority under Article 61)
    *   *Formula*: `>= 2/3 of the Total statutory membership of the House` (Fixed threshold; vacancies, absentees, and abstentions are NOT deducted).

---

## 4. UI Systems & Modules

The application navigation revolves around three core phases corresponding to tabs inside `index.html`:

### A. Learn Tab (`#tab-learn`)
*   **Swipeable Concept Cards**: Uses Tinder-style stack navigation. Only the current card (`state.currentCardIndex`) is visible. Clicking cards shifts visibility to display definition terms, descriptions, and tips.
*   **Dynamic Sliders & Canvas Calculator**:
    *   Sliders: **Total Strength**, **Vacancies**, and **Absentees/Abstentions** are dynamically bounded based on chapter restrictions.
    *   Visualizer: Rendered on an HTML5 canvas element (`#majority-canvas`), reproducing an academic chart showing Total Strength, Effective Strength, Present & Voting, and the calculated Passing Threshold in real-time.
*   **Timeline Reel**: Cinematic horizontal scroll listing historic parliamentary landmarks related to the current chapter's majority type.

### B. Play Tab (`#tab-play`)
*   **Factions Lobby (Drag and Drop)**: Faction blocks representing political voting strength are dragged between the `Supply Area`, `Aye (Yes) Drop Zone`, and `Nay (No) Drop Zone`. When submitted, the selected chapter's `simulator.verify()` script computes the results and outputs an interactive breakdown.
*   **Grid Seat Simulator**: Clickable grid layout representing individual seats of the chamber, allowing users to paint individual seats to Ayes (Green), Nays (Red), or Abstain (Gray) and run manual threshold verifications.

### C. Examine Tab (`#tab-examine`)
*   **High-Stakes Quiz**: Consists of complex constitutional word problems.
*   **Time-Attack Logic**: Users must solve questions under a strict 25-second countdown timer.
*   **Scoring & Validation**: Correct responses award `+100 XP`. Incorrect or timed-out responses deduct `-50 XP`. Reaching 100% correct answers in the chapter's quiz unlocks the subsequent chapter in the sidebar menu.

---

## 5. Progression and Ranking System

The list of user ranks is mapped under the `RANKS` array in `app.js`:

| Rank Name | XP Threshold |
| :--- | :--- |
| **Backbencher** | 0 XP |
| **Constituent Assembly Member** | 200 XP |
| **Member of Parliament** | 450 XP |
| **Cabinet Minister** | 750 XP |
| **Speaker of the House** | 1100 XP |
| **Prime Minister** | 1500 XP |

---

## 6. Guidelines for AI Assistants & Developers

When modifying or expanding this application:
1.  **State Synchronization**: Never modify state properties directly without invoking `saveState()` right after. Ensure UI updates (such as rank displays and chapter lock icons) reflect changes in real-time.
2.  **Chapter Modifications**: To add a new chapter (e.g., Chapter 5 on Art. 249/312 resolutions):
    *   Add the new database record in `CHAPTERS_DATA`.
    *   Add the corresponding list item to the `#chapter-sidebar` in `index.html`.
    *   Update `lockSidebarItems()` to loop over the newly added chapter number.
3.  **Canvas Re-renders**: Keep canvas drawing instructions performant. The Canvas is cleared and completely redrawn on every slider update or window resize to ensure crisp vectors and text.
4.  **UI Consistency**: Retain the dark theme color palette (Deep Navy `#0b1329`, Gold/Amber `#d4af37`, glass boundaries) and avoid adding ad-hoc CSS frameworks or utility classes. Focus styling changes inside `style.css` using custom properties.
5.  **Documentation**: Keep comments clear and descriptive, explaining formula derivations and event handlers.
