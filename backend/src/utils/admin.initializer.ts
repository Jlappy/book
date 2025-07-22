import mongoose from 'mongoose';
import User from '../models/user.model';

export async function initializeAdmin() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB chưa được kết nối khi cố gắng khởi tạo admin.');
      return; 
    }

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    const exists = await User.findOne({ email: adminEmail });

    if (!exists) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Tài khoản Admin mặc định đã được tạo');
    } else {
      console.log('Tài khoản Admin mặc định đã tồn tại');
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo tài khoản Admin:', error);
  }
}
