import express from 'express';
import session from 'express-session';
import cors from 'cors';
import userRoutes from './routes/user.route';
import bookRoutes from './routes/book.route';
import favoriteRoutes from './routes/favorite.route';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';
import openLibraryRoutes from './routes/openlibrary.route';


const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // BẮT BUỘC LÀ TRUE TRONG PRODUCTION VỚI HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  }
}));

// Định nghĩa các route
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/openlibrary', openLibraryRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route không tìm thấy' });
});

export default app;