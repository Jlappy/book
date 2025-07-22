"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const getAllBooks = async () => {
    const books = await book_model_1.default.find();
    return books;
};
exports.getAllBooks = getAllBooks;
const getBookById = async (bookId) => {
    const book = await book_model_1.default.findById(bookId);
    return book;
};
exports.getBookById = getBookById;
const createBook = async (bookData) => {
    const { title, author, openLibraryId } = bookData;
    if (openLibraryId) {
        const exists = await book_model_1.default.findOne({ openLibraryId });
        if (exists)
            throw new Error('Sách đã tồn tại (OpenLibrary ID)');
    }
    else {
        const exists = await book_model_1.default.findOne({ title, author, source: 'manual' });
        if (exists)
            throw new Error('Sách trùng tên và tác giả');
    }
    const book = new book_model_1.default({
        ...bookData,
        source: openLibraryId ? 'openlibrary' : 'manual'
    });
    await book.save();
    return book;
};
exports.createBook = createBook;
const updateBook = async (bookId, updateData) => {
    const updated = await book_model_1.default.findByIdAndUpdate(bookId, updateData, { new: true });
    return updated;
};
exports.updateBook = updateBook;
const deleteBook = async (bookId) => {
    const deleted = await book_model_1.default.findByIdAndDelete(bookId);
    return deleted;
};
exports.deleteBook = deleteBook;
