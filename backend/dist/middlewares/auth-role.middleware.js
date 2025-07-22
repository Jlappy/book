"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyUser = exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập (yêu cầu Admin)' });
    }
    next();
};
exports.isAdmin = isAdmin;
const onlyUser = (req, res, next) => {
    const role = req.session.user?.role;
    if (role !== 'user') {
        return res.status(403).json({ message: 'Chỉ người dùng được thực hiện chức năng này' });
    }
    next();
};
exports.onlyUser = onlyUser;
