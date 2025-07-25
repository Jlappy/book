"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavoriteBooks = exports.getFavorites = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const getFavorites = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error('Người dùng không tìm thấy');
    return user.favorites;
};
exports.getFavorites = getFavorites;
const getFavoriteBooks = async (userId) => {
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user)
            throw new Error('Người dùng không tìm thấy');
        // Convert string IDs to ObjectId
        const bookObjectIds = user.favorites.map(id => new mongoose_1.default.Types.ObjectId(id));
        const favoriteBooks = await book_model_1.default.find({
            _id: { $in: bookObjectIds },
        });
        return favoriteBooks;
    }
    catch (err) {
        console.error(err);
        throw new Error('Internal server error');
    }
};
exports.getFavoriteBooks = getFavoriteBooks;
const addFavorite = async (userId, bookId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error('Người dùng không tìm thấy');
    if (!user.favorites.includes(bookId)) {
        user.favorites.push(bookId);
        await user.save();
    }
    return user.favorites;
};
exports.addFavorite = addFavorite;
const removeFavorite = async (userId, bookId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error('Người dùng không tìm thấy');
    user.favorites = user.favorites.filter(id => id !== bookId);
    await user.save();
    return user.favorites;
};
exports.removeFavorite = removeFavorite;
