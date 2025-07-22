import User from '../models/user.model';

export const getFavorites = async (userId: string): Promise<string[]> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tìm thấy');
  return user.favorites;
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