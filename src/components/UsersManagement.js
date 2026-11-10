import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  PersonCheck,
  Lock,
  Unlock,
  Eye,
  Shop,
  ShieldExclamation,
  ExclamationCircle,
  Funnel
} from 'react-bootstrap-icons';

function UsersManagement(props) {
  const context = useOutletContext() || {};
  const users = props.users || context.users || [];
  const onUpdateUser = props.onUpdateUser || context.handleUpdateUser || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State for Locking User
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedUserToLock, setSelectedUserToLock] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // Modal State for Viewing User Details
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.storeName && u.storeName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleOpenLockModal = (user) => {
    setSelectedUserToLock(user);
    setLockReason('');
    setShowLockModal(true);
  };

  const handleConfirmLock = async () => {
    if (!selectedUserToLock) return;
    await onUpdateUser(selectedUserToLock.id, {
      status: 'locked',
      lockReason: lockReason || 'Vi phạm chính sách an toàn của cộng đồng eBay Clone.',
      strikes: (selectedUserToLock.strikes || 0) + 1
    });
    setShowLockModal(false);
  };

  const handleUnlockUser = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản cho ${user.name}?`)) {
      await onUpdateUser(user.id, {
        status: 'active',
        lockReason: null
      });
    }
  };

  const handleApproveUser = async (user) => {
    await onUpdateUser(user.id, {
      status: 'active',
      wasPending: true
    });
  };

  const handleViewDetail = (user) => {
    setSelectedUserDetail(user);
    setShowDetailModal(true);
  };

  return (
    <div>
      {/* Title & Stats */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Quản Lý Người Dùng Hệ Thống</h4>
          <p className="text-muted small mb-0">
            Duyệt tài khoản người bán mới, kiểm tra hồ sơ, khóa hoặc mở khóa tài khoản vi phạm.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="warning" text="dark" className="p-2 border">
            Chờ duyệt: <strong>{users.filter((u) => u.status === 'pending_approval').length}</strong>
          </Badge>
          <Badge bg="danger" className="p-2 border">
            Đã khóa: <strong>{users.filter((u) => u.status === 'locked').length}</strong>
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="g-2">
            <Col md={5}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-white">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo Tên, Email, Tên Cửa Hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả trạng thái --</option>
                <option value="pending_approval">Đang chờ phê duyệt (Pending)</option>
                <option value="active">Đang hoạt động (Active)</option>
                <option value="locked">Bị khóa vi phạm (Locked)</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả vai trò --</option>
                <option value="seller">Người bán (Seller)</option>
                <option value="buyer">Người mua (Buyer)</option>
              </Form.Select>
            </Col>
            <Col md={1} className="d-grid">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setRoleFilter('ALL');
                }}
                title="Đặt lại bộ lọc"
              >
                <Funnel />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Người dùng</th>
                <th>Vai trò & Cửa hàng</th>
                <th>Liên hệ</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Cảnh cáo</th>
                <th className="text-end">Thao tác Quản trị</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Không tìm thấy người dùng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className={u.status === 'pending_approval' ? 'table-warning-subtle' : ''}>
                    {/* User info */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="avatar-circle" />
                        <div>
                          <div className="fw-bold">{u.name}</div>
                          <small className="text-muted font-monospace">{u.id}</small>
                        </div>
                      </div>
                    </td>

                    {/* Role & Store */}
                    <td>
                      <Badge
                        bg={u.role === 'seller' ? 'primary' : 'secondary'}
                        className="me-1"
                      >
                        {u.role === 'seller' ? 'Người bán (Seller)' : 'Người mua (Buyer)'}
                      </Badge>
                      {u.storeName && (
                        <div className="text-muted mt-1 small d-flex align-items-center gap-1">
                          <Shop size={12} /> {u.storeName}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td>
                      <div>{u.email}</div>
                      <small className="text-muted">{u.phone}</small>
                    </td>

                    {/* Reg Date */}
                    <td className="text-muted">{u.registeredAt}</td>

                    {/* Status */}
                    <td>
                      {u.status === 'active' && <Badge bg="success">Hoạt động</Badge>}
                      {u.status === 'pending_approval' && (
                        <Badge bg="warning" text="dark">Chờ duyệt</Badge>
                      )}
                      {u.status === 'locked' && (
                        <div>
                          <Badge bg="danger">Đã khóa</Badge>
                          {u.lockReason && (
                            <div className="text-danger small mt-1 text-truncate" style={{ maxWidth: '160px' }} title={u.lockReason}>
                              {u.lockReason}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Strikes */}
                    <td>
                      {u.strikes > 0 ? (
                        <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                          <ShieldExclamation size={12} /> {u.strikes} lần phạt
                        </Badge>
                      ) : (
                        <span className="text-muted">0</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="action-btn"
                          title="Xem chi tiết hồ sơ"
                          onClick={() => handleViewDetail(u)}
                        >
                          <Eye />
                        </Button>

                        {/* Duyệt tài khoản mới */}
                        {u.status === 'pending_approval' && (
                          <Button
                            variant="success"
                            size="sm"
                            className="action-btn d-flex align-items-center gap-1"
                            onClick={() => handleApproveUser(u)}
                            title="Phê duyệt tài khoản mới"
                          >
                            <PersonCheck /> Duyệt
                          </Button>
                        )}

                        {/* Mở khóa tài khoản */}
                        {u.status === 'locked' && (
                          <Button
                            variant="warning"
                            size="sm"
                            className="action-btn d-flex align-items-center gap-1"
                            onClick={() => handleUnlockUser(u)}
                            title="Mở khóa tài khoản"
                          >
                            <Unlock /> Mở khóa
                          </Button>
                        )}

                        {/* Khóa tài khoản */}
                        {u.status === 'active' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="action-btn"
                            onClick={() => handleOpenLockModal(u)}
                            title="Khóa tài khoản do vi phạm"
                          >
                            <Lock /> Khóa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Lock User Modal */}
      <Modal show={showLockModal} onHide={() => setShowLockModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="h6 d-flex align-items-center gap-2">
            <Lock size={18} /> Khóa Tài Khoản Vi Phạm Quy Định
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserToLock && (
            <div>
              <Alert variant="danger" className="small py-2 mb-3">
                <ExclamationCircle className="me-1" /> Bạn đang chuẩn bị đình chỉ quyền truy cập của người dùng này trên toàn hệ thống eBay Clone.
              </Alert>

              <div className="d-flex align-items-center gap-3 p-2 bg-light rounded mb-3">
                <img src={selectedUserToLock.avatar} alt={selectedUserToLock.name} className="avatar-circle" />
                <div>
                  <div className="fw-bold">{selectedUserToLock.name}</div>
                  <div className="text-muted small">{selectedUserToLock.email}</div>
                  <Badge bg="secondary" className="mt-1">{selectedUserToLock.role}</Badge>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Lý do khóa tài khoản (bắt buộc):</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ví dụ: Bán hàng giả nhái thương hiệu, cố tình giao hàng sai mô tả nhiều lần..."
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowLockModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmLock}>
            Xác nhận Khóa tài khoản
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">Chi Tiết Hồ Sơ Người Dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserDetail && (
            <div>
              <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
                <img
                  src={selectedUserDetail.avatar}
                  alt={selectedUserDetail.name}
                  className="rounded-circle border"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                />
                <div>
                  <h5 className="fw-bold mb-1">{selectedUserDetail.name}</h5>
                  <div className="text-muted small">{selectedUserDetail.email} | {selectedUserDetail.phone}</div>
                  <div className="d-flex gap-2 mt-1">
                    <Badge bg={selectedUserDetail.role === 'seller' ? 'primary' : 'secondary'}>
                      {selectedUserDetail.role === 'seller' ? 'Người bán (Seller)' : 'Người mua (Buyer)'}
                    </Badge>
                    <Badge
                      bg={
                        selectedUserDetail.status === 'active'
                          ? 'success'
                          : selectedUserDetail.status === 'pending_approval'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {selectedUserDetail.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Thông tin tài khoản</h6>
                    <div className="small mb-1"><strong>Mã User:</strong> {selectedUserDetail.id}</div>
                    <div className="small mb-1"><strong>Ngày tham gia:</strong> {selectedUserDetail.registeredAt}</div>
                    <div className="small mb-1"><strong>Số lần cảnh cáo (Strikes):</strong> {selectedUserDetail.strikes || 0}</div>
                    {selectedUserDetail.lockReason && (
                      <div className="small text-danger mt-2">
                        <strong>Lý do bị khóa:</strong> {selectedUserDetail.lockReason}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Thông tin bán hàng & Uy tín</h6>
                    {selectedUserDetail.role === 'seller' ? (
                      <>
                        <div className="small mb-1"><strong>Tên Gian Hàng:</strong> {selectedUserDetail.storeName || 'Chưa đặt tên'}</div>
                        <div className="small mb-1"><strong>Mã Giấy Phép KD:</strong> {selectedUserDetail.businessLicense || 'Cá nhân'}</div>
                        <div className="small mb-1"><strong>Điểm Uy Tín Feedback:</strong> {selectedUserDetail.feedbackScore || 0} điểm</div>
                        <div className="small mb-1"><strong>Đánh giá TB:</strong> ⭐ {selectedUserDetail.rating || 'Chưa có'} / 5.0</div>
                      </>
                    ) : (
                      <>
                        <div className="small mb-1"><strong>Tổng số đơn đã mua:</strong> {selectedUserDetail.ordersCount || 0} đơn</div>
                        <div className="small mb-1"><strong>Độ uy tín thanh toán:</strong> 100% Không nợ xấu</div>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsersManagement;

