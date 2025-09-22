# Node.js TypeScript API Boilerplate

A robust boilerplate for building scalable Node.js APIs using TypeScript and Express.js.

## Features

- **TypeScript Support**: Full TypeScript integration with proper configuration
- **Express.js**: Fast, unopinionated web framework
- **Environment Configuration**: Using `dotenv` with Zod schema validation
- **Error Handling**: Global error handler with custom error classes
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
- **Development Tools**:
  - Hot reload with ts-node-dev
  - Source map support
  - Path aliases

## Project Structure

```
src/
  ├── config/         # Configuration files
  │   └── env.ts     # Environment variables configuration
  ├── middleware/     # Express middlewares
  │   ├── errorHandler.ts  # Global error handling middleware
  │   └── errors.ts       # Custom error classes and factories
  ├── app.ts         # Express app setup and middleware
  └── server.ts      # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/danielevilela/nodejs-api-boilerplate.git
cd nodejs-api-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```

The server will start on the port specified in your .env file (default: 3000).

## Environment Variables

The following environment variables can be configured in your .env file:

```bash
NODE_ENV=development    # development, production, or test
PORT=3000              # Port number for the server
API_PREFIX=/api        # Prefix for all API routes
```

All environment variables are validated using Zod schema validation.

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if files are properly formatted

## Code Quality

### ESLint

The project uses ESLint with TypeScript support for code linting. Configuration can be found in `eslint.config.js`.

Key features:

- TypeScript-specific rules
- Prettier integration
- Custom rules for unused variables and type safety

### Prettier

Prettier is configured for consistent code formatting. Configuration can be found in `.prettierrc`.

Settings include:

- Single quotes
- Semicolons
- 100 characters line length
- 2 spaces indentation

## Error Handling

The project includes a robust error handling system:

- Custom `AppError` class for operational errors
- Global error handling middleware
- Built-in error factories for common HTTP errors
- Environment-specific error responses
- Validation error handling with Zod
