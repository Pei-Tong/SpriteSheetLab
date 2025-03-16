# SpriteSheetLab

## Project Overview
A 2D game project developed with React Native, demonstrating the integration of sprite animations and physics engine. The monster character can perform actions such as jumping and walking while interacting with candles in the scene.

## Key Features
- Sprite Character Animation System
  - Monster character features multiple animation states: idle, walk, fall, and die
  - Smooth frame animation transitions using rn-sprite-sheet
  - Automatic animation state changes based on physics engine status
- Physics Engine Integration
  - Realistic physical effects implemented using Matter.js
  - Comprehensive gravity system and collision detection
  - Precise ground collision and boundary handling
  - Customized physics parameter tuning
- Interactive Elements
  - Clickable candle objects (left and right)
  - Responsive character state changes
  - Collision-triggered event system

## Technical Architecture
- React Native: Cross-platform mobile application framework
- Matter.js: 2D physics engine
- rn-sprite-sheet: Sprite animation handler
- Expo: Development environment and toolchain

## Installation Guide
1. Clone the repository
```bash
git clone https://github.com/Pei-Tong/SpriteSheetLab.git
```

2. Install dependencies
```bash
cd SpriteSheetLab
npm install
```

3. Start development server
```bash
npm start
```

## Project Structure
```
src/
├── components/     # Game components
│   ├── Monster.js  # Monster character component
│   ├── Candle.js   # Interactive candle object
│   └── Edges.js    # Scene boundary component
├── entities/       # Game entities
│   └── index.js    # Entity initialization config
├── Constants.js    # Game constants definition
└── Physics.js      # Physics engine and collision logic

assets/            # Game resources
├── monster.png    # Monster sprite sheet
├── candle.png     # Candle image
└── background.png # Game background
```

## Game Mechanics
- Physical Properties
  - Monster character naturally falls under gravity
  - Automatically switches to idle animation upon landing
  - Collision detection ensures proper interaction behavior
- Interactive Mechanics
  - Click monster to trigger walking animation
  - Click candles to toggle their illumination state
  - Touching the right candle triggers death animation
- Physics Parameters
  - Air friction: 0.04 (controls falling speed)
  - Ground friction: 1.0 (prevents sliding)
  - Restitution: 0.0 (eliminates bouncing)
  - Density: 0.0005 (adjusts weight)

## Developer
- Pei-Tong

## License
MIT License
