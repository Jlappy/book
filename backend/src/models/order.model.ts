// src/models/order.model.ts

import { Schema, model, Types, Document } from 'mongoose';
import { IBook } from './book.model'; // Import IBook

// Interface cho một item trong đơn hàng (trước khi populate)
export interface IOrderItem {
  book: Types.ObjectId; // Khi lưu trong DB, nó là ObjectId
  quantity: number;
  price: number; // Giá tại thời điểm đặt hàng
}

// Interface cho đơn hàng (trước khi populate)
export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  createdAt: Date;
  status: 'pending' | 'completed';
}

export interface IOrderPopulated extends Document {
  user: Types.ObjectId;
  items: {
    book: IBook; 
    quantity: number;
    price: number;
  }[];
  total: number;
  createdAt: Date;
  status: 'pending' | 'completed';
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default model<IOrder>('Order', orderSchema);