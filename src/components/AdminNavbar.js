import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge, Button, Modal, Form } from 'react-bootstrap';
import {
  ShieldCheck,
  ShieldExclamation,
  ArrowClockwise,
  Key,
  Globe2,
  BoxArrowRight
} from 'react-bootstrap-icons';

function AdminNavbar({
  currentAdmin,
  onAdminChange,
  adminProfiles,
  is2FAVerified,
  onVerify2FA,
  networkIp,
  onToggleNetwork,
  onResetData,
  pendingCounts
}) {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (otpCode === '123456' || otpCode === '888888' || otpCode === '999999') {
      onVerify2FA(true);
      setShow2FAModal(false);
      setOtpCode('');
      setOtpError('');
    } else {
      setOtpError('Mã xác thực không hợp lệ! Vui lòng nhập mã dùng thử: 123456');
    }
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="border-bottom sticky-top py-2 shadow-sm">
        <Container fluid className="px-4">
          {/* Logo & Portal title */}
          <Navbar.Brand href="#home" className="d-flex align-items-center me-4">
            <span className="ebay-logo me-2">
              <span className="ebay-e">e</span>
              <span className="ebay-b">b</span>
              <span className="ebay-a">a</span>
              <span className="ebay-y">y</span>
            </span>
            <div className="border-start ps-2 ms-1">
              <span className="fw-bold text-dark d-block lh-1" style={{ fontSize: '1rem' }}>
                Admin Portal
              </span>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Hệ Thống Quản Trị Trung Tâm
              </small>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-top-navbar" />
          <Navbar.Collapse id="admin-top-navbar">
            {/* Quick Status Pills */}
            <Nav className="me-auto d-flex align-items-center gap-2 my-2 my-lg-0">
              {/* Network IP Status */}
              <Badge
                bg={networkIp.isInternal ? 'light' : 'warning'}
                text={networkIp.isInternal ? 'dark' : 'dark'}
                className="border p-2 d-flex align-items-center gap-1 cursor-pointer"
                style={{ cursor: 'pointer', fontSize: '0.78rem' }}
                onClick={onToggleNetwork}
                title="Bấm để chuyển đổi giữa IP Nội Bộ và IP Mạng Ngoài (Test 2FA)"
              >
                <Globe2 className={networkIp.isInternal ? 'text-success' : 'text-danger'} />
                <span>IP: <strong>{networkIp.ip}</strong></span>
                <span className={`badge ms-1 ${networkIp.isInternal ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                  {networkIp.isInternal ? 'Nội bộ (Whitelisted)' : 'Bên ngoài (Yêu cầu 2FA)'}
                </span>
              </Badge>

              {/* 2FA Status */}
              <Badge
                bg={is2FAVerified ? 'success-subtle' : 'danger-subtle'}
                text={is2FAVerified ? 'success' : 'danger'}
                className="border p-2 d-flex align-items-center gap-1 cursor-pointer"
                style={{ cursor: 'pointer', fontSize: '0.78rem' }}
                onClick={() => setShow2FAModal(true)}
              >
                {is2FAVerified ? <ShieldCheck size={16} /> : <ShieldExclamation size={16} />}
                <span>2FA: <strong>{is2FAVerified ? 'Đã xác minh TOTP' : 'Chưa kích hoạt'}</strong></span>
              </Badge>
            </Nav>

            {/* Right side controls */}
            <div className="d-flex align-items-center gap-3">
              {/* Reset Data Button */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-flex align-items-center gap-1"
                onClick={onResetData}
                title="Khôi phục lại toàn bộ dữ liệu mẫu ban đầu từ database.json"
              >
                <ArrowClockwise />
                <span className="d-none d-md-inline">Reset database.json</span>
              </Button>

              {/* Admin Role Selector Dropdown (Phân quyền Admin RBAC) */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="admin-profile-dropdown"
                  className="d-flex align-items-center gap-2 border px-3 py-1 rounded-pill"
                >
                  <img
                    src={currentAdmin.avatar}
                    alt={currentAdmin.name}
                    className="avatar-circle"
                    style={{ width: '28px', height: '28px' }}
                  />
                  <div className="text-start d-none d-md-block">
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '140px', fontSize: '0.85rem' }}>
                      {currentAdmin.name}
                    </div>
                    <Badge
                      bg={
                        currentAdmin.role === 'Super Admin'
                          ? 'danger'
                          : currentAdmin.role === 'Support Admin'
                          ? 'primary'
                          : 'warning'
                      }
                      style={{ fontSize: '0.65rem' }}
                    >
                      {currentAdmin.role}
                    </Badge>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0" style={{ minWidth: '260px' }}>
                  <Dropdown.Header className="text-uppercase fw-bold text-muted small">
                    Chuyển đổi vai trò Admin (RBAC Test)
                  </Dropdown.Header>
                  {adminProfiles.map((adm) => (
                    <Dropdown.Item
                      key={adm.id}
                      active={adm.id === currentAdmin.id}
                      onClick={() => onAdminChange(adm)}
                      className="py-2"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={adm.avatar}
                          alt={adm.name}
                          className="avatar-circle"
                          style={{ width: '24px', height: '24px' }}
                        />
                        <div>
                          <div className="fw-bold small">{adm.name}</div>
                          <small className="text-muted d-block">{adm.role}</small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setShow2FAModal(true)}>
                    <Key className="me-2 text-primary" />
                    Kiểm tra xác thực 2FA OTP
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onToggleNetwork}>
                    <Globe2 className="me-2 text-info" />
                    Chuyển đổi IP ({networkIp.isInternal ? 'Thử IP Ngoài' : 'Về IP Nội Bộ'})
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      onVerify2FA(false);
                      setShow2FAModal(true);
                    }}
                    className="text-danger"
                  >
                    <BoxArrowRight className="me-2" />
                    Đăng xuất phiên làm việc
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2FA Verification Modal */}
      <Modal show={show2FAModal} onHide={() => setShow2FAModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="h6 d-flex align-items-center gap-2 text-primary">
            <Key size={20} />
            Xác minh Bảo Mật 2 Lớp (Admin 2FA Verification)
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handle2FASubmit}>
          <Modal.Body>
            <div className="text-center mb-4">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-inline-flex p-3 mb-2"
                style={{ width: '64px', height: '64px', alignItems: 'center', justifyContent: 'center' }}
              >
                <ShieldCheck size={32} />
              </div>
              <h5 className="fw-bold mb-1">Xác thực Google Authenticator / TOTP</h5>
              <p className="text-muted small">
                Yêu cầu bảo mật cấp cao đối với Quản trị viên truy cập từ mạng ngoài hoặc thực hiện thao tác nhạy cảm.
              </p>
            </div>

            <div className="bg-light p-3 rounded mb-3 small border">
              <div><strong>Admin hiện tại:</strong> {currentAdmin.name} ({currentAdmin.email})</div>
              <div><strong>Mạng kết nối:</strong> {networkIp.ip} ({networkIp.isInternal ? 'Nội bộ an toàn' : 'Mạng ngoài'})</div>
              <div className="text-success mt-1"><strong>Mã thử nghiệm hợp lệ:</strong> <code>123456</code> hoặc <code>888888</code></div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Nhập mã OTP 6 chữ số:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="text-center fw-bold fs-4 tracking-widest"
                autoFocus
                required
              />
              {otpError && <div className="text-danger small mt-1">{otpError}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow2FAModal(false)}>
              Đóng
            </Button>
            <Button variant="primary" type="submit">
              Xác minh ngay
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AdminNavbar;

