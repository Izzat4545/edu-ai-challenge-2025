# Sea Battle Game

A modern implementation of the classic Sea Battle game using Node.js and ES6+ features.

## Features

- 10x10 game board
- 3 ships per player, each 3 units long
- Turn-based gameplay
- Smart computer opponent with 'hunt' and 'target' modes
- Modern ES6+ code structure
- Comprehensive unit tests

## Code Structure

The codebase has been refactored to follow modern JavaScript practices and design patterns:

```
src/
├── models/
│   ├── Board.js    - Handles game board logic
│   ├── Ship.js     - Manages ship state and behavior
│   ├── Player.js   - Controls player actions and state
│   └── Game.js     - Main game logic and state management
├── index.js        - Game interface and user interaction
└── tests/          - Unit tests for all components
```

## Key Improvements

1. **Modern JavaScript Features**

   - ES6+ syntax (classes, arrow functions, destructuring)
   - Proper module system
   - Async/await for handling user input
   - Modern data structures (Sets, Maps)

2. **Code Organization**

   - Clear separation of concerns
   - Object-oriented design with proper encapsulation
   - Modular architecture
   - Reduced global state

3. **Testing**

   - Comprehensive unit tests using Jest
   - Test coverage for all core components
   - Automated test runner

4. **Game Logic Improvements**
   - More robust ship placement
   - Better computer AI with hunt/target modes
   - Improved error handling
   - Cleaner game state management

## How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the game:

   ```bash
   npm start
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Game Rules

1. The game is played on a 10x10 grid
2. Each player has 3 ships, each 3 units long
3. Ships are placed randomly on the board
4. Players take turns guessing coordinates (e.g., "00", "34")
5. "X" marks a hit, "O" marks a miss
6. The first player to sink all opponent's ships wins

## Test Coverage

The codebase includes comprehensive unit tests covering:

- Board initialization and manipulation
- Ship placement and state management
- Player actions and game logic
- Computer AI behavior
- Game state management

Run `npm test` to see the test coverage report.
