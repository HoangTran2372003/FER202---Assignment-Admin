# eBay Clone - Admin Portal

Dự án bài tập lớn môn **FER202 (Front-End Web Development with React)** - 
Dự án tập trung triển khai **toàn bộ 100% các yêu cầu tổng hợp của Nhóm 3: Quản trị viên (Admin)** trong hệ sinh thái sàn thương mại điện tử eBay Clone.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)
- **React.js 19** (Functional Components, Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`)
- **React-Bootstrap 2.10 & Bootstrap 5.3** (Container, Row, Col, Card, Table, Modal, Form, Button, Badge, Nav, Navbar, Alert, Toast, ProgressBar)
- **React-Bootstrap-Icons** (Bộ icon thương mại điện tử và bảo mật chuẩn Bootstrap)
- **Axios** (Thực hiện tất cả các request GET, POST, PATCH, DELETE lấy và đồng bộ dữ liệu)
- **`database.json`** (File cơ sở dữ liệu JSON mẫu toàn diện mô phỏng toàn bộ các bảng dữ liệu eBay Admin)

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
