import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import receiptRoutes from './routes/receipt_routes.js';
import { runTests } from './testRunner.js'; // Import the test runner

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();

// Middleware
app.use(express.static('public'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Routes
app.use('/receipts', receiptRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Run tests before starting the server
runTests().then(() => {
  // Server listener
  app.listen(PORT, function () {
    console.log(`Successfully started server on port ${PORT}!`);
  });
}).catch(err => {
  console.error('Tests failed:', err);
  process.exit(1);
});