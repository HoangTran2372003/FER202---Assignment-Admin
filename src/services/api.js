import axios from 'axios';
import initialDatabase from '../../database.json';

const STORAGE_KEY = 'ebay_admin_db_v1';

// Khởi tạo dữ liệu từ database.json vào LocalStorage để đảm bảo tính phản hồi & lưu trữ
const getLocalData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase));
    return JSON.parse(JSON.stringify(initialDatabase));
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase));
    return JSON.parse(JSON.stringify(initialDatabase));
  }
};

const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Hàm tạo mã băm mô phỏng SHA-256 mã hóa nhật ký nhạy cảm
const generateEncryptedHash = (content) => {
  let hash = 0;
  const str = JSON.stringify(content) + Date.now();
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `enc_sha256_${hex}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
};

// Tự động ghi lại Nhật ký an ninh (Audit Log) cho các hành vi nhạy cảm của Admin
const recordAuditLog = (db, { adminEmail, adminRole, actionType, targetId, details, ipAddress }) => {
  const newLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
    adminEmail: adminEmail || 'admin@ebay-clone.internal',
    adminRole: adminRole || 'Super Admin',
    actionType,
    targetId: targetId || 'N/A',
    details,
    ipAddress: ipAddress || '192.168.1.45 (Nội bộ)',
    encryptedHash: generateEncryptedHash({ actionType, targetId, details })
  };
  db.auditLogs.unshift(newLog);
  return newLog;
};

// Tạo Axios instance với Custom Adapter xử lý dữ liệu từ database.json
const api = axios.create({
  baseURL: 'https://api.ebay-clone.internal/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-System-Origin': 'eBay-Admin-Portal'
  },
  adapter: async (config) => {
    // Giả lập độ trễ mạng nhẹ (120ms) để giống hệt ứng dụng thực tế
    await new Promise((resolve) => setTimeout(resolve, 120));

    const db = getLocalData();
    const { url = '', method = 'get', data } = config;
    const cleanUrl = url.split('?')[0];
    const parsedData = data ? (typeof data === 'string' ? JSON.parse(data) : data) : {};

    // 1. Quản lý Người dùng (Users)
    if (cleanUrl === '/users') {
      if (method.toLowerCase() === 'get') {
        return { data: db.users, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/users/')) {
      const userId = cleanUrl.replace('/users/', '');
      const userIndex = db.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return { data: { message: 'User not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }

      if (method.toLowerCase() === 'patch') {
        db.users[userIndex] = { ...db.users[userIndex], ...parsedData };
        // Ghi audit log nếu khóa hoặc mở khóa hoặc duyệt
        if (parsedData.status === 'locked') {
          recordAuditLog(db, {
            actionType: 'USER_LOCKED',
            targetId: userId,
            details: `Khóa tài khoản ${db.users[userIndex].name} (${db.users[userIndex].email}). Lý do: ${parsedData.lockReason || 'Vi phạm điều khoản'}`
          });
        } else if (parsedData.status === 'active' && parsedData.wasPending) {
          recordAuditLog(db, {
            actionType: 'USER_APPROVED',
            targetId: userId,
            details: `Phê duyệt tài khoản mới: ${db.users[userIndex].name} (${db.users[userIndex].role})`
          });
        } else if (parsedData.status === 'active') {
          recordAuditLog(db, {
            actionType: 'USER_UNLOCKED',
            targetId: userId,
            details: `Mở khóa tài khoản cho ${db.users[userIndex].name}`
          });
        }
        saveLocalData(db);
        return { data: db.users[userIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 2. Quản lý Sản phẩm (Products)
    if (cleanUrl === '/products') {
      if (method.toLowerCase() === 'get') {
        return { data: db.products, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/products/')) {
      const prodId = cleanUrl.replace('/products/', '');
      const prodIndex = db.products.findIndex((p) => p.id === prodId);

      if (prodIndex === -1) {
        return { data: { message: 'Product not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }

      if (method.toLowerCase() === 'patch') {
        const previousStatus = db.products[prodIndex].status;
        db.products[prodIndex] = { ...db.products[prodIndex], ...parsedData };
        recordAuditLog(db, {
          actionType: parsedData.status === 'hidden' ? 'PRODUCT_HIDDEN' : 'PRODUCT_UPDATED',
          targetId: prodId,
          details: `Cập nhật trạng thái sản phẩm [${db.products[prodIndex].title.substring(0, 35)}...] từ ${previousStatus} sang ${parsedData.status}`
        });
        saveLocalData(db);
        return { data: db.products[prodIndex], status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method.toLowerCase() === 'delete') {
        const removed = db.products.splice(prodIndex, 1)[0];
        recordAuditLog(db, {
          actionType: 'PRODUCT_DELETED_VIOLATION',
          targetId: prodId,
          details: `XÓA VĨNH VIỄN sản phẩm vi phạm: [${removed.title}] của người bán ${removed.sellerName}. Lý do: ${parsedData.reason || 'Vi phạm chính sách'}`
        });
        saveLocalData(db);
        return { data: { success: true, removed }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 3. Quản lý Đơn hàng (Orders)
    if (cleanUrl === '/orders') {
      if (method.toLowerCase() === 'get') {
        return { data: db.orders, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/orders/')) {
      const orderId = cleanUrl.replace('/orders/', '');
      const orderIndex = db.orders.findIndex((o) => o.id === orderId);

      if (orderIndex === -1) {
        return { data: { message: 'Order not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }

      if (method.toLowerCase() === 'patch') {
        db.orders[orderIndex] = { ...db.orders[orderIndex], ...parsedData };
        recordAuditLog(db, {
          actionType: 'ORDER_STATUS_MODIFIED',
          targetId: orderId,
          details: `Admin can thiệp đổi trạng thái đơn hàng ${orderId} thành: ${parsedData.status}`
        });
        saveLocalData(db);
        return { data: db.orders[orderIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 4. Giám sát Đánh giá (Reviews & Feedback)
    if (cleanUrl === '/reviews') {
      if (method.toLowerCase() === 'get') {
        return { data: db.reviews, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/reviews/')) {
      const revId = cleanUrl.replace('/reviews/', '');
      const revIndex = db.reviews.findIndex((r) => r.id === revId);
      if (revIndex === -1) {
        return { data: { message: 'Review not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }
      if (method.toLowerCase() === 'patch') {
        db.reviews[revIndex] = { ...db.reviews[revIndex], ...parsedData };
        recordAuditLog(db, {
          actionType: 'REVIEW_MODERATED',
          targetId: revId,
          details: `Kiểm duyệt đánh giá ${revId}: chuyển trạng thái thành ${parsedData.status}`
        });
        saveLocalData(db);
        return { data: db.reviews[revIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 5. Khiếu nại tranh chấp (Disputes)
    if (cleanUrl === '/disputes') {
      if (method.toLowerCase() === 'get') {
        return { data: db.disputes, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/disputes/')) {
      const dispId = cleanUrl.replace('/disputes/', '');
      const dispIndex = db.disputes.findIndex((d) => d.id === dispId);
      if (dispIndex === -1) {
        return { data: { message: 'Dispute not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }
      if (method.toLowerCase() === 'patch') {
        db.disputes[dispIndex] = { ...db.disputes[dispIndex], ...parsedData };
        recordAuditLog(db, {
          actionType: 'DISPUTE_ARBITRATED',
          targetId: dispId,
          details: `Phân xử tranh chấp ${dispId} (${db.disputes[dispIndex].buyerName} vs ${db.disputes[dispIndex].sellerName}): Kết quả: ${parsedData.status}. Ghi chú: ${parsedData.resolutionNotes || 'N/A'}`
        });
        saveLocalData(db);
        return { data: db.disputes[dispIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 6. Yêu cầu hoàn trả (Return Requests)
    if (cleanUrl === '/returns') {
      if (method.toLowerCase() === 'get') {
        return { data: db.returnRequests, status: 200, statusText: 'OK', headers: {}, config };
      }
    }
    if (cleanUrl.startsWith('/returns/')) {
      const retId = cleanUrl.replace('/returns/', '');
      const retIndex = db.returnRequests.findIndex((r) => r.id === retId);
      if (retIndex === -1) {
        return { data: { message: 'Return request not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
      }
      if (method.toLowerCase() === 'patch') {
        db.returnRequests[retIndex] = { ...db.returnRequests[retIndex], ...parsedData };
        recordAuditLog(db, {
          actionType: parsedData.status === 'Approved' ? 'RETURN_APPROVED' : 'RETURN_REJECTED',
          targetId: retId,
          details: `Xử lý yêu cầu đổi trả ${retId}: Quyết định [${parsedData.status}]. Ghi chú admin: ${parsedData.adminNote || 'Đã kiểm tra bằng chứng'}`
        });
        saveLocalData(db);
        return { data: db.returnRequests[retIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 7. Gửi thông báo/cảnh báo toàn hệ thống (Broadcasts)
    if (cleanUrl === '/broadcasts') {
      if (method.toLowerCase() === 'get') {
        return { data: db.broadcasts, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (method.toLowerCase() === 'post') {
        const newBroadcast = {
          id: `BC-${Date.now().toString().slice(-4)}`,
          title: parsedData.title,
          message: parsedData.message,
          target: parsedData.target || 'Toàn bộ người dùng',
          type: parsedData.type || 'warning',
          sentAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
          sentBy: parsedData.sentBy || 'Super Admin',
          recipientCount: parsedData.recipientCount || (parsedData.target === 'Chỉ Người bán (Sellers)' ? 320 : 1540)
        };
        db.broadcasts.unshift(newBroadcast);
        recordAuditLog(db, {
          actionType: 'SYSTEM_BROADCAST_SENT',
          targetId: newBroadcast.id,
          details: `Gửi thông báo diện rộng: "${newBroadcast.title}" đến đối tượng [${newBroadcast.target}]`
        });
        saveLocalData(db);
        return { data: newBroadcast, status: 201, statusText: 'Created', headers: {}, config };
      }
    }

    // 8. Nhật ký an ninh & Dữ liệu nhạy cảm (Audit Logs)
    if (cleanUrl === '/audit-logs') {
      if (method.toLowerCase() === 'get') {
        return { data: db.auditLogs, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // 9. Thống kê hệ thống (Statistics)
    if (cleanUrl === '/statistics') {
      return { data: db.statistics, status: 200, statusText: 'OK', headers: {}, config };
    }

    // 10. Admin Profiles
    if (cleanUrl === '/admin-profiles') {
      return { data: db.adminProfiles, status: 200, statusText: 'OK', headers: {}, config };
    }

    // 11. Đăng nhập & Xác minh 2FA mô phỏng
    if (cleanUrl === '/auth/verify-2fa') {
      const { code } = parsedData;
      if (code === '123456' || code === '888888' || code === '999999') {
        recordAuditLog(db, {
          actionType: 'ADMIN_2FA_VERIFIED',
          targetId: 'AUTH',
          details: 'Xác minh 2FA cấp độ cao thành công qua OTP TOTP.'
        });
        saveLocalData(db);
        return { data: { success: true, message: 'Xác minh 2FA thành công!' }, status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: { success: false, message: 'Mã 2FA không chính xác! (Thử: 123456)' }, status: 400, statusText: 'Bad Request', headers: {}, config };
    }

    // 12. Khôi phục dữ liệu gốc từ database.json
    if (cleanUrl === '/system/reset') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase));
      return { data: { success: true, message: 'Đã khôi phục dữ liệu gốc từ database.json' }, status: 200, statusText: 'OK', headers: {}, config };
    }

    return { data: { message: `Route ${cleanUrl} not handled` }, status: 404, statusText: 'Not Found', headers: {}, config };
  }
});

export default api;

