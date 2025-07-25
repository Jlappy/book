"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByRoleService = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const register = async (email, password, role = 'user') => {
    const existing = await user_model_1.default.findOne({ email });
    if (existing) {
        throw new Error('Email đã tồn tại');
    }
    const user = new user_model_1.default({
        email,
        password: password,
        role: role
    });
    await user.save();
    return user;
};
exports.register = register;
const login = async (email, password) => {
    console.log(`[LOGIN_DEBUG] Bắt đầu đăng nhập cho email: ${email}`);
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        console.log(`[LOGIN_DEBUG] Không tìm thấy người dùng: ${email}`);
        throw new Error('Sai email hoặc mật khẩu');
    }
    console.log(`[LOGIN_DEBUG] Đã tìm thấy người dùng: ${user.email}, Role: ${user.role}`);
    console.log(`[LOGIN_DEBUG] Mật khẩu người dùng nhập vào (thô): ${password}`);
    console.log(`[LOGIN_DEBUG] Mật khẩu đã hash trong DB: ${user.password}`);
    const isPasswordValid = await user.comparePassword(password);
    console.log(`[LOGIN_DEBUG] Kết quả so sánh mật khẩu (bcrypt.compare): ${isPasswordValid}`);
    if (!isPasswordValid) {
        console.log(`[LOGIN_DEBUG] Mật khẩu không khớp cho ${email}`);
        throw new Error('Sai email hoặc mật khẩu');
    }
    console.log(`[LOGIN_DEBUG] Đăng nhập thành công cho ${email}`);
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
exports.login = login;
const getUsersByRoleService = async (role) => {
    return await user_model_1.default.find({ role }).select('-password');
};
exports.getUsersByRoleService = getUsersByRoleService;
