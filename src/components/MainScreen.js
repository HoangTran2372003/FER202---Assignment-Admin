import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import api from '../services/api';
import AdminNavbar from './AdminNavbar';
import Sidebar from './Sidebar';

function MainScreen() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', variant: 'success' });

  // Security & Authentication State
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [networkIp, setNetworkIp] = useState({ ip: '192.168.1.45', isInternal: true });
  const [is2FAVerified, setIs2FAVerified] = useState(true);

  // Business Data Collections
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const showToast = (message, variant = 'success') => {
    setToastInfo({ show: true, message, variant });
  };

  // Fetch all data from database.json via Axios
  const loadAllData = useCallback(async () => {
    try {
      const [
        usersRes,
        productsRes,
        ordersRes,
        reviewsRes,
        disputesRes,
        returnsRes,
        broadcastsRes,
        auditLogsRes,
        statsRes,
        profilesRes
      ] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/reviews'),
        api.get('/disputes'),
        api.get('/returns'),
        api.get('/broadcasts'),
        api.get('/audit-logs'),
        api.get('/statistics'),
        api.get('/admin-profiles')
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setReviews(reviewsRes.data);
      setDisputes(disputesRes.data);
      setReturnRequests(returnsRes.data);
      setBroadcasts(broadcastsRes.data);
      setAuditLogs(auditLogsRes.data);
      setStatistics(statsRes.data);
      setAdminProfiles(profilesRes.data);

      if (!currentAdmin && profilesRes.data.length > 0) {
        setCurrentAdmin(profilesRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data with Axios:', error);
      showToast('Lỗi khi tải dữ liệu từ database.json qua Axios!', 'danger');
    } finally {
      setLoading(false);
    }
  }, [currentAdmin]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Actions on Users
  const handleUpdateUser = async (userId, updates) => {
    try {
      const res = await api.patch(`/users/${userId}`, updates);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đã cập nhật trạng thái người dùng ${userId} thành công!`);
    } catch (err) {
      showToast('Lỗi khi cập nhật người dùng!', 'danger');
    }
  };

  // Actions on Products
  const handleUpdateProduct = async (productId, updates) => {
    try {
      const res = await api.patch(`/products/${productId}`, updates);
      setProducts((prev) => prev.map((p) => (p.id === productId ? res.data : p)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đã cập nhật trạng thái sản phẩm ${productId}!`);
    } catch (err) {
      showToast('Lỗi khi cập nhật sản phẩm!', 'danger');
    }
  };

  const handleDeleteProduct = async (productId, reason) => {
    try {
      await api.delete(`/products/${productId}`, { data: { reason } });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đã xóa vĩnh viễn sản phẩm vi phạm ${productId}!`, 'warning');
    } catch (err) {
      showToast('Lỗi khi xóa sản phẩm!', 'danger');
    }
  };

  // Actions on Orders
  const handleUpdateOrder = async (orderId, updates) => {
    try {
      const res = await api.patch(`/orders/${orderId}`, updates);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đơn hàng ${orderId} đã được cập nhật trạng thái: ${updates.status}!`);
    } catch (err) {
      showToast('Lỗi khi cập nhật đơn hàng!', 'danger');
    }
  };

  // Actions on Reviews
  const handleUpdateReview = async (reviewId, updates) => {
    try {
      const res = await api.patch(`/reviews/${reviewId}`, updates);
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? res.data : r)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đã cập nhật trạng thái đánh giá ${reviewId}!`);
    } catch (err) {
      showToast('Lỗi khi cập nhật đánh giá!', 'danger');
    }
  };

  // Actions on Disputes
  const handleUpdateDispute = async (disputeId, updates) => {
    try {
      const res = await api.patch(`/disputes/${disputeId}`, updates);
      setDisputes((prev) => prev.map((d) => (d.id === disputeId ? res.data : d)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Đã ban hành phán quyết cho khiếu nại ${disputeId}!`);
    } catch (err) {
      showToast('Lỗi khi xử lý khiếu nại!', 'danger');
    }
  };

  // Actions on Returns
  const handleUpdateReturn = async (returnId, updates) => {
    try {
      const res = await api.patch(`/returns/${returnId}`, updates);
      setReturnRequests((prev) => prev.map((r) => (r.id === returnId ? res.data : r)));
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast(`Yêu cầu hoàn trả ${returnId} đã được quyết định: ${updates.status}!`);
    } catch (err) {
      showToast('Lỗi khi duyệt yêu cầu hoàn trả!', 'danger');
    }
  };

  // Actions on Broadcasts
  const handleSendBroadcast = async (newBroadcast) => {
    try {
      const res = await api.post('/broadcasts', newBroadcast);
      setBroadcasts((prev) => [res.data, ...prev]);
      const logsRes = await api.get('/audit-logs');
      setAuditLogs(logsRes.data);
      showToast('Thông báo hệ thống đã được phát sóng thành công!');
    } catch (err) {
      showToast('Lỗi khi gửi thông báo!', 'danger');
    }
  };

  // Reset database to default
  const handleResetData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu gốc từ database.json?')) {
      try {
        await api.post('/system/reset');
        await loadAllData();
        showToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu từ database.json!');
      } catch (err) {
        showToast('Lỗi khi khôi phục dữ liệu!', 'danger');
      }
    }
  };

  // Network toggle simulator
  const handleToggleNetwork = () => {
    if (networkIp.isInternal) {
      setNetworkIp({ ip: '203.113.15.8', isInternal: false });
      setIs2FAVerified(false);
      showToast('Đã chuyển sang mạng ngoài (203.113.15.8) - Yêu cầu xác thực 2FA!', 'warning');
    } else {
      setNetworkIp({ ip: '192.168.1.45', isInternal: true });
      setIs2FAVerified(true);
      showToast('Đã kết nối lại mạng nội bộ an toàn (192.168.1.45).');
    }
  };

  // Quick helper handlers for DashboardView
  const handleApproveUser = (uid) => handleUpdateUser(uid, { status: 'active', wasPending: true });
  const handleHideProduct = (pid) => handleUpdateProduct(pid, { status: 'hidden' });

  if (loading || !currentAdmin || !statistics) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5 className="fw-bold text-dark">eBay Clone - Đang khởi động Admin Portal...</h5>
        <p className="text-muted small">Đang nạp dữ liệu từ <code>database.json</code> qua Axios...</p>
      </div>
    );
  }

  // Pending counts for sidebar badges
  const pendingCounts = {
    pendingUsers: users.filter((u) => u.status === 'pending_approval').length,
    flaggedProducts: products.filter((p) => p.status === 'flagged_violation').length,
    toxicReviews: reviews.filter((r) => r.status === 'hidden_toxic').length,
    pendingDisputes: disputes.filter((d) => d.status === 'Pending').length,
    pendingReturns: returnRequests.filter((r) => r.status === 'Pending').length
  };

  // Check RBAC permission for current route
  const currentPath = location.pathname.replace('/', '') || 'dashboard';
  const checkPermissionForTab = (tab) => {
    if (!currentAdmin || !currentAdmin.permissions) return true;
    if (currentAdmin.permissions.includes('ALL')) return true;
    switch (tab) {
      case 'dashboard':
      case 'statistics':
      case 'broadcasts':
        return true;
      case 'users':
        return currentAdmin.permissions.includes('USER_LOCK');
      case 'products':
        return currentAdmin.permissions.includes('PRODUCTS');
      case 'orders':
        return currentAdmin.permissions.includes('ORDERS');
      case 'reviews':
        return currentAdmin.permissions.includes('REVIEWS');
      case 'disputes':
        return currentAdmin.permissions.includes('DISPUTES');
      case 'returns':
        return currentAdmin.permissions.includes('RETURNS');
      case 'security':
        return currentAdmin.permissions.includes('ALL');
      default:
        return true;
    }
  };

  const isTabAllowed = checkPermissionForTab(currentPath);

  // Context value passed to all nested route components
  const contextValue = {
    users,
    products,
    orders,
    reviews,
    disputes,
    returnRequests,
    broadcasts,
    auditLogs,
    statistics,
    currentAdmin,
    networkIp,
    is2FAVerified,
    setIs2FAVerified,
    handleUpdateUser,
    handleUpdateProduct,
    handleDeleteProduct,
    handleUpdateOrder,
    handleUpdateReview,
    handleUpdateDispute,
    handleUpdateReturn,
    handleSendBroadcast,
    handleResetData,
    handleToggleNetwork,
    handleApproveUser,
    handleHideProduct,
    handleOpen2FA: () => setIs2FAVerified(true),
    loadAllData
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <AdminNavbar
        currentAdmin={currentAdmin}
        onAdminChange={(adm) => {
          setCurrentAdmin(adm);
          showToast(`Đã chuyển đổi sang hồ sơ: ${adm.name} (${adm.role})`);
        }}
        adminProfiles={adminProfiles}
        is2FAVerified={is2FAVerified}
        onVerify2FA={(status) => {
          setIs2FAVerified(status);
          showToast(status ? 'Xác thực 2FA thành công!' : 'Đã đăng xuất phiên xác thực 2FA.');
        }}
        networkIp={networkIp}
        onToggleNetwork={handleToggleNetwork}
        onResetData={handleResetData}
        pendingCounts={pendingCounts}
      />

      {/* Main Layout */}
      <Container fluid className="px-0 flex-grow-1">
        <Row className="g-0 min-vh-100">
          {/* Sidebar */}
          <Col md={3} lg={2} className="border-end bg-white">
            <Sidebar
              counts={pendingCounts}
              currentAdmin={currentAdmin}
            />
          </Col>

          {/* Main Content Area (renders active Route via Outlet) */}
          <Col md={9} lg={10} className="p-4" style={{ backgroundColor: '#f4f6f9' }}>
            {!isTabAllowed ? (
              <Alert variant="danger" className="shadow-sm">
                <Alert.Heading className="h6 fw-bold">Giới Hạn Quyền Truy Cập (RBAC Restricted)</Alert.Heading>
                <p className="small mb-2">
                  Tài khoản của bạn hiện đang đăng nhập với vai trò <strong>{currentAdmin.role}</strong>. Bạn không có quyền truy cập hoặc thực hiện thay đổi tại phân hệ này.
                </p>
                <p className="small mb-0 text-muted">
                  Để kiểm tra tính năng này, vui lòng chuyển đổi tài khoản sang <strong>Super Admin</strong> tại menu trên cùng góc phải.
                </p>
              </Alert>
            ) : (
              <Outlet context={contextValue} />
            )}
          </Col>
        </Row>
      </Container>

      {/* Toast Feedback Notification */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
          show={toastInfo.show}
          delay={3500}
          autohide
          bg={toastInfo.variant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">eBay Admin Portal</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className={toastInfo.variant === 'light' ? 'text-dark' : 'text-white'}>
            {toastInfo.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default MainScreen;

