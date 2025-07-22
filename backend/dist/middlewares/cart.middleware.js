"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyUser = void 0;
const onlyUser = (req, res, next) => {
    const role = req.session.user?.role;
    if (role !== 'user') {
        return res.status(403).json({ message: 'Chỉ người dùng được thực hiện chức năng này' });
    }
    next();
};
exports.onlyUser = onlyUser;
