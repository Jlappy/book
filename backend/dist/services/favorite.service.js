"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getFavorites = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error('Người dùng không tìm thấy');
    return user.favorites;
};
exports.getFavorites = getFavorites;
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
