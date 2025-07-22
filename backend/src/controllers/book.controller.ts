import { Request, Response } from 'express';
import * as BookService from '../services/book.service';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await BookService.getAllBooks();
    res.json(books);
  } catch (error: any) {
    console.error('Lỗi khi lấy tất cả sách:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy sách' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await BookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json(book);
  } catch (error: any) {
    console.error(`Lỗi khi lấy sách theo ID ${req.params.bookId}:`, error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy sách' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const newBookData = req.body;
    const book = await BookService.createBook(newBookData);
    res.status(201).json(book);
  } catch (error: any) {
    console.error('Lỗi khi tạo sách:', error);
    if (error.message.includes('tồn tại')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Lỗi server khi tạo sách' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updatedBookData = req.body;
    const updated = await BookService.updateBook(bookId, updatedBookData);
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật sách ID ${req.params.bookId}:`, error);
    res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật sách' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const deleted = await BookService.deleteBook(bookId);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy sách để xoá' });
    }
    res.json({ message: 'Đã xoá thành công' });
  } catch (error: any) {
    console.error(`Lỗi khi xoá sách ID ${req.params.bookId}:`, error);
    res.status(500).json({ message: error.message || 'Lỗi server khi xoá sách' });
  }
};