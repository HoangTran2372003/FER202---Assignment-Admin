# eBay Clone - Admin Portal (Nhóm 3: Quản trị viên)

Dự án bài tập lớn môn **FER202 (Front-End Web Development with React)** - Đại học FPT.  
Dự án tập trung triển khai **toàn bộ 100% các yêu cầu tổng hợp của Nhóm 3: Quản trị viên (Admin)** trong hệ sinh thái sàn thương mại điện tử eBay Clone.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)
- **React.js 19** (Functional Components, Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`)
- **React-Bootstrap 2.10 & Bootstrap 5.3** (Container, Row, Col, Card, Table, Modal, Form, Button, Badge, Nav, Navbar, Alert, Toast, ProgressBar)
- **React-Bootstrap-Icons** (Bộ icon thương mại điện tử và bảo mật chuẩn Bootstrap)
- **Axios** (Thực hiện tất cả các request GET, POST, PATCH, DELETE lấy và đồng bộ dữ liệu)
- **`database.json`** (File cơ sở dữ liệu JSON mẫu toàn diện mô phỏng toàn bộ các bảng dữ liệu eBay Admin)

---

## 📋 Danh Sách Chức Năng Đạt Được (Nhóm 3: Quản Trị Viên)

### 1. 📊 Dashboard Tổng Quan (DashboardView)
- Bảng KPI thống kê: Tổng số User (Active, Pending, Locked), Sản phẩm niêm yết (Đang bán, Vi phạm, Đã ẩn), Đơn hàng toàn sàn, Tổng doanh thu sàn.
- Banner cảnh báo khẩn: Tự động phát hiện khi có tranh chấp chờ xử lý, tài khoản mới chờ duyệt, hoặc sản phẩm bị báo cáo vi phạm bản quyền nặng.
- Bảng duyệt nhanh tài khoản mới (Quick approval) và danh sách cảnh báo vi phạm.
- Widget giám sát sức khỏe hệ thống: Tỷ lệ giải quyết tranh chấp (85%), tiến độ xử lý đổi trả (<24h), tình trạng kết nối `database.json`.

### 2. 👥 Quản Lý Người Dùng (UsersManagement)
- Tìm kiếm theo Tên, Email, Tên gian hàng.
- Bộ lọc theo Vai trò (Người mua - Buyer, Người bán - Seller) và Trạng thái (Chờ duyệt, Hoạt động, Đã khóa).
- **Duyệt tài khoản mới**: Phê duyệt hồ sơ người bán / người mua mới đăng ký (trạng thái `pending_approval` -> `active`).
- **Khóa tài khoản vi phạm**: Hộp thoại (Modal) nhập lý do khóa bắt buộc, tăng số lần phạt (strikes) và lưu vào nhật ký an ninh.
- **Mở khóa tài khoản**: Cho phép mở lại tài khoản cho người dùng sau khi hoàn tất giải trình.
- **Xem chi tiết hồ sơ**: Xem giấy phép kinh doanh, điểm feedback uy tín, số đơn hàng đã mua/bán.

### 3. 📦 Quản Lý Sản Phẩm Toàn Sàn (ProductsManagement)
- Danh mục đa dạng phong cách eBay (Điện thoại, Đồng hồ cổ, Giày dép, Máy ảnh, Hàng sưu tầm).
- Phát hiện và gắn nhãn sản phẩm vi phạm (hàng nhái, vi phạm thương hiệu Nike, phần mềm lậu, hàng cấm y tế).
- **Ẩn / Bỏ ẩn sản phẩm**: Tạm ẩn các listing khả nghi khỏi giao diện người mua công khai.
- **Xóa sản phẩm vi phạm**: Modal xác nhận xóa vĩnh viễn sản phẩm vi phạm bản quyền và tự động ghi vào biên bản Audit Log.
- Xem chi tiết báo cáo vi phạm và số lượt report của cộng đồng.

### 4. 📑 Quản Lý Đơn Hàng Toàn Hệ Thống (OrdersManagement)
- Bảng theo dõi toàn bộ đơn hàng của sàn eBay Clone.
- Bộ lọc theo trạng thái: Processing, Shipped, Delivered, Disputed, Cancelled.
- Modal chi tiết đơn hàng:
  - Chi tiết từng món hàng, đơn giá, số lượng, phí ship, tổng tiền.
  - Thông tin người mua, địa chỉ nhận hàng, người bán.
  - Mã vận đơn bưu chính (Tracking Number).
  - Can thiệp điều chỉnh trạng thái đơn hàng (Admin Override).

### 5. 📈 Thống Kê Báo Cáo Hiệu Suất Hệ Thống (StatisticsAnalytics)
- Chuyển đổi linh hoạt giữa **Theo Ngày (Daily)**, **Theo Tháng (Monthly)**, **Theo Quý (Quarterly)**.
- Chỉ số tài chính: Doanh thu tổng kỳ, Số lượng đơn hàng, Người dùng mới đăng ký, Giá trị đơn trung bình (AOV).
- Biểu đồ trực quan (Visual Chart Columns & Tooltips) so sánh Doanh thu và Số lượng đơn hàng.
- Biểu đồ phân bổ tỷ trọng doanh thu theo ngành hàng (Category Breakdown: Đồ công nghệ 36%, Đồng hồ sưu tầm 28%, Thời trang 18%...).
- Chức năng xuất dữ liệu báo cáo (Export Report).

### 6. ⭐ Giám Sát Đánh Giá & Phản Hồi (ReviewsMonitoring)
- Hiển thị rating sao (1★ đến 5★) và bình luận từ người mua.
- Tự động phát hiện đánh giá độc hại, bôi nhọ, xúc phạm người bán.
- **Ẩn đánh giá độc hại (Toxic Review)**: Ngăn chặn hiển thị bình luận tiêu cực vi phạm nguyên tắc cộng đồng.
- **Khôi phục / Bỏ ẩn**: Đưa đánh giá về trạng thái hiển thị công khai.

### 7. ⚖️ Phân Xử Khiếu Nại Tranh Chấp (DisputesManagement)
- Mô phỏng chính sách bảo vệ khách hàng **eBay Money Back Guarantee**.
- Tiếp nhận các vụ tranh chấp: Hàng giả mạo, Giao thiếu phụ kiện, Bưu phẩm thất lạc.
- Modal Hội Đồng Trọng Tài Admin:
  - Xem song song luận điểm người mua (Buyer's Claim) và phản hồi của người bán (Seller's Response).
  - Admin đưa ra phán quyết:
    1. Hoàn tiền 100% cho Người Mua (Refunded to Buyer).
    2. Bác bỏ khiếu nại (Ủng hộ Người Bán - Dismissed).
    3. Yêu cầu hai bên bổ sung chứng cứ (Under Review).
  - Ghi biên bản phán quyết và cập nhật trạng thái đơn hàng.

### 8. 🔄 Xét Duyệt Đổi Trả / Hoàn Tiền (ReturnsApproval)
- Danh sách yêu cầu hoàn trả: Mã RET, Đơn hàng, Người mua, Sản phẩm, Bằng chứng lỗi, Giá trị tiền.
- Modal xét duyệt: Phê duyệt (Approved) cấp mã gửi trả hàng hoặc Từ chối (Rejected) kèm lý do giải thích.

### 9. 📢 Gửi Cảnh Báo Hệ Thống & Email Toàn Thể Người Dùng (BroadcastSystem)
- Form soạn thảo thông báo phát sóng diện rộng:
  - Chọn đối tượng nhận: Toàn bộ người dùng, Chỉ Người bán, Chỉ Người mua, Nhóm bị cảnh cáo.
  - Phân loại: Cảnh báo an ninh / Lừa đảo, Lịch bảo trì hệ thống, Quy định mới, Khuyến mại.
  - Tiêu đề & Nội dung chi tiết.
- Khung xem trước (Live Preview) mô phỏng chính xác Email thông báo từ eBay Official Notice.
- Bảng lịch sử các thông điệp đã phát hành.

### 10. 🔐 An Ninh, Xác Thực 2FA & Nhật Ký Mã Hóa SHA-256 (SecurityAuditLog)
- **Giới hạn IP nội bộ & Xác thực 2FA**:
  - Tích hợp công cụ mô phỏng chuyển đổi giữa IP Nội Bộ (`192.168.1.45`) và IP Mạng Ngoài (`203.113.15.8`).
  - Hộp thoại xác thực 2FA OTP qua Google Authenticator (Mã kiểm thử: `123456`).
- **Phân quyền vai trò quản trị viên (RBAC - Role-Based Access Control)**:
  - `Super Admin`: Toàn quyền quản trị hệ thống.
  - `Support Admin`: Quản lý Đơn hàng, Tranh chấp, Đổi trả, Đánh giá.
  - `Monitor Admin`: Kiểm duyệt Sản phẩm (ẩn/xóa vi phạm), Đánh giá độc hại, Khóa User.
  - Menu chuyển đổi vai trò Admin trực tiếp trên thanh điều hướng để kiểm thử phân quyền ngay lập tức.
- **Nhật ký an ninh (Audit Log) & Mã hóa**:
  - Ghi lại tự động mọi hành vi nhạy cảm (Khóa user, Xóa sản phẩm vi phạm, Phân xử tranh chấp, Gửi broadcast).
  - Tự động sinh chuỗi băm mã hóa SHA-256 (`enc_sha256_...`) cho từng biên bản để đảm bảo dữ liệu không bị sửa đổi.
  - Hộp thoại xem chi tiết biên bản giải mã an ninh.
- Nút **"Khôi phục dữ liệu gốc database.json"** giúp đặt lại dữ liệu mẫu bất kỳ lúc nào.

---

## 🚀 Cách Cài Đặt & Chạy Ứng Dụng (Run the Project)

```bash
# 1. Cài đặt các gói phụ thuộc (nếu chưa có)
npm install

# 2. Khởi chạy ứng dụng React
npm start
```

Ứng dụng sẽ tự động mở tại `http://localhost:3000`.
Toàn bộ dữ liệu được nạp ban đầu từ `database.json` qua Axios và tự động đồng bộ hóa với LocalStorage để thao tác chỉnh sửa, thêm, xóa được lưu giữ xuyên suốt các lần reload trang.
