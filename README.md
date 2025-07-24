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

## 🔌 Danh sách API Backend

Các endpoint chính của backend:

### Người dùng (`/api/users`)
- `POST /register` — Đăng ký tài khoản mới
- `POST /login` — Đăng nhập
- `POST /logout` — Đăng xuất
- `GET /me` (yêu cầu đăng nhập) — Lấy thông tin người dùng hiện tại

### Sách (`/api/books`)
- `GET /` — Lấy danh sách sách
- `GET /:bookId` — Lấy chi tiết sách theo ID
- `POST /` (admin) — Thêm sách mới
- `PUT /:bookId` (admin) — Sửa thông tin sách
- `DELETE /:bookId` (admin) — Xóa sách

### Yêu thích (`/api/favorites`)
- `GET /` — Lấy danh sách sách yêu thích của user
- `POST /` — Thêm sách vào yêu thích
- `DELETE /:bookId` — Xóa sách khỏi yêu thích

### Giỏ hàng (`/api/cart`)
- `GET /` — Lấy giỏ hàng hiện tại
- `POST /` — Thêm sách vào giỏ hàng
- `PUT /` — Cập nhật số lượng sách trong giỏ
- `DELETE /:bookId` — Xóa sách khỏi giỏ hàng
- `DELETE /` — Xóa toàn bộ giỏ hàng

### Đơn hàng (`/api/orders`)
- `GET /` — Lấy danh sách đơn hàng
- `POST /` — Tạo đơn hàng mới
- `GET /:orderId` — Xem chi tiết đơn hàng

### Tìm kiếm sách ngoài (Open Library) (`/api/openlibrary`)
- `GET /search` — Tìm kiếm sách qua Open Library

> **Lưu ý:** Một số endpoint yêu cầu xác thực và phân quyền (admin/user).
