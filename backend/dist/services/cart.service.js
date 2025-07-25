"use strict";
// src/services/cart.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartByUserId = exports.clearCart = exports.removeFromCart = exports.updateQuantity = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = require("mongoose");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const getCart = async (userId) => {
    const cart = await cart_model_1.default.findOne({ user: userId })
        .populate('items.book');
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return cart;
};
exports.getCart = getCart;
const addToCart = async (userId, bookId, quantity) => {
    const bookObjectId = new mongoose_1.Types.ObjectId(bookId);
    const bookExists = await book_model_1.default.findById(bookObjectId);
    if (!bookExists) {
        throw new Error('Sách không tồn tại');
    }
    let cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        cart = new cart_model_1.default({ user: userId, items: [] });
    }
    const index = cart.items.findIndex(item => item.book.equals(bookObjectId));
    if (index >= 0) {
        cart.items[index].quantity += quantity;
    }
    else {
        cart.items.push({ book: bookObjectId, quantity });
    }
    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate('items.book'));
};
exports.addToCart = addToCart;
const updateQuantity = async (userId, bookId, quantity) => {
    if (quantity <= 0) {
        return (0, exports.removeFromCart)(userId, bookId);
    }
    const bookObjectId = new mongoose_1.Types.ObjectId(bookId);
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart)
        throw new Error('Giỏ hàng không tìm thấy');
    const item = cart.items.find(i => i.book.equals(bookObjectId));
    if (item) {
        item.quantity = quantity;
        await cart.save();
    }
    else {
        throw new Error('Sách không có trong giỏ hàng');
    }
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate('items.book'));
};
exports.updateQuantity = updateQuantity;
const removeFromCart = async (userId, bookId) => {
    const bookObjectId = new mongoose_1.Types.ObjectId(bookId);
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart)
        throw new Error('Giỏ hàng không tìm thấy');
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(i => !i.book.equals(bookObjectId));
    if (cart.items.length === initialLength) {
        throw new Error('Sách không có trong giỏ hàng để xóa');
    }
    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate('items.book'));
};
exports.removeFromCart = removeFromCart;
const clearCart = async (userId) => {
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart)
        throw new Error('Giỏ hàng không tìm thấy');
    if (cart.items.length === 0) {
        // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
        return (await cart.populate('items.book'));
    }
    cart.items = [];
    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate('items.book'));
};
exports.clearCart = clearCart;
const getCartByUserId = async (userId) => {
    return cart_model_1.default.findOne({ user: userId }).populate('items.book');
};
exports.getCartByUserId = getCartByUserId;
