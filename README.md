# Node.js TypeScript API Boilerplate

A minimalist boilerplate for building Node.js APIs using TypeScript and Express.

## Features

- TypeScript support
- Express.js for API routing
- ES Modules
- Development server with hot-reload
- Production build setup
- Basic project structure

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

To start the development server with hot-reload:

```bash
npm run dev
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create a `dist` folder with the compiled JavaScript files.

### Running in Production

To run the production build:

```bash
npm start
```

## Project Structure

```
src/
  ├── app.ts      # Express app setup and middleware
  └── server.ts   # Server entry point
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production server

## License

ISC
