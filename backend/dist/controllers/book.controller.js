"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const BookService = __importStar(require("../services/book.service"));
const getAllBooks = async (req, res) => {
    try {
        const { q } = req.query; // q = từ khóa tìm kiếm
        const books = await BookService.getAllBooks(q?.toString());
        res.json(books);
    }
    catch (error) {
        console.error('Lỗi khi lấy tất cả sách:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy sách' });
    }
};
exports.getAllBooks = getAllBooks;
const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await BookService.getBookById(bookId);
        if (!book) {
            return res.status(400).json({ message: 'Không tìm thấy sách' });
        }
        res.json(book);
    }
    catch (error) {
        console.error(`Lỗi khi lấy sách theo ID ${req.params.bookId}:`, error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy sách' });
    }
};
exports.getBookById = getBookById;
const createBook = async (req, res) => {
    try {
        const newBookData = req.body;
        const book = await BookService.createBook(newBookData);
        res.status(201).json(book);
    }
    catch (error) {
        console.error('Lỗi khi tạo sách:', error);
        if (error.message.includes('tồn tại')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Lỗi server khi tạo sách' });
    }
};
exports.createBook = createBook;
const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updatedBookData = req.body;
        const updated = await BookService.updateBook(bookId, updatedBookData);
        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật' });
        }
        res.json(updated);
    }
    catch (error) {
        console.error(`Lỗi khi cập nhật sách ID ${req.params.bookId}:`, error);
        res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật sách' });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const deleted = await BookService.deleteBook(bookId);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy sách để xoá' });
        }
        res.json({ message: 'Đã xoá thành công' });
    }
    catch (error) {
        console.error(`Lỗi khi xoá sách ID ${req.params.bookId}:`, error);
        res.status(500).json({ message: error.message || 'Lỗi server khi xoá sách' });
    }
};
exports.deleteBook = deleteBook;
