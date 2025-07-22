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
exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const favoriteService = __importStar(require("../services/favorite.service"));
const getFavorites = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const result = await favoriteService.getFavorites(userId);
        res.json(result);
    }
    catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách yêu thích' });
    }
};
exports.getFavorites = getFavorites;
const addFavorite = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookId } = req.body;
        if (typeof bookId !== 'string' || !bookId) {
            return res.status(400).json({ message: 'ID sách không hợp lệ.' });
        }
        const result = await favoriteService.addFavorite(userId, bookId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi thêm vào danh sách yêu thích' });
    }
};
exports.addFavorite = addFavorite;
const removeFavorite = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { bookId } = req.params;
        if (typeof bookId !== 'string' || !bookId) {
            return res.status(400).json({ message: 'ID sách không hợp lệ.' });
        }
        const result = await favoriteService.removeFavorite(userId, bookId);
        res.json(result);
    }
    catch (error) {
        console.error('Lỗi khi xóa khỏi danh sách yêu thích:', error);
        res.status(500).json({ message: error.message || 'Lỗi server khi xóa khỏi danh sách yêu thích' });
    }
};
exports.removeFavorite = removeFavorite;
