import React from 'react';
import { Row, Col, Card, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  People,
  BoxSeam,
  Receipt,
  CurrencyDollar,
  ExclamationTriangle,
  ArrowReturnLeft,
  CheckCircle,
  ExclamationOctagon,
  ShieldCheck,
  ArrowRight
} from 'react-bootstrap-icons';

function DashboardView(props) {
  const context = useOutletContext() || {};
  const users = props.users || context.users || [];
  const products = props.products || context.products || [];
  const orders = props.orders || context.orders || [];
  const disputes = props.disputes || context.disputes || [];
  const returnRequests = props.returnRequests || context.returnRequests || [];

  const navigate = useNavigate();
  const onNavigate = (tab) => {
    if (props.onNavigate) props.onNavigate(tab);
    navigate(`/${tab}`);
  };

  const onApproveUser = props.onApproveUser || context.handleApproveUser || (() => {});
  const onHideProduct = props.onHideProduct || context.handleHideProduct || (() => {});
  // Tính toán các chỉ số thống kê tổng quan
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === 'pending_approval');
  const lockedUsers = users.filter((u) => u.status === 'locked');

  const totalProducts = products.length;
  const flaggedProducts = products.filter((p) => p.status === 'flagged_violation');
  const hiddenProducts = products.filter((p) => p.status === 'hidden');

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingDisputes = disputes.filter((d) => d.status === 'Pending');
  const pendingReturns = returnRequests.filter((r) => r.status === 'Pending');

  return (
    <div>
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-dark">Bảng Điều Khiển Tổng Quan (Dashboard)</h4>
          <p className="text-muted small mb-0">
            Giám sát thời gian thực người dùng, sản phẩm niêm yết, đơn hàng và các cảnh báo vi phạm trên eBay Clone.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => onNavigate('statistics')}>
            Xem báo cáo chi tiết <ArrowRight className="ms-1" />
          </Button>
        </div>
      </div>

      {/* Critical Alert Banners if any pending actions */}
      {(pendingDisputes.length > 0 || pendingUsers.length > 0 || flaggedProducts.length > 0) && (
        <Alert variant="warning" className="border-warning d-flex align-items-center justify-content-between py-2 mb-4">
          <div className="d-flex align-items-center gap-2">
            <ExclamationTriangle className="text-warning-emphasis fs-5" />
            <span className="small">
              <strong>Yêu cầu xử lý gấp:</strong> Có{' '}
              {pendingDisputes.length > 0 && <span className="text-danger fw-bold">{pendingDisputes.length} khiếu nại tranh chấp</span>}
              {pendingUsers.length > 0 && <span>, <strong className="text-primary">{pendingUsers.length} tài khoản mới chờ duyệt</strong></span>}
              {flaggedProducts.length > 0 && <span>, <strong className="text-danger">{flaggedProducts.length} sản phẩm bị báo cáo vi phạm nặng</strong></span>}
              .
            </span>
          </div>
          <Button variant="warning" size="sm" className="fw-bold" onClick={() => onNavigate('disputes')}>
            Xử lý ngay
          </Button>
        </Alert>
      )}

      {/* KPI Cards Row (4 Cards) */}
      <Row className="g-3 mb-4">
        {/* Total Users Card */}
        <Col md={6} xl={3}>
          <Card className="stat-card shadow-sm h-100 border-0 bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Tổng Người Dùng</span>
                <div className="p-2 bg-primary-subtle text-primary rounded-3">
                  <People size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{totalUsers}</h3>
              <div className="d-flex align-items-center gap-2 small">
                <Badge bg="success">{users.filter((u) => u.status === 'active').length} Hoạt động</Badge>
                {pendingUsers.length > 0 && (
                  <Badge bg="warning" text="dark" className="cursor-pointer" onClick={() => onNavigate('users')}>
                    {pendingUsers.length} Chờ duyệt
                  </Badge>
                )}
                {lockedUsers.length > 0 && <Badge bg="danger">{lockedUsers.length} Đã khóa</Badge>}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Products Card */}
        <Col md={6} xl={3}>
          <Card className="stat-card shadow-sm h-100 border-0 bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Sản Phẩm Đăng Bán</span>
                <div className="p-2 bg-info-subtle text-info rounded-3">
                  <BoxSeam size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{totalProducts}</h3>
              <div className="d-flex align-items-center gap-2 small">
                <Badge bg="success">{products.filter((p) => p.status === 'active').length} Đang bán</Badge>
                {flaggedProducts.length > 0 && (
                  <Badge bg="danger" className="cursor-pointer" onClick={() => onNavigate('products')}>
                    {flaggedProducts.length} Vi phạm!
                  </Badge>
                )}
                {hiddenProducts.length > 0 && <Badge bg="secondary">{hiddenProducts.length} Đã ẩn</Badge>}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Orders Card */}
        <Col md={6} xl={3}>
          <Card className="stat-card shadow-sm h-100 border-0 bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Đơn Hàng Toàn Sàn</span>
                <div className="p-2 bg-success-subtle text-success rounded-3">
                  <Receipt size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">{totalOrders}</h3>
              <div className="d-flex align-items-center gap-2 small">
                <Badge bg="success">{orders.filter((o) => o.status === 'Delivered').length} Đã giao</Badge>
                <Badge bg="primary">{orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length} Đang vận chuyển</Badge>
                {orders.filter((o) => o.status === 'Disputed').length > 0 && (
                  <Badge bg="warning" text="dark">1 Khiếu nại</Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Revenue Card */}
        <Col md={6} xl={3}>
          <Card className="stat-card shadow-sm h-100 border-0 bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold text-uppercase">Doanh Thu Giao Dịch</span>
                <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-3">
                  <CurrencyDollar size={20} />
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <div className="d-flex align-items-center gap-2 small text-success fw-semibold">
                <CheckCircle size={14} /> +14.8% so với tuần trước
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Middle Grid: Pending Actions & Violations */}
      <Row className="g-3 mb-4">
        {/* Pending User Approvals */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <div className="d-flex align-items-center gap-2">
                <People className="text-primary" />
                <h6 className="fw-bold mb-0">Tài Khoản Chờ Phê Duyệt</h6>
              </div>
              <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => onNavigate('users')}>
                Xem tất cả ({pendingUsers.length})
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <CheckCircle size={28} className="text-success mb-2 d-block mx-auto" />
                  Hiện không có tài khoản mới nào chờ phê duyệt.
                </div>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Tài khoản</th>
                      <th>Cửa hàng / Loại</th>
                      <th>Ngày ĐK</th>
                      <th className="text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {pendingUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={u.avatar} alt={u.name} className="avatar-circle" />
                            <div>
                              <div className="fw-bold">{u.name}</div>
                              <small className="text-muted">{u.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="info" className="mb-1">{u.role === 'seller' ? 'Người bán (Store)' : 'Người mua'}</Badge>
                          <div className="text-truncate text-muted" style={{ maxWidth: '140px', fontSize: '0.75rem' }}>
                            {u.storeName || 'Tài khoản cá nhân'}
                          </div>
                        </td>
                        <td className="text-muted">{u.registeredAt}</td>
                        <td className="text-end">
                          <Button
                            variant="success"
                            size="sm"
                            className="py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => onApproveUser(u.id)}
                          >
                            Duyệt ngay
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Flagged Violating Products */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <div className="d-flex align-items-center gap-2">
                <ExclamationOctagon className="text-danger" />
                <h6 className="fw-bold mb-0">Sản Phẩm Cảnh Báo Vi Phạm Bản Quyền / Hàng Cấm</h6>
              </div>
              <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => onNavigate('products')}>
                Quản lý ({flaggedProducts.length})
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {flaggedProducts.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <CheckCircle size={28} className="text-success mb-2 d-block mx-auto" />
                  Không có sản phẩm nào vi phạm nghiêm trọng.
                </div>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Lý do vi phạm</th>
                      <th className="text-center">Báo cáo</th>
                      <th className="text-end">Xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {flaggedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="rounded border"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold text-truncate" style={{ maxWidth: '160px' }}>
                                {p.title}
                              </div>
                              <span className="text-danger fw-semibold">${p.price}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <small className="text-danger d-block text-truncate" style={{ maxWidth: '160px' }}>
                            {p.violationReason}
                          </small>
                          <small className="text-muted">Bởi: {p.sellerName}</small>
                        </td>
                        <td className="text-center">
                          <Badge bg="danger">{p.reportCount} lượt</Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => onHideProduct(p.id)}
                          >
                            Tạm ẩn
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row: Recent Orders & Quick System Health */}
      <Row className="g-3">
        {/* Recent Orders Overview */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Receipt className="text-secondary" />
                <h6 className="fw-bold mb-0">Đơn Hàng Gần Đây Cần Theo Dõi</h6>
              </div>
              <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => onNavigate('orders')}>
                Xem tất cả ({orders.length})
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Người Mua</th>
                    <th>Người Bán</th>
                    <th>Tổng Tiền</th>
                    <th>Thanh Toán</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="fw-bold text-primary">{o.id}</td>
                      <td>
                        <div>{o.buyerName}</div>
                        <small className="text-muted">{o.buyerEmail}</small>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '140px' }}>
                        {o.sellerName}
                      </td>
                      <td className="fw-bold">${o.totalAmount.toFixed(2)}</td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {o.paymentMethod}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={
                            o.status === 'Delivered'
                              ? 'success'
                              : o.status === 'Processing'
                              ? 'primary'
                              : o.status === 'Shipped'
                              ? 'info'
                              : o.status === 'Disputed'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* System Health & Fast Links */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <ShieldCheck className="text-success" /> Tình Trạng Hệ Thống Quản Trị
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Tranh Chấp Đã Giải Quyết:</span>
                  <strong>85% (Chuẩn eBay Guarantee)</strong>
                </div>
                <ProgressBar variant="success" now={85} style={{ height: '6px' }} />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Tỷ Lệ Xử Lý Đổi Trả Đạt Hạn:</span>
                  <strong>92% (&lt; 24h)</strong>
                </div>
                <ProgressBar variant="primary" now={92} style={{ height: '6px' }} />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Tài Nguyên Cơ Sở Dữ Liệu:</span>
                  <strong>database.json (Synced LocalStorage)</strong>
                </div>
                <ProgressBar variant="info" now={100} style={{ height: '6px' }} />
              </div>

              <div className="bg-light p-3 rounded small border">
                <div className="fw-bold mb-2">Thao tác Quản trị viên nhanh:</div>
                <div className="d-grid gap-2">
                  <Button variant="outline-dark" size="sm" onClick={() => onNavigate('disputes')}>
                    <ExclamationOctagon className="me-1 text-danger" /> Xem {pendingDisputes.length} Khiếu nại chờ phân xử
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => onNavigate('returns')}>
                    <ArrowReturnLeft className="me-1 text-info" /> Xem {pendingReturns.length} Yêu cầu hoàn tiền
                  </Button>
                  <Button variant="outline-dark" size="sm" onClick={() => onNavigate('broadcasts')}>
                    Phát thông báo / Email toàn hệ thống
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardView;

