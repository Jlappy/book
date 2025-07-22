1. User Authentication & Profile
Các endpoint liên quan đến việc đăng ký, đăng nhập, đăng xuất và quản lý thông tin người dùng.

Phương thức	URL Endpoint	Mô tả	Yêu cầu xác thực	Vai trò yêu cầu
POST	/api/users/register	Đăng ký tài khoản người dùng mới.	Không	Bất kỳ
POST	/api/users/login	Đăng nhập và tạo phiên làm việc (session).	Không	Bất kỳ
POST	/api/users/logout	Đăng xuất và hủy phiên làm việc.	Có	Bất kỳ
GET	    /api/users/me	    Lấy thông tin hồ sơ của người dùng hiện tại.	Có	Bất kỳ

2. Book Management
Các endpoint để quản lý thông tin về sách.

Phương thức	URL Endpoint	Mô tả	Yêu cầu xác thực	Vai trò yêu cầu
GET	    /api/books	        Lấy danh sách tất cả sách.	Không	Bất kỳ
GET	    /api/books/:bookId	Lấy thông tin chi tiết của một cuốn sách theo ID.	Không	Bất kỳ
POST	/api/books	        Tạo một cuốn sách mới.	Có	admin
PUT	    /api/books/:bookId	Cập nhật thông tin của một cuốn sách.	Có	admin
DELETE	/api/books/:bookId	Xóa một cuốn sách.	Có	admin

3. Shopping Cart Management
Các endpoint để quản lý giỏ hàng của người dùng đã đăng nhập.

Phương thức	URL Endpoint	Mô tả	Yêu cầu xác thực	Vai trò yêu cầu
GET	    /api/cart	        Lấy thông tin giỏ hàng của người dùng hiện tại.	Có	user
POST	/api/cart	        Thêm một cuốn sách vào giỏ hàng hoặc 
                            cập nhật số lượng nếu sách đã có.               Có	user
PUT	    /api/cart	        Cập nhật số lượng của một cuốn sách cụ thể trong giỏ hàng.	Có	user
DELETE	/api/cart/:bookId	Xóa một cuốn sách khỏi giỏ hàng.	Có	user
DELETE	/api/cart	        Xóa tất cả các cuốn sách khỏi giỏ hàng.	Có	user

4. Favorite Books Management
Các endpoint để quản lý danh sách sách yêu thích của người dùng.

Phương thức	URL Endpoint	Mô tả	Yêu cầu xác thực	Vai trò yêu cầu
GET	    /api/favorites	        Lấy danh sách sách yêu thích của người dùng hiện tại.	Có	user
POST	/api/favorites	        Thêm một cuốn sách vào danh sách yêu thích.	Có	user
DELETE	/api/favorites/:bookId	Xóa một cuốn sách khỏi danh sách yêu thích.	Có	user

5. Order Management
Các endpoint để quản lý đơn hàng của người dùng.

Phương thức	URL Endpoint	Mô tả	Yêu cầu xác thực	Vai trò yêu cầu
GET	    /api/orders	            Lấy danh sách tất cả đơn hàng của người dùng hiện tại.	Có	user
POST	/api/orders	            Tạo một đơn hàng mới từ giỏ hàng.	Có	user
GET 	/api/orders/:orderId	Lấy thông tin chi tiết của một đơn hàng cụ thể.	Có	user