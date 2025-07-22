"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    if (!req.session.user?.id) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    next();
};
exports.authMiddleware = authMiddleware;
