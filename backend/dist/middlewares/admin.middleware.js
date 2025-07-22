"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Chỉ admin được phép thực hiện hành động này' });
    }
    next();
};
exports.isAdmin = isAdmin;
