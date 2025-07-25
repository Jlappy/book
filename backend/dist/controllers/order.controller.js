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
exports.getOrdersByUserId = exports.getOrderById = exports.createOrder = exports.getOrders = void 0;
const orderService = __importStar(require("../services/order.service"));
const getOrders = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const orders = await orderService.getOrders(userId);
        res.json(orders);
    }
    catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy đơn hàng' });
    }
};
exports.getOrders = getOrders;
const createOrder = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const order = await orderService.createOrder(userId);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        if (error.message.includes('Giỏ hàng trống')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Lỗi server khi tạo đơn hàng' });
    }
};
exports.createOrder = createOrder;
const getOrderById = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { orderId } = req.params;
        if (typeof orderId !== 'string' || !orderId) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
        }
        const order = await orderService.getOrderById(userId, orderId);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    }
    catch (error) {
        console.error(`Lỗi khi lấy đơn hàng ID ${req.params.orderId}:`, error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy đơn hàng' });
    }
};
exports.getOrderById = getOrderById;
const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await orderService.getOrdersByUserIdService(userId);
        res.json(orders);
    }
    catch (error) {
        console.error('Lỗi khi lấy đơn hàng theo user:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.getOrdersByUserId = getOrdersByUserId;
