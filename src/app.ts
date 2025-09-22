import express from 'express';

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
