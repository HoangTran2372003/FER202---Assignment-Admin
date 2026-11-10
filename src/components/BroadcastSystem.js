import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Megaphone,
  Send,
  EnvelopeCheck,
  ClockHistory,
  CheckCircle,
  People
} from 'react-bootstrap-icons';

function BroadcastSystem(props) {
  const context = useOutletContext() || {};
  const broadcasts = props.broadcasts || context.broadcasts || [];
  const onSendBroadcast = props.onSendBroadcast || context.handleSendBroadcast || (() => {});
  const currentAdmin = props.currentAdmin || context.currentAdmin || { role: 'Super Admin', name: 'Super Admin' };
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('Toàn bộ người dùng');
  const [type, setType] = useState('warning');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    await onSendBroadcast({
      title,
      target,
      type,
      message,
      sentBy: currentAdmin.name,
      recipientCount: target === 'Chỉ Người bán (Sellers)' ? 320 : target === 'Chỉ Người mua (Buyers)' ? 1220 : 1540
    });

    setIsSending(false);
    setSuccessAlert(true);
    setTitle('');
    setMessage('');

    setTimeout(() => {
      setSuccessAlert(false);
    }, 4000);
  };

  const getTypeBadge = (bType) => {
    switch (bType) {
      case 'warning':
        return <Badge bg="danger">Cảnh báo bảo mật</Badge>;
      case 'maintenance':
        return <Badge bg="warning" text="dark">Bảo trì hệ thống</Badge>;
      case 'policy':
        return <Badge bg="info">Chính sách mới</Badge>;
      case 'promotion':
        return <Badge bg="success">Khuyến mại sàn</Badge>;
      default:
        return <Badge bg="secondary">Thông báo chung</Badge>;
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Gửi Cảnh Báo Hệ Thống & Email Toàn Thể Người Dùng</h4>
          <p className="text-muted small mb-0">
            Truyền thông khẩn cấp, cảnh báo các thủ đoạn gian lận lừa đảo, lịch bảo trì máy chủ hoặc phổ biến quy chế sàn eBay Clone.
          </p>
        </div>
        <div>
          <Badge bg="primary" className="p-2 border">
            Đã phát hành: <strong>{broadcasts.length} thông báo</strong>
          </Badge>
        </div>
      </div>

      {successAlert && (
        <Alert variant="success" className="d-flex align-items-center gap-2 py-2 mb-4">
          <CheckCircle className="fs-5" />
          <span>
            Thông báo đã được gửi thành công đến <strong>{target}</strong> và lưu vào Nhật Ký Hệ Thống!
          </span>
        </Alert>
      )}

      {/* Main Row: Form on Left, Live Preview on Right */}
      <Row className="g-4 mb-4">
        {/* Left: Compose Form */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <Megaphone className="text-primary" />
              <h6 className="fw-bold mb-0">Soạn Thảo Thông Báo Phát Sóng (Broadcast Email)</h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-3">
                  <Col md={7}>
                    <Form.Group>
                      <Form.Label className="fw-bold small">Đối tượng nhận thông báo:</Form.Label>
                      <Form.Select value={target} onChange={(e) => setTarget(e.target.value)}>
                        <option value="Toàn bộ người dùng">Tất cả người dùng (Buyers + Sellers - ~1,540 tài khoản)</option>
                        <option value="Chỉ Người bán (Sellers)">Chỉ đối tác bán hàng (Sellers - 320 cửa hàng)</option>
                        <option value="Chỉ Người mua (Buyers)">Chỉ người mua hàng (Buyers - 1,220 tài khoản)</option>
                        <option value="Nhóm vi phạm chính sách">Tài khoản có lịch sử vi phạm / Bị cảnh cáo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group>
                      <Form.Label className="fw-bold small">Phân loại thông báo:</Form.Label>
                      <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="warning">Cảnh báo khẩn cấp / Lừa đảo (Warning)</option>
                        <option value="maintenance">Lịch bảo trì máy chủ (Maintenance)</option>
                        <option value="policy">Quy định & Chính sách mới (Policy)</option>
                        <option value="promotion">Thông báo sự kiện / Khuyến mại (Promotion)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Tiêu đề thông báo / Tiêu đề Email:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: [CẢNH BÁO BẢO MẬT] Cảnh giác thủ đoạn lừa đảo qua tin nhắn SMS..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Nội dung chi tiết:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Nhập nội dung chi tiết thông điệp của Ban Quản Trị..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <div className="text-muted small mt-1">
                    Hệ thống sẽ đồng thời kích hoạt gửi email tự động và hiển thị banner thông báo nổi bật trên trang chủ người dùng.
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <small className="text-muted">
                    Người phát hành: <strong>{currentAdmin.name}</strong>
                  </small>
                  <Button variant="primary" type="submit" disabled={isSending} className="d-flex align-items-center gap-1">
                    <Send /> {isSending ? 'Đang gửi...' : 'Phát Hành Thông Báo Ngay'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Live Preview Box */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <EnvelopeCheck className="text-success" />
              <h6 className="fw-bold mb-0">Xem Trước Giao Diện Email Nhận Được</h6>
            </Card.Header>
            <Card.Body className="bg-light">
              <div className="bg-white p-4 rounded shadow-sm border">
                {/* Email Header */}
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <span className="ebay-logo" style={{ fontSize: '1.2rem' }}>
                    <span className="ebay-e">e</span>
                    <span className="ebay-b">b</span>
                    <span className="ebay-a">a</span>
                    <span className="ebay-y">y</span>
                  </span>
                  <Badge bg="light" text="dark" className="border small">
                    Official Notice
                  </Badge>
                </div>

                {/* Email Content */}
                <div className="mb-2">{getTypeBadge(type)}</div>
                <h6 className="fw-bold text-dark mt-2">
                  {title || 'Tiêu đề thông báo sẽ hiển thị tại đây...'}
                </h6>
                <div className="text-muted small mb-3">
                  Gửi tới: <strong>{target}</strong> | Từ: <strong>eBay Trust & Safety Team</strong>
                </div>

                <div className="p-3 bg-light rounded text-dark small mb-3 border">
                  {message || 'Nội dung thông báo sẽ hiển thị trực quan ở đây để bạn kiểm tra trước khi bấm gửi đến toàn bộ người dùng...'}
                </div>

                <div className="border-top pt-2 text-center text-muted" style={{ fontSize: '0.7rem' }}>
                  © 2026 eBay Clone Marketplace Inc. Mọi quyền được bảo lưu. Email tự động từ máy chủ quản trị.
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Broadcasts History Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom d-flex align-items-center gap-2">
          <ClockHistory className="text-secondary" />
          <h6 className="fw-bold mb-0">Lịch Sử Thông Báo & Cảnh Báo Đã Phát Hành</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Mã</th>
                <th>Tiêu Đề Thông Báo</th>
                <th>Phân Loại</th>
                <th>Đối Tượng Nhận</th>
                <th>Số Lượng Nhận</th>
                <th>Thời Gian Gửi</th>
                <th>Người Gửi</th>
              </tr>
            </thead>
            <tbody className="small">
              {broadcasts.map((b) => (
                <tr key={b.id}>
                  <td className="fw-bold font-monospace text-primary">{b.id}</td>
                  <td>
                    <div className="fw-bold text-truncate" style={{ maxWidth: '300px' }} title={b.title}>
                      {b.title}
                    </div>
                    <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>
                      {b.message}
                    </small>
                  </td>
                  <td>{getTypeBadge(b.type)}</td>
                  <td>
                    <Badge bg="light" text="dark" className="border">
                      {b.target}
                    </Badge>
                  </td>
                  <td>
                    <span className="d-flex align-items-center gap-1 text-success fw-semibold">
                      <People size={13} /> {b.recipientCount} người dùng
                    </span>
                  </td>
                  <td className="text-muted">{b.sentAt}</td>
                  <td className="fw-semibold">{b.sentBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BroadcastSystem;

