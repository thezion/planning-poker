# Contributing to Planning Poker

Thank you for your interest in contributing to Planning Poker. This document outlines the development practices and conventions used in this project.

## Development Setup

### Prerequisites
- Node.js (version 12 or higher)
- npm or yarn package manager

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Run tests: `npm test`

## Project Structure

The application follows a component-based architecture with clear separation of concerns:

- `src/components/` - React components organized by feature
- `src/store/` - Redux store configuration and slices
- `src/libraries/` - Utility functions and helper modules
- `src/styles/` - Global styles and SCSS variables
- `src/hoc/` - Higher-order components for shared behavior

## Code Style and Conventions

### General Principles
- Write declarative and expressive code
- Prioritize readability over cleverness
- Use immutable data structures
- Keep functions small and focused
- Follow SOLID principles
- Adhere to DRY (Don't Repeat Yourself) principle

### JavaScript/React Conventions
- Use ES6+ features including arrow functions
- Use functional components with hooks (one ErrorBoundary class component exists for error handling)
- Use meaningful variable and function names
- Avoid global variable assignments
- Handle errors gracefully with proper error boundaries
- Implement PropTypes validation (already used in several components)

### Component Organization
- Each component has its own directory with component file (.js) and styles (.scss)
- Only App component currently includes a test file (.test.js)
- Keep components focused on a single responsibility
- Extract reusable logic into utility functions in the `libraries/` directory

### State Management
- Use Redux Toolkit with `createSlice` for state management
- Keep state normalized and minimal
- Access state directly using `useSelector`
- Handle async operations with Redux Thunk (available but database operations use Firebase directly)

### Styling
- Use SCSS for styling with SCSS variables (defined in `src/styles/variables.scss`)
- Use custom CSS classes with double dash modifiers (e.g., `--active`, `--with-dash`)
- Maintain consistent spacing and responsive design principles
- Components include responsive breakpoints (`--sm`, `--md`, `--lg`)

## Testing

### Testing Philosophy
- Write deterministic tests that don't rely on external state
- Focus on testing behavior rather than implementation details
- Use React Testing Library for component testing (already configured)
- Maintain reasonable test coverage for critical components

### Testing Requirements
- Add tests for new components when appropriate
- Test edge cases and error conditions
- Mock external dependencies appropriately
- Ensure tests are maintainable and readable

**Note**: Currently, only the App component has a test file. Consider expanding test coverage as the project grows.

## API and Data Conventions

### Database and API Design
- Firebase Realtime Database is used for real-time data synchronization
- Database operations are handled through the `libraries/database.js` module
- Implement consistent error handling patterns
- Follow Firebase best practices for data structure and security rules

### Firebase Integration
- Firebase operations are centralized in the `libraries/database.js` module
- Use Firebase Realtime Database for live data synchronization
- Environment variables are used for Firebase configuration
- Handle connection failures gracefully with proper error reporting

## Development Workflow

### Code Quality
- ESLint is configured through Create React App with custom rules
- Ensure tests pass before submitting pull requests (`npm test`)
- Use meaningful commit messages
- Keep commits atomic and focused

### Pull Request Process
1. Create a feature branch from the main branch
2. Implement changes following project conventions
3. Add tests for new components when appropriate
4. Ensure existing tests continue to pass (`npm test`)
5. Submit pull request with clear description of changes
6. Address code review feedback promptly

### Documentation
- Document complex business logic with clear comments explaining "why"
- Update README when adding new features or changing setup requirements
- Keep inline documentation current with code changes
- Focus on documenting intent rather than implementation

## Deployment

The application uses automated deployment triggered by git tags. When creating releases:
- Ensure all tests pass
- Update version numbers appropriately
- Create descriptive release notes
- Test deployment in staging environment when possible

## Performance Considerations

- Components use `React.memo` for preventing unnecessary re-renders
- Lazy loading is implemented for the Analytics component using `React.lazy` and `Suspense`
- Web vitals monitoring is available through `reportWebVitals.js`
- Bundle optimization is handled by Create React App's built-in webpack configuration

## Accessibility

- Use semantic HTML elements where appropriate
- Ensure proper form labels and input associations
- Bootstrap 5 provides baseline accessibility features
- Consider accessibility when adding new interactive elements

## Getting Help

- Review existing code for patterns and conventions
- Ask questions in pull request discussions
- Refer to official documentation for React, Redux, and other dependencies
- Follow established patterns when implementing new features

Remember that consistency is key to maintainable code. When in doubt, follow existing patterns in the codebase and prioritize clarity over complexity. 