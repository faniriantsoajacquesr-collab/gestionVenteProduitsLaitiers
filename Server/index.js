import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Get absolute path to the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load environment variables using an absolute path to the config folder
const envFound = dotenv.config({ path: path.resolve(__dirname, 'config', '.env') });
if (envFound.error) {
  console.warn("⚠️ Warning: Could not find .env file at the specified path.");
}

import cors from 'cors';
import morgan from 'morgan'; // For logging requests in the terminal

// Import Routers
import authRoutes from './client/routes/authRoutes.js';
import productRoutes from './client/routes/productRoutes.js';
import cartRoutes from './client/routes/cartRoutes.js';
import orderRoutes from './client/routes/orderRoutes.js';
import userRoutes from './client/routes/userRoutes.js';

// Admin Routers
import adminProductRoutes from './admin/routes/productRoutes.js';
import adminOrderRoutes from './admin/routes/orderRoutes.js';
import adminUserRoutes from './admin/routes/userRoutes.js';
import adminUploadRoutes from './admin/routes/uploadRoutes.js';

import { supabase } from './config/supabase.js';

const app = express();

// --- 1. GLOBAL MIDDLEWARE ---

// Allow your React apps to access this API
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',    // Client app
    'http://localhost:5174',                               // Admin app
    'http://localhost:5175',                               // Backup port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Logger to see requests in the console 
app.use(morgan('dev'));

// Parse incoming JSON requests
app.use(express.json());

// Serve static files (for images stored in a local public or uploads folder)
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Global middleware to attach Supabase client to the request object
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// --- 2. MOUNT ROUTES ---

// Auth: Login, Register, Profile Me
app.use('/api/auth', authRoutes);

// Client Routes
// Products: Catalog, Details, Admin CRUD
app.use('/api/products', productRoutes);

// Cart: Add to bag, View bag
app.use('/api/cart', cartRoutes);

// Orders: Checkout and History
app.use('/api/orders', orderRoutes);

// Users: Admin management and Profile updates
app.use('/api/users', userRoutes);

// Admin Routes
// Admin Products Management
app.use('/api/admin/products', adminProductRoutes);

// Admin Orders Management
app.use('/api/admin/orders', adminOrderRoutes);

// Admin Users Management
app.use('/api/admin/users', adminUserRoutes);

// Admin Upload Management
app.use('/api/admin/upload', adminUploadRoutes);

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