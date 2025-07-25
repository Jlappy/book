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
exports.getCartByUserId = exports.clearCart = exports.removeFromCart = exports.updateQuantity = exports.addToCart = exports.getCart = void 0;
const cartService = __importStar(require("../services/cart.service"));
const getCart = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await cartService.getCart(userId);
        res.json(cart);
    }
    catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy giỏ hàng' });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookId, quantity } = req.body;
        if (typeof bookId !== 'string' || !bookId || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Dữ liệu thêm vào giỏ hàng không hợp lệ.' });
        }
        const cart = await cartService.addToCart(userId, bookId, quantity);
        res.status(200).json(cart);
    }
    catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi thêm vào giỏ hàng' });
    }
};
exports.addToCart = addToCart;
const updateQuantity = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookId, quantity } = req.body;
        if (typeof bookId !== 'string' || !bookId || typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Dữ liệu cập nhật số lượng không hợp lệ.' });
        }
        const cart = await cartService.updateQuantity(userId, bookId, quantity);
        res.json(cart);
    }
    catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật số lượng' });
    }
};
exports.updateQuantity = updateQuantity;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookId } = req.params;
        if (typeof bookId !== 'string' || !bookId) {
            return res.status(400).json({ message: 'ID sách không hợp lệ.' });
        }
        const cart = await cartService.removeFromCart(userId, bookId);
        res.json(cart);
    }
    catch (error) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi xóa khỏi giỏ hàng' });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const cart = await cartService.clearCart(userId);
        res.json(cart);
    }
    catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi xóa giỏ hàng' });
    }
};
exports.clearCart = clearCart;
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await cartService.getCartByUserId(userId);
        if (!cart)
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        res.json(cart);
    }
    catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.getCartByUserId = getCartByUserId;
