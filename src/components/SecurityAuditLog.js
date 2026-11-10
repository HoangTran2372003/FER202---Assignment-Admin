import React, { useState } from 'react';
import { Card, Table, Badge, Button, Row, Col, Modal } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  ShieldLock,
  Key,
  Globe2,
  FileEarmarkLock2,
  Eye,
  ArrowClockwise,
  Diagram3
} from 'react-bootstrap-icons';

function SecurityAuditLog(props) {
  const context = useOutletContext() || {};
  const auditLogs = props.auditLogs || context.auditLogs || [];
  const networkIp = props.networkIp || context.networkIp || { ip: '192.168.1.45', isInternal: true };
  const onToggleNetwork = props.onToggleNetwork || context.handleToggleNetwork || (() => {});
  const is2FAVerified = props.is2FAVerified !== undefined ? props.is2FAVerified : (context.is2FAVerified ?? true);
  const onOpen2FA = props.onOpen2FA || context.handleOpen2FA || (() => {});
  const onResetData = props.onResetData || context.handleResetData || (() => {});
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const getActionBadge = (type) => {
    if (type.includes('USER_LOCKED') || type.includes('PRODUCT_DELETED')) {
      return <Badge bg="danger">{type}</Badge>;
    }
    if (type.includes('APPROVED')) {
      return <Badge bg="success">{type}</Badge>;
    }
    if (type.includes('DISPUTE') || type.includes('FLAGGED')) {
      return <Badge bg="warning" text="dark">{type}</Badge>;
    }
    if (type.includes('LOGIN') || type.includes('2FA')) {
      return <Badge bg="info">{type}</Badge>;
    }
    return <Badge bg="secondary">{type}</Badge>;
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">An Ninh Hệ Thống, Phân Quyền (RBAC) & Nhật Ký Mã Hóa</h4>
          <p className="text-muted small mb-0">
            Giám sát truy cập mạng nội bộ, cơ chế xác thực 2FA, ma trận quyền hạn các cấp quản trị viên và nhật ký băm SHA-256 các hành vi nhạy cảm.
          </p>
        </div>
        <div>
          <Button variant="outline-danger" size="sm" onClick={onResetData}>
            <ArrowClockwise className="me-1" /> Khôi phục dữ liệu gốc database.json
          </Button>
        </div>
      </div>

      {/* Row: Network & 2FA on Left, RBAC Matrix on Right */}
      <Row className="g-4 mb-4">
        {/* Network & 2FA Gate */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <ShieldLock className="text-primary" />
              <h6 className="fw-bold mb-0">Kiểm Soát Truy Cập Mạng & Xác Thực 2 Yếu Tố (2FA)</h6>
            </Card.Header>
            <Card.Body>
              {/* Network IP Box */}
              <div className="p-3 bg-light rounded border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Globe2 className="text-info fs-5" />
                    <div>
                      <div className="fw-bold small">Địa Chỉ IP Mạng Đang Kết Nối:</div>
                      <div className="font-monospace text-primary fw-bold">{networkIp.ip}</div>
                    </div>
                  </div>
                  <Badge bg={networkIp.isInternal ? 'success' : 'danger'}>
                    {networkIp.isInternal ? 'Mạng Nội Bộ Đã Whitelist' : 'Mạng Ngoài Không Xác Định'}
                  </Badge>
                </div>
                <div className="small text-muted mb-2">
                  {networkIp.isInternal
                    ? 'Bạn đang trong dải IP nội bộ FPT/eBay (192.168.1.x) - Cho phép truy cập Admin Panel an toàn.'
                    : 'Cảnh báo: Bạn đang truy cập từ mạng ngoài công cộng. Bắt buộc phải xác minh 2FA qua Google Authenticator!'}
                </div>
                <Button variant="outline-primary" size="sm" onClick={onToggleNetwork}>
                  Mô phỏng đổi kết nối: {networkIp.isInternal ? 'Chuyển sang IP Ngoài (Test 2FA)' : 'Về IP Nội Bộ An Toàn'}
                </Button>
              </div>

              {/* 2FA Box */}
              <div className="p-3 bg-light rounded border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Key className="text-warning fs-5" />
                    <div>
                      <div className="fw-bold small">Trạng Thái Xác Thực 2 Lớp (2FA TOTP):</div>
                      <div className="small text-muted">Bảo vệ phiên đăng nhập cấp độ cao</div>
                    </div>
                  </div>
                  <Badge bg={is2FAVerified ? 'success' : 'danger'}>
                    {is2FAVerified ? 'Đã Xác Minh TOTP' : 'Chưa Xác Minh'}
                  </Badge>
                </div>
                <Button variant="success" size="sm" onClick={onOpen2FA}>
                  {is2FAVerified ? 'Kiểm tra lại mã 2FA' : 'Kích hoạt / Xác thực mã 2FA'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RBAC Matrix Card */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <Diagram3 className="text-secondary" />
              <h6 className="fw-bold mb-0">Ma Trận Phân Quyền Quản Trị Viên (RBAC Policy)</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive size="sm" className="mb-0 text-center small align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-start">Chức năng</th>
                    <th>Super Admin</th>
                    <th>Support Admin</th>
                    <th>Monitor Admin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-start fw-semibold">Dashboard & Thống kê toàn diện</td>
                    <td className="text-success fw-bold">✓ Toàn quyền</td>
                    <td className="text-success fw-bold">✓ Xem</td>
                    <td className="text-success fw-bold">✓ Xem</td>
                  </tr>
                  <tr>
                    <td className="text-start fw-semibold">Duyệt & Khóa tài khoản User</td>
                    <td className="text-success fw-bold">✓ Toàn quyền</td>
                    <td className="text-muted">✗ Giới hạn</td>
                    <td className="text-success fw-bold">✓ Kiểm soát</td>
                  </tr>
                  <tr>
                    <td className="text-start fw-semibold">Ẩn / Xóa sản phẩm vi phạm</td>
                    <td className="text-success fw-bold">✓ Toàn quyền</td>
                    <td className="text-muted">✗ Giới hạn</td>
                    <td className="text-success fw-bold">✓ Kiểm soát</td>
                  </tr>
                  <tr>
                    <td className="text-start fw-semibold">Phân xử khiếu nại (Disputes)</td>
                    <td className="text-success fw-bold">✓ Quyết định cuối</td>
                    <td className="text-success fw-bold">✓ Trọng tài</td>
                    <td className="text-muted">✗ Giới hạn</td>
                  </tr>
                  <tr>
                    <td className="text-start fw-semibold">Duyệt hoàn trả đơn hàng</td>
                    <td className="text-success fw-bold">✓ Toàn quyền</td>
                    <td className="text-success fw-bold">✓ Duyệt nhanh</td>
                    <td className="text-muted">✗ Giới hạn</td>
                  </tr>
                  <tr>
                    <td className="text-start fw-semibold">Xem Nhật Ký Mã Hóa & Cấu hình IP</td>
                    <td className="text-success fw-bold">✓ Toàn quyền</td>
                    <td className="text-muted">✗ Khóa</td>
                    <td className="text-muted">✗ Khóa</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Audit Log Table (Sensitive Action Records with Encrypted Hash) */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FileEarmarkLock2 className="text-danger" />
            <h6 className="fw-bold mb-0">Nhật Ký Hành Vi Nhạy Cảm & Chuỗi Băm Mã Hóa (Audit Log SHA-256)</h6>
          </div>
          <Badge bg="dark">{auditLogs.length} sự kiện an ninh</Badge>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Mã Log</th>
                <th>Thời Gian</th>
                <th>Quản Trị Viên</th>
                <th>Vai Trò</th>
                <th>Loại Hành Động</th>
                <th>Mã Mục Tiêu</th>
                <th>Địa Chỉ IP</th>
                <th>Chuỗi Băm Bảo Mật (SHA-256)</th>
                <th className="text-end">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="small">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="fw-bold font-monospace text-muted">{log.id}</td>
                  <td className="text-nowrap">{log.timestamp}</td>
                  <td className="fw-semibold">{log.adminEmail}</td>
                  <td>
                    <Badge
                      bg={
                        log.adminRole === 'Super Admin'
                          ? 'danger'
                          : log.adminRole === 'Support Admin'
                          ? 'primary'
                          : 'warning'
                      }
                    >
                      {log.adminRole}
                    </Badge>
                  </td>
                  <td>{getActionBadge(log.actionType)}</td>
                  <td className="font-monospace text-primary">{log.targetId}</td>
                  <td className="small text-muted">{log.ipAddress}</td>
                  <td>
                    <span
                      className="font-monospace text-muted small d-inline-block text-truncate"
                      style={{ maxWidth: '140px' }}
                      title={log.encryptedHash}
                    >
                      {log.encryptedHash}
                    </span>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="action-btn"
                      onClick={() => handleViewLog(log)}
                      title="Xem nội dung chi tiết nhật ký"
                    >
                      <Eye size={12} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Log Detail Modal */}
      <Modal show={showLogModal} onHide={() => setShowLogModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold d-flex align-items-center gap-2">
            <FileEarmarkLock2 className="text-danger" /> Biên Bản Ghi Nhận An Ninh: {selectedLog?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div>
              <div className="bg-light p-3 rounded border mb-3 small">
                <div><strong>Thời điểm:</strong> {selectedLog.timestamp}</div>
                <div><strong>Quản trị viên thực hiện:</strong> {selectedLog.adminEmail} ({selectedLog.adminRole})</div>
                <div><strong>Địa chỉ IP:</strong> {selectedLog.ipAddress}</div>
                <div><strong>Mã đối tượng tác động:</strong> {selectedLog.targetId}</div>
              </div>

              <div className="mb-3">
                <div className="fw-bold small mb-1">Nội dung hành động chi tiết:</div>
                <div className="p-3 bg-white border rounded small text-dark">
                  {selectedLog.details}
                </div>
              </div>

              <div>
                <div className="fw-bold small mb-1 text-danger">Chữ ký điện tử & Mã băm SHA-256 bảo đảm toàn vẹn:</div>
                <div className="p-2 bg-dark text-light rounded font-monospace small" style={{ wordBreak: 'break-all' }}>
                  {selectedLog.encryptedHash}
                </div>
                <div className="text-muted small mt-1">
                  Mã băm này đảm bảo biên bản không thể bị làm giả hoặc can thiệp sau khi ghi nhận.
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowLogModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SecurityAuditLog;

