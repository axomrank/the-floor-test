# The Floor Test - Constitutional Majority Simulator

An interactive, responsive, single-page educational web application designed to help candidates mastering high-stakes Indian competitive exams (e.g., UPSC CSE) understand the mathematical formulas and operational mechanics of parliamentary floor tests.

## Features

1. **Architecture & State Management**: 
   - SPA implementation in vanilla HTML5, CSS3, and JavaScript.
   - Persistent `localStorage` tracking of User XP, unlocked chapters, and dynamic ranks (ranging from **Backbencher** to **Prime Minister**).
   - Sidebar drawer containing chapter unlock controls and progress resets.

2. **Phase 1: Learn Interface**:
   - Tinder-style swipeable/clickable concept cards breaking down definitions.
   - Professional interactive visualization (rendered on HTML5 Canvas) mimicking Python Seaborn/R-Studio output formats.
   - Real-time sliders allowing adjustment of **Total Strength**, **Vacancies**, and **Absentees**, which dynamically recalculate and map passing thresholds.
   - Cinematic horizontal scrolling historical case timelines (e.g., the 1956 States Reorganisation Act, GST Act passage, etc.).

3. **Phase 2: Play Simulator**:
   - HTML5 Drag and Drop division lobby.
   - Drag political factions representing specific block voting strengths (e.g., Ruling Coalition, Opposition, Independents) into **Aye** or **Nay** zones.
   - Immediate mathematical validation against specific constitutional thresholds on submit.

4. **Phase 3: Examine Module**:
   - High-rigor, multi-variable constitutional word problems matching top-tier competitive level examinations.
   - Time-attack logic with a strict 25-second countdown timer.
   - Automatically provides detailed legal remedy formula analysis and deducts/adds XP dynamically based on results.

## Layout and Styling
- Modern, institutional aesthetics featuring Deep Navy (`#1a365d`), Gold (`#c59b27`), and Crisp White (`#ffffff`).
- Fully mobile-responsive flex and grid setups.
- Glassmorphism textures and fluid state transitions.

## How to Run locally on Ubuntu
You can host the application using any local web server. For convenience, a Python server is active:

1. Open your terminal in the workspace directory.
2. Run the server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)
