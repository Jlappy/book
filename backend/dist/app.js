"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const book_route_1 = __importDefault(require("./routes/book.route"));
const favorite_route_1 = __importDefault(require("./routes/favorite.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const openlibrary_route_1 = __importDefault(require("./routes/openlibrary.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // BẮT BUỘC LÀ TRUE TRONG PRODUCTION VỚI HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));
// Định nghĩa các route
app.use('/api/users', user_route_1.default);
app.use('/api/books', book_route_1.default);
app.use('/api/favorites', favorite_route_1.default);
app.use('/api/cart', cart_route_1.default);
app.use('/api/orders', order_route_1.default);
app.use('/api/openlibrary', openlibrary_route_1.default);
app.use((_req, res) => {
    res.status(404).json({ message: 'Route không tìm thấy' });
});
exports.default = app;
