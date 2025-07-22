"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = initializeAdmin;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
async function initializeAdmin() {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            console.warn('MongoDB chưa được kết nối khi cố gắng khởi tạo admin.');
            return;
        }
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';
        const exists = await user_model_1.default.findOne({ email: adminEmail });
        if (!exists) {
            await user_model_1.default.create({
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Tài khoản Admin mặc định đã được tạo');
        }
        else {
            console.log('Tài khoản Admin mặc định đã tồn tại');
        }
    }
    catch (error) {
        console.error('Lỗi khi khởi tạo tài khoản Admin:', error);
    }
}
