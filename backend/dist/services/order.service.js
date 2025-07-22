"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.createOrder = exports.getOrders = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const getOrders = async (userId) => {
    return (await order_model_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('items.book'));
};
exports.getOrders = getOrders;
const createOrder = async (userId) => {
    const cart = await cart_model_1.default.findOne({ user: userId }).populate('items.book');
    if (!cart || cart.items.length === 0)
        throw new Error('Giỏ hàng trống');
    const items = cart.items.map(i => {
        if (!i.book || !i.book.price) {
            throw new Error(`Sách với ID ${i.book?._id || 'không xác định'} không có giá hoặc không tồn tại.`);
        }
        return {
            book: i.book._id,
            quantity: i.quantity,
            price: i.book.price
        };
    });
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const order = new order_model_1.default({ user: userId, items, total });
    await order.save();
    cart.items = [];
    await cart.save();
    return (await order.populate('items.book'));
};
exports.createOrder = createOrder;
const getOrderById = async (userId, orderId) => {
    const order = await order_model_1.default.findOne({ _id: orderId, user: userId })
        .populate('items.book');
    return order;
};
exports.getOrderById = getOrderById;
