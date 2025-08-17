# Snake Game JavaScript

[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci-cd.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

A classic Snake game implemented in JavaScript, HTML, and CSS with modern web technologies, comprehensive testing, and automated CI/CD deployment.

## 🎮 [Play the Game](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

## Features

- 🐍 Classic Snake gameplay with smooth controls
- 🎨 Beautiful underwater tank theme with animated bubbles
- 🔊 Sound effects for game actions
- 📱 Responsive design for mobile and desktop
- ⏸️ Pause functionality (Press 'P')
- 🏆 High score tracking with localStorage
- 🎯 Collision detection for walls and snake body
- 🐠 Animated food (fish) with visual effects

## How to Play

1. Use the **arrow keys** to control the snake
2. Eat the red fish to grow and increase your score
3. Avoid hitting the walls or the snake's own body
4. Press **'P'** to pause/unpause the game
5. Try to beat your high score!

## Development

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

The project includes comprehensive unit tests using Vitest:

- **Collision Detection**: Tests for snake body and wall collisions
- **Food Generation**: Validates food placement within game boundaries
- **Direction Controls**: Tests all movement directions and reverse prevention
- **Game State Management**: Tests game reset and state management functions

Run tests with:
```bash
npm test
```

## Project Structure

```
├── .github/workflows/    # GitHub Actions CI/CD
├── src/                  # Source files
│   └── smoke.test.ts    # Basic smoke tests
├── img/                  # Game images and assets
├── audio/               # Game sound effects (optional)
├── index.html           # Main HTML file
├── snake.js             # Game logic
├── snake.test.js        # Unit tests
├── style.css            # Game styling
├── vite.config.js       # Vite configuration
├── vitest.config.js     # Test configuration
└── package.json         # Project dependencies and scripts
```

## CI/CD Pipeline

This project uses GitHub Actions for:

- **Continuous Integration**: Runs tests on every push and pull request
- **Automated Deployment**: Deploys to GitHub Pages on successful builds
- **Cross-platform Testing**: Tests on Ubuntu latest

### Setting up GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The site will be automatically deployed on every push to main/master

## Technologies Used

- **JavaScript (ES6+)**: Core game logic
- **HTML5 Canvas**: Game rendering
- **CSS3**: Styling and animations
- **Vite**: Build tool and development server
- **Vitest**: Testing framework
- **jsdom**: DOM testing environment
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Original concept inspired by the classic Snake game
- Built with modern web development best practices
- Comprehensive testing and CI/CD implementation

---

**Note**: Remember to replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name in the URLs above.