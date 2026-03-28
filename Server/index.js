import dotenv from 'dotenv';
// Load environment variables immediately from the correct path
dotenv.config({ path: './config/.env' });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // For logging requests in the terminal

// Import Routers
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// --- 1. GLOBAL MIDDLEWARE ---

// Allow your React app to access this API
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Logger to see requests in the console 
app.use(morgan('dev'));

// Parse incoming JSON requests
app.use(express.json());

// --- 2. MOUNT ROUTES ---

// Auth: Login, Register, Profile Me
app.use('/api/auth', authRoutes);

// Products: Catalog, Details, Admin CRUD
app.use('/api/products', productRoutes);

// Cart: Add to bag, View bag
app.use('/api/cart', cartRoutes);

// Orders: Checkout and History
app.use('/api/orders', orderRoutes);

// Users: Admin management and Profile updates
app.use('/api/users', userRoutes);

// --- 3. BASIC HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('API Gestion de Vente Laitière is running...');
});

// --- 4. ERROR HANDLING MIDDLEWARE ---
// Catch-all for 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Final error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  --------------------------------------------------
   Dairy Shop Server Running
   Port: ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}
  --------------------------------------------------
  `);
});