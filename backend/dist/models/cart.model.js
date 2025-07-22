"use strict";
// src/models/cart.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
});
exports.default = (0, mongoose_1.model)('Cart', cartSchema);
