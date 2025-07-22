// src/services/cart.service.ts

import { Types } from 'mongoose';
import Cart, { ICart, ICartItem, ICartPopulated } from '../models/cart.model';
import Book, { IBook } from '../models/book.model';

export const getCart = async (userId: string): Promise<ICartPopulated | null> => {
    const cart = await Cart.findOne({ user: userId })
                           .populate<{ items: { book: IBook, quantity: number }[] }>('items.book');
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return cart as unknown as ICartPopulated | null;
};

export const addToCart = async (userId: string, bookId: string, quantity: number): Promise<ICartPopulated> => {
    const bookObjectId = new Types.ObjectId(bookId);

    const bookExists = await Book.findById(bookObjectId);
    if (!bookExists) {
        throw new Error('Sách không tồn tại');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(item => (item.book as Types.ObjectId).equals(bookObjectId));


    if (index >= 0) {
        cart.items[index].quantity += quantity;
    } else {
        cart.items.push({ book: bookObjectId, quantity });
    }

    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate<{ items: { book: IBook, quantity: number }[] }>('items.book')) as unknown as ICartPopulated;
};

export const updateQuantity = async (userId: string, bookId: string, quantity: number): Promise<ICartPopulated> => {
    if (quantity <= 0) {
        return removeFromCart(userId, bookId);
    }

    const bookObjectId = new Types.ObjectId(bookId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Giỏ hàng không tìm thấy');

    const item = cart.items.find(i => (i.book as Types.ObjectId).equals(bookObjectId));

    if (item) {
        item.quantity = quantity;
        await cart.save();
    } else {
        throw new Error('Sách không có trong giỏ hàng');
    }

    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate<{ items: { book: IBook, quantity: number }[] }>('items.book')) as unknown as ICartPopulated;
};

export const removeFromCart = async (userId: string, bookId: string): Promise<ICartPopulated> => {
    const bookObjectId = new Types.ObjectId(bookId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Giỏ hàng không tìm thấy');

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(i => !(i.book as Types.ObjectId).equals(bookObjectId));

    if (cart.items.length === initialLength) {
        throw new Error('Sách không có trong giỏ hàng để xóa');
    }

    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate<{ items: { book: IBook, quantity: number }[] }>('items.book')) as unknown as ICartPopulated;
};

export const clearCart = async (userId: string): Promise<ICartPopulated> => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Giỏ hàng không tìm thấy');

    if (cart.items.length === 0) {
        // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
        return (await cart.populate<{ items: { book: IBook, quantity: number }[] }>('items.book')) as unknown as ICartPopulated;
    }

    cart.items = [];
    await cart.save();
    // THAY ĐỔI Ở ĐÂY: Ép kiểu qua unknown trước
    return (await cart.populate<{ items: { book: IBook, quantity: number }[] }>('items.book')) as unknown as ICartPopulated;
};