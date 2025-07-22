import app from './app'; 
import mongoose from 'mongoose'; 
import dotenv from 'dotenv'; 
import { initializeAdmin } from './utils/admin.initializer';

dotenv.config(); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error('Biến môi trường MONGO_URI không được định nghĩa.');
  process.exit(1); 
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB đã kết nối thành công!');
    return initializeAdmin(); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(' Lỗi kết nối MongoDB:', err);
    process.exit(1); 
  });