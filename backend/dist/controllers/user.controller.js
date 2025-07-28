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
exports.getOverview = exports.getUsersByRole = exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const UserService = __importStar(require("../services/user.service"));
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (typeof email !== 'string' || !email || typeof password !== 'string' || password.length < 6 ||
            (role && typeof role !== 'string')) {
            return res.status(400).json({ message: 'Dữ liệu đăng ký không hợp lệ.' });
        }
        await UserService.register(email, password, role);
        res.status(201).json({ message: 'Đăng ký thành công' });
    }
    catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        if (error.message === 'Email đã tồn tại') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Lỗi server khi đăng ký' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không được để trống.' });
        }
        const user = await UserService.login(email, password);
        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(401).json({ message: error.message || 'Sai email hoặc mật khẩu' });
    }
};
exports.login = login;
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Lỗi khi huỷ session:', err);
            return res.status(500).json({ message: 'Lỗi đăng xuất' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Đã đăng xuất' });
    });
};
exports.logout = logout;
const getProfile = (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    }
    else {
        res.status(401).json({ message: 'Chưa đăng nhập' });
    }
};
exports.getProfile = getProfile;
const getUsersByRole = async (req, res) => {
    const { role } = req.query;
    if (!role || typeof role !== 'string') {
        return res.status(400).json({ message: 'Tham số vai trò không hợp lệ.' });
    }
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Vai trò không tồn tại.' });
    }
    try {
        const users = await UserService.getUsersByRoleService(role);
        res.status(200).json(users);
    }
    catch (error) {
        console.error(`❌ Lỗi khi lấy danh sách người dùng theo role (${role}):`, error);
        res.status(500).json({ message: 'Lỗi server. Không thể lấy danh sách người dùng.' });
    }
};
exports.getUsersByRole = getUsersByRole;
const getOverview = async (req, res) => {
    try {
        const stats = await UserService.getOverviewStats();
        res.json(stats);
    }
    catch (err) {
        console.error('[OverviewController] Lỗi khi lấy thống kê:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy thống kê' });
    }
};
exports.getOverview = getOverview;
