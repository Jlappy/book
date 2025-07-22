// src/models/cart.model.ts

import { Schema, model, Types, Document } from 'mongoose';
import { IBook } from './book.model';

export interface ICartItem {
  book: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
}

export interface ICartPopulated extends Document {
  user: Types.ObjectId;
  items: {
    book: IBook;
    quantity: number;
  }[];
}

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
});

export default model<ICart>('Cart', cartSchema);