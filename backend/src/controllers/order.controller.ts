import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const orders = await orderService.getOrders(userId);
    res.json(orders);
  } catch (error: any) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy đơn hàng' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const order = await orderService.createOrder(userId);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    if (error.message.includes('Giỏ hàng trống')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Lỗi server khi tạo đơn hàng' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.id;
    const { orderId } = req.params;
    if (typeof orderId !== 'string' || !orderId) {
      return res.status(400).json({ message: 'ID đơn hàng không hợp lệ.' });
    }
    const order = await orderService.getOrderById(userId, orderId);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json(order);
  } catch (error: any) {
    console.error(`Lỗi khi lấy đơn hàng ID ${req.params.orderId}:`, error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy đơn hàng' });
  }

};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await orderService.getOrdersByUserIdService(userId);
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng theo user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};
