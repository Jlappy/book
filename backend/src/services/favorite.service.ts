import mongoose from 'mongoose';
import User from '../models/user.model';
import Book from '../models/book.model';

export const getFavorites = async (userId: string): Promise<string[]> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tìm thấy');
  return user.favorites;
};

export const getFavoriteBooks = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tìm thấy');

    // Convert string IDs to ObjectId
    const bookObjectIds = user.favorites.map(id => new mongoose.Types.ObjectId(id));

    const favoriteBooks = await Book.find({
      _id: { $in: bookObjectIds },
    });

    return favoriteBooks
  } catch (err) {
    console.error(err);
    throw new Error('Internal server error')
  }
};

export const addFavorite = async (userId: string, bookId: string): Promise<string[]> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tìm thấy');
  if (!user.favorites.includes(bookId)) {
    user.favorites.push(bookId);
    await user.save();
  }
  return user.favorites;
};

export const removeFavorite = async (userId: string, bookId: string): Promise<string[]> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tìm thấy');
  user.favorites = user.favorites.filter(id => id !== bookId);
  await user.save();
  return user.favorites;
};