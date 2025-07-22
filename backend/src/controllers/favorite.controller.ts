import { Request, Response } from 'express';
import * as favoriteService from '../services/favorite.service';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const result = await favoriteService.getFavorites(userId);
    res.json(result);
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách yêu thích' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { bookId } = req.body;
    if (typeof bookId !== 'string' || !bookId) {
      return res.status(400).json({ message: 'ID sách không hợp lệ.' });
    }
    const result = await favoriteService.addFavorite(userId, bookId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi thêm vào danh sách yêu thích' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { bookId } = req.params;
    if (typeof bookId !== 'string' || !bookId) {
      return res.status(400).json({ message: 'ID sách không hợp lệ.' });
    }
    const result = await favoriteService.removeFavorite(userId, bookId);
    res.json(result);
  } catch (error: any) {
    console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi xóa khỏi danh sách yêu thích' });
  }
};