# GrammarDrill - Specification Document

## Project Overview

**Project Name:** GrammarDrill
**Project Type:** Mobile-optimized SPA (Single Page Application)
**Core Functionality:** A gamified grammar training app with multiple choice questions for various languages, starting with Italian.
**Target Users:** Language learners seeking quick grammar practice on mobile devices.

---

## Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Architecture:** Single Page Application (SPA)
- **Storage:** LocalStorage for high scores
- **No build step required** - runs directly in browser

---

## UI/UX Specification

### Screens

1. **Start Screen**
   - App title
   - Level selector (A1-C2 dropdown)
   - Current high score display
   - "Start" button

2. **Game Screen**
   - Score display (top-left)
   - Streak counter (top-right)
   - Question prompt area
   - 4 answer buttons (2x2 grid)
   - Feedback overlay (correct/wrong + answer)
   - "Quit" button

3. **Game Over Screen**
   - "Game Over" message
   - Final score
   - Total questions answered
   - New high score indicator (if applicable)
   - "Play Again" button
   - "Home" button

### Navigation Flow

```
Start Screen → Game Screen ↔ Game Over Screen
                ↑                      │
                └──────────────────────┘
```

### Visual Design

**Color Palette:**
- Background: `#fafafa` (off-white)
- Primary text: `#1a1a1a` (near-black)
- Primary accent: `#2563eb` (blue)
- Correct answer: `#16a34a` (green)
- Wrong answer: `#dc2626` (red)
- Button background: `#ffffff`
- Button border: `#e5e5e5`
- Disabled/used: `#a3a3a3`

**Typography:**
- Font family: System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- Question text: 24px, medium weight
- Button text: 20px, medium weight
- Score/stats: 18px, regular weight
- Small text: 14px

**Spacing:**
- Base unit: 8px
- Screen padding: 24px
- Button gap: 12px
- Section gap: 24px

**Touch Targets:**
- Minimum button height: 64px
- Button padding: 16px
- Border radius: 12px

---

## Functionality Specification

### Core Features

1. **Level Selection**
   - Levels: A1, A2, B1, B2, C1, C2
   - Default: A1
   - Stored in session (resets on page reload)

2. **Question Generation**
   - Questions generated randomly based on language pack logic
   - Each question has: prompt, 4 choices, correct answer index, explanation
   - Questions are multiple choice (4 options)

3. **Scoring System**
   - Start score: 0
   - Correct answer: +1 point
   - Wrong answer: -1 point
   - Game over: score drops to 0 or below
   - Track streak (consecutive correct answers)
   - Track total questions answered in session

4. **Answer Feedback**
   - On answer: highlight selected choice
   - Show correct answer (green if correct, red if wrong)
   - Show brief explanation
   - Auto-advance after 1.5 seconds

5. **High Score**
   - Global high score across all levels
   - Stored in LocalStorage key: `grammadrill_highscore`
   - Displayed on start screen
   - Updated on game over if new high score

### Language Pack Interface

Each language pack lives in `/packages/<ISO_CODE>/` with:

```javascript
// /packages/<ISO_CODE>/index.js
export const meta = {
  code: "it",           // ISO code
  name: "Italian",      // Display name
  levels: ["A1", "A2", "B1", "B2", "C1", "C2"]  // Available levels
};

export function generateQuestion(level) {
  // Returns: {
  //   prompt: "Question text",
  //   choices: ["Option 1", "Option 2", "Option 3", "Option 4"],
  //   correctIndex: 0-3,
  //   explanation: "Brief explanation"
  // }
}
```

### Edge Cases

- No questions available for selected level: Show error, return to start
- LocalStorage unavailable: Graceful degradation (no high score persistence)
- All choices are the same: Shuffle to avoid trivial questions

---

## Italian Language Pack (Initial)

### Available Levels
- A1 (beginner)
- A2 (elementary)
- B1 (intermediate)
- B2 (upper-intermediate)
- C1 (advanced)
- C2 (mastery)

### A1 Topics (Initial)

1. **Present tense conjugation** - Common verbs (*essere*, *avere*, *mangiare*, *bere*, *andare*, *fare*, *fare*)
2. **Definite articles** - *il*, *lo*, *la*, *i*, *gli*, *le*
3. **Indefinite articles** - *un*, *uno*, *una*
4. **Basic questions** - *Che ore sono?*, *Chi è?*, *Dove vai?*

---

## Acceptance Criteria

1. ✅ App loads without errors on mobile and desktop browsers
2. ✅ Level can be selected from dropdown
3. ✅ Questions display with 4 tappable answer buttons
4. ✅ Correct answer shows green feedback
5. ✅ Wrong answer shows red feedback with correct answer
6. ✅ Score updates correctly (+1/-1)
7. ✅ Streak counter increments on correct, resets on wrong
8. ✅ Game over triggers when score ≤ 0
9. ✅ High score persists in LocalStorage
10. ✅ New high score is highlighted on game over
11. ✅ All touch targets are at least 64px tall
12. ✅ Language pack can be swapped by replacing /packages/it/ directory