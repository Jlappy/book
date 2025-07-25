import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy giỏ hàng' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { bookId, quantity } = req.body;
    if (typeof bookId !== 'string' || !bookId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Dữ liệu thêm vào giỏ hàng không hợp lệ.' });
    }
    const cart = await cartService.addToCart(userId, bookId, quantity);
    res.status(200).json(cart);
  } catch (error: any) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi thêm vào giỏ hàng' });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { bookId, quantity } = req.body;
    if (typeof bookId !== 'string' || !bookId || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Dữ liệu cập nhật số lượng không hợp lệ.' });
    }
    const cart = await cartService.updateQuantity(userId, bookId, quantity);
    res.json(cart);
  } catch (error: any) {
    console.error('Lỗi khi cập nhật số lượng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật số lượng' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { bookId } = req.params;
    if (typeof bookId !== 'string' || !bookId) {
      return res.status(400).json({ message: 'ID sách không hợp lệ.' });
    }
    const cart = await cartService.removeFromCart(userId, bookId);
    res.json(cart);
  } catch (error: any) {
    console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi xóa khỏi giỏ hàng' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const cart = await cartService.clearCart(userId);
    res.json(cart);
  } catch (error: any) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi xóa giỏ hàng' });
  }
};

export const getCartByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    res.json(cart);
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};