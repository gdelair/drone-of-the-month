# Drone of the Month

An immersive generative audio-visual web experience featuring 13 unique monthly drone soundscapes paired with mesmerizing kaleidoscope visuals.

## Overview

**Drone of the Month** is an interactive art project that combines procedural music composition with dynamic 3D visualizations. Each month has its own distinct sonic identity—different musical keys, scales, and modes—matched with unique geometric patterns and animations.

### Features

- **13 Unique Tracks**: January 2025 through January 2026, each with distinctive musical characteristics
- **Generative Music**: Real-time synthesis using Tone.js with evolving drone patterns and probabilistic melodies
- **Kaleidoscope Visuals**: Three.js-powered 3D graphics with rotating geometric shapes
- **Auto-Advancement**: Tracks automatically progress after 20 minutes for continuous listening
- **Dark/Light Themes**: Toggle between modes with persistent preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Musical Characteristics

Each month features unique parameters:
- **Musical Modes**: Major, minor, Dorian, Lydian, Mixolydian, Phrygian, and pentatonic scales
- **Drone Patterns**: Sustained bass tones with evolving harmonic progressions
- **Melody Generation**: Probabilistic note selection creates ever-changing melodic patterns
- **Audio Effects**: Reverb and delay tailored to each track's atmosphere

## Visual Elements

The kaleidoscope effect is created using:
- Multiple geometric shapes (icosahedron, sphere, torus, octahedron, etc.)
- Wireframe and solid materials with custom colors
- Individual and group rotation animations
- Segment-based symmetry for hypnotic patterns

## Technologies

- **[Tone.js](https://tonejs.github.io/)**: Web Audio framework for synthesis and effects
- **[Three.js](https://threejs.org/)**: 3D graphics rendering
- **Vanilla JavaScript**: Core application logic
- **CSS3**: Responsive styling with theme support

## Getting Started

### Live Demo

Visit the live site at: [Insert your deployment URL here]

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/georgedelair/drone-of-the-month.git
cd drone-of-the-month
```

2. Open `index.html` in your browser:
```bash
open index.html
```

That's it! No build process or dependencies required.

## Usage

1. Click the **Play** button to start the experience
2. Select different months from the dropdown to explore various soundscapes
3. Toggle between dark and light themes using the switch
4. Let tracks auto-advance every 20 minutes, or manually switch between them
5. Adjust your volume—these are ambient drones designed for background listening

## Project Structure

```
drone-of-the-month/
├── index.html          # Main HTML structure
├── app.js              # Audio synthesis, visual rendering, and application logic
├── styles.css          # Styling and theme definitions
└── README.md           # This file
```

## Browser Compatibility

Works best in modern browsers with Web Audio API support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Credits

Built by [George DeLair](https://georgedelair.com) and Claude Code

## License

MIT License - Feel free to use, modify, and distribute this project.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/georgedelair/drone-of-the-month/issues).

---

*Experience the evolving soundscape of time through generative audio and visual harmony.*
