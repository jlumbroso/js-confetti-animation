# 🎉 Confetti Animation

A lightweight, customizable confetti animation system extracted and enhanced from GitHub's Copilot celebration page.

## Overview

This confetti animation system provides a fun and engaging way to add celebratory effects to your web pages. It features:

- Multiple animation modes (burst, timed, infinite)
- Customizable colors and behavior
- Smooth particle physics
- Performance optimizations
- Clean, modular code

## Origin

This code was originally extracted from GitHub's Copilot checkout success page, where it creates a celebratory effect. The code was identified and extracted with the help of Anthropic's Claude Sonnet 3.5 AI, then refactored and extended to provide more features and flexibility.

## Usage

1. Include the script in your HTML:
    
    ```html
    <script src="confetti-animation.js"></script>
    ```

2. Create and start the animation:

    ```javascript
    // Basic usage
    const confetti = new Confetti();
    confetti.start();

    // With custom options
    const customConfetti = new Confetti({
        colors: ['#FFD700', '#FF1493', '#00CED1'],
        fadeOut: true,
        maxParticles: 150,
        gravity: 0.15,
        drift: 0.3
    });

    // Different animation modes
    confetti.start('untilComplete');  // Single burst
    confetti.start(5000);            // Run for 5 seconds
    confetti.start(null);            // Run indefinitely

    // Stop the animation
    confetti.stop();
    ```

### Configuration Options

- `colors`: Array of color hexcodes
- `streamingMode`: Boolean for continuous particle spawning
- `spawnRate`: Time between particle spawns (ms)
- `gravity`: Base fall speed
- `drift`: Horizontal movement range
- `rotationSpeed`: Base rotation speed
- `fadeOut`: Enable fade out at bottom
- `maxParticles`: Maximum particles on screen

## Demo

Check out `index.html` for a complete implementation example showing different animation modes and styles.

## License

This project is released under The Unlicense.
