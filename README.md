# Planning Poker

A real-time, collaborative planning poker application for agile teams to estimate the relative size and complexity of tasks. Built with React, Redux, and Firebase for seamless real-time synchronization across team members.

## Features

- **Real-time Collaboration** - Synchronize votes and game state across all participants instantly using Firebase Realtime Database
- **Multiple Estimation Methods** - Choose between Fibonacci sequence (0, 0.5, 1, 2, 3, 5, 8, 13) or T-shirt sizing (XS, S, M, L, XL, XXL)
- **Analytics Dashboard** - View voting statistics, charts, and consensus analysis after each round
- **Celebration Animations** - Confetti and holiday-themed animations when consensus is reached
- **Room-based Sessions** - Create private rooms with unique codes for your team
- **Player Management** - Add/remove players, track online status, and manage spectators
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Offline Detection** - Gracefully handles connection issues and displays offline status

## Play Online

Try it live at [https://planning-poker.appsample.com](https://planning-poker.appsample.com)

## Tech Stack

- **Frontend**: React 17, Redux Toolkit, React Router
- **Styling**: Bootstrap 5, SCSS with custom variables
- **Backend**: Firebase Realtime Database
- **Analytics**: Chart.js for visualizations
- **Build Tool**: Create React App 4, webpack 4
- **Testing**: Jest, React Testing Library

## Local Development

### Prerequisites

- **Node.js 24** (see `.nvmrc`)
- npm package manager
- Firebase account (for real-time features)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd planning-poker
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration (see `.env.example` if available)

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`.

**Note**: The app uses `NODE_OPTIONS=--openssl-legacy-provider` for compatibility with Node 18+ and the current Create React App 4 / webpack 4 tooling.

### Available Scripts

- `npm start` - Run the development server
- `npm build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run format` - Format code using Prettier

### Run with Docker

```bash
docker run -d -t --name planning-poker -p 3001:3000 -v ${PWD}:/app node:24
```

Access the app at `http://localhost:3001`.

## Project Structure

```
planning-poker/
├── src/
│   ├── components/        # React components
│   │   ├── App/          # Main application component
│   │   ├── Cards/        # Fibonacci and T-shirt card components
│   │   ├── Player/       # Player management
│   │   ├── Room/         # Room/session management
│   │   ├── Table/        # Game table UI
│   │   ├── Analytic/     # Analytics dashboard
│   │   ├── Animation/    # Confetti and holiday animations
│   │   └── ...
│   ├── store/            # Redux store configuration
│   ├── libraries/        # Utility functions and helpers
│   ├── styles/           # Global styles and SCSS variables
│   └── hoc/              # Higher-order components
├── public/               # Static assets
├── firebase/             # Firebase functions and config
└── lambda/               # AWS Lambda deployment option
```

## Deployment

### Automated Deployment

Creating a new git tag will automatically trigger the deployment pipeline:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Manual Deployment

The application supports deployment to multiple platforms:

- **GitHub Pages** - Configured via GitHub Actions
- **Firebase Hosting** - See `firebase/` directory
- **AWS Lambda** - See `lambda/` directory

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development practices, and the process for submitting pull requests.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Follow the code style and conventions outlined in [CONTRIBUTING.md](CONTRIBUTING.md)
4. Write tests for new features when appropriate
5. Ensure all tests pass (`npm test`)
6. Format your code (`npm run format`)
7. Commit your changes with a descriptive message
8. Push to your branch and open a pull request

## License

This project is available as open source. See the LICENSE file for more details.

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.
