"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(async () => {
    await mongoose_1.default.connect(process.env.MONGO_URI);
    const exists = await user_model_1.default.findOne({ email: 'admin@example.com' });
    if (!exists) {
        await user_model_1.default.create({
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('✅ Admin đã được tạo');
    }
    else {
        console.log('🟡 Admin đã tồn tại');
    }
    process.exit();
})();
