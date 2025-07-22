"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin_initializer_1 = require("./utils/admin.initializer");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('Biến môi trường MONGO_URI không được định nghĩa.');
    process.exit(1);
}
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('✅ MongoDB đã kết nối thành công!');
    return (0, admin_initializer_1.initializeAdmin)();
})
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server đang chạy trên http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error(' Lỗi kết nối MongoDB:', err);
    process.exit(1);
});
