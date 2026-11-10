import React from 'react';
import { Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Speedometer2,
  People,
  BoxSeam,
  Receipt,
  BarChartLine,
  Star,
  ExclamationOctagon,
  ArrowReturnLeft,
  Megaphone,
  ShieldLock
} from 'react-bootstrap-icons';

function Sidebar({ counts, currentAdmin, onSelectTab }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Tổng Quan Hệ Thống',
      icon: <Speedometer2 size={18} className="me-2" />,
      badge: null,
      permission: 'ALL'
    },
    {
      id: 'users',
      path: '/users',
      label: 'Quản Lý Người Dùng',
      icon: <People size={18} className="me-2" />,
      badge: counts.pendingUsers > 0 ? { count: counts.pendingUsers, variant: 'warning' } : null,
      permission: 'USER_LOCK'
    },
    {
      id: 'products',
      path: '/products',
      label: 'Quản Lý Sản Phẩm',
      icon: <BoxSeam size={18} className="me-2" />,
      badge: counts.flaggedProducts > 0 ? { count: counts.flaggedProducts, variant: 'danger' } : null,
      permission: 'PRODUCTS'
    },
    {
      id: 'orders',
      path: '/orders',
      label: 'Quản Lý Đơn Hàng',
      icon: <Receipt size={18} className="me-2" />,
      badge: null,
      permission: 'ORDERS'
    },
    {
      id: 'statistics',
      path: '/statistics',
      label: 'Thống Kê Báo Cáo',
      icon: <BarChartLine size={18} className="me-2" />,
      badge: null,
      permission: 'ALL'
    },
    {
      id: 'reviews',
      path: '/reviews',
      label: 'Giám Sát Đánh Giá',
      icon: <Star size={18} className="me-2" />,
      badge: counts.toxicReviews > 0 ? { count: counts.toxicReviews, variant: 'warning' } : null,
      permission: 'REVIEWS'
    },
    {
      id: 'disputes',
      path: '/disputes',
      label: 'Phân Xử Khiếu Nại',
      icon: <ExclamationOctagon size={18} className="me-2" />,
      badge: counts.pendingDisputes > 0 ? { count: counts.pendingDisputes, variant: 'danger' } : null,
      permission: 'DISPUTES'
    },
    {
      id: 'returns',
      path: '/returns',
      label: 'Duyệt Đổi Trả / Hoàn Tiền',
      icon: <ArrowReturnLeft size={18} className="me-2" />,
      badge: counts.pendingReturns > 0 ? { count: counts.pendingReturns, variant: 'info' } : null,
      permission: 'RETURNS'
    },
    {
      id: 'broadcasts',
      path: '/broadcasts',
      label: 'Cảnh Báo & Thông Báo',
      icon: <Megaphone size={18} className="me-2" />,
      badge: null,
      permission: 'ALL'
    },
    {
      id: 'security',
      path: '/security',
      label: 'An Ninh & Nhật Ký Mã Hóa',
      icon: <ShieldLock size={18} className="me-2" />,
      badge: null,
      permission: 'ALL'
    }
  ];

  const hasPermission = (itemPermission) => {
    if (!currentAdmin || !currentAdmin.permissions) return true;
    if (currentAdmin.permissions.includes('ALL')) return true;
    return currentAdmin.permissions.includes(itemPermission);
  };

  const handleItemClick = (item) => {
    if (onSelectTab) onSelectTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="admin-sidebar p-3 d-flex flex-column justify-content-between h-100">
      <div>
        <div className="text-uppercase fw-bold text-muted small px-3 mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
          Menu Điều Hành (Admin Panel)
        </div>
        <nav className="nav flex-column">
          {menuItems.map((item) => {
            const allowed = hasPermission(item.permission);
            const isActive =
              location.pathname === item.path ||
              (item.id === 'dashboard' && location.pathname === '/');

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${!allowed ? 'opacity-50' : ''}`}
                title={!allowed ? `Vai trò ${currentAdmin?.role} bị giới hạn quyền truy cập mục này` : ''}
              >
                <div className="d-flex align-items-center">
                  {item.icon}
                  <span style={{ fontSize: '0.88rem' }}>{item.label}</span>
                </div>
                <div>
                  {!allowed ? (
                    <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>Khóa</Badge>
                  ) : item.badge ? (
                    <Badge bg={item.badge.variant} className="badge-counter">
                      {item.badge.count}
                    </Badge>
                  ) : null}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="border-top pt-3 mt-4 small text-muted px-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>Phiên bản:</span>
          <strong>v2.6.4 Enterprise</strong>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span>Hệ thống:</span>
          <span className="text-success fw-bold">● Đang hoạt động</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
