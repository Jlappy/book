import Order, { IOrderPopulated } from '../models/order.model';
import Cart, { ICart, ICartPopulated } from '../models/cart.model';
import { IBook } from '../models/book.model';

export const getOrders = async (userId: string): Promise<IOrderPopulated[]> => {
  return (await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate<{ items: { book: IBook, quantity: number, price: number }[] }>('items.book')) as unknown as IOrderPopulated[];
};

export const createOrder = async (userId: string): Promise<IOrderPopulated> => {
  const cart = await Cart.findOne({ user: userId }).populate<{ items: { book: IBook, quantity: number }[] }>('items.book') as unknown as ICartPopulated;

  if (!cart || cart.items.length === 0) throw new Error('Giỏ hàng trống');

  const items = cart.items.map(i => {
    if (!i.book || !i.book.price) {
      throw new Error(`Sách với ID ${i.book?._id || 'không xác định'} không có giá hoặc không tồn tại.`);
    }
    return {
      book: i.book._id,
      quantity: i.quantity,
      price: i.book.price
    };
  });

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const order = new Order({ user: userId, items, total });
  await order.save();

  cart.items = [];
  await (cart as unknown as ICart).save();

  return (await order.populate<{ items: { book: IBook, quantity: number, price: number }[] }>('items.book')) as unknown as IOrderPopulated;
};

export const getOrderById = async (userId: string, orderId: string): Promise<IOrderPopulated | null> => {
  const order = await Order.findOne({ _id: orderId, user: userId })
    .populate<{ items: { book: IBook, quantity: number, price: number }[] }>('items.book') as unknown as IOrderPopulated | null;
  return order;
};

export const getOrdersByUserIdService = async (userId: string) => {
  return await Order.find({ user: userId }).populate('items.book');
};

export const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed'): Promise<IOrderPopulated | null> => {
  const updated = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate('items.book');

  return updated as unknown as IOrderPopulated | null;
};
