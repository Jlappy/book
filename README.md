### 1. Backend

```bash
cd backend
npm install

# Cấu hình biến môi trường (ví dụ .env)
.env
PORT=5000
MONGO_URI=mongodb+srv://hoangkm:hoangkm@cluster0.zyqitsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=your_strong_session_secret_here_replace_me

npm run start

### 2. Frontend

```bash
cd frontend
npm install

# Chạy ứng dụng Angular
npm run start
# hoặc
ng serve

# Truy cập trên trình duyệt
http://localhost:4200
```
### 3. Kết nối frontend với backend

- Cấu hình API endpoint trong file environment của Angular (`frontend/src/environments/environment.ts`) để trỏ về địa chỉ backend.
- Đảm bảo backend chạy trước khi dùng các tính năng cần xác thực hoặc truy xuất dữ liệu.

## 🧪 Kiểm thử

**Frontend:**
ng test
