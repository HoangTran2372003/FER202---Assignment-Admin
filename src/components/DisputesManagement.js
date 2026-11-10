import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  ExclamationOctagon,
  ShieldCheck,
  Funnel,
  Person,
  Shop
} from 'react-bootstrap-icons';

function DisputesManagement(props) {
  const context = useOutletContext() || {};
  const disputes = props.disputes || context.disputes || [];
  const onUpdateDispute = props.onUpdateDispute || context.handleUpdateDispute || (() => {});
  const currentAdmin = props.currentAdmin || context.currentAdmin || { role: 'Super Admin' };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Arbitrating Dispute
  const [showArbitrateModal, setShowArbitrateModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionChoice, setResolutionChoice] = useState('Refunded to Buyer');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Filter disputes
  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenArbitrate = (dispute) => {
    setSelectedDispute(dispute);
    setResolutionChoice('Refunded to Buyer');
    setResolutionNotes(
      `Phán quyết theo chính sách Bảo Vệ Khách Hàng eBay Money Back Guarantee: Xử lý cho tranh chấp ${dispute.id} trị giá $${dispute.amount}.`
    );
    setShowArbitrateModal(true);
  };

  const handleConfirmResolution = async () => {
    if (!selectedDispute) return;
    await onUpdateDispute(selectedDispute.id, {
      status: resolutionChoice,
      resolutionNotes: resolutionNotes,
      resolvedBy: currentAdmin.name
    });
    setShowArbitrateModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="danger">Chờ phân xử (Pending)</Badge>;
      case 'Under Review':
        return <Badge bg="warning" text="dark">Đang điều tra (Under Review)</Badge>;
      case 'Refunded to Buyer':
        return <Badge bg="success">Đã hoàn tiền Người Mua</Badge>;
      case 'Dismissed':
        return <Badge bg="secondary">Bác bỏ (Người bán thắng)</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Quản Lý & Phân Xử Khiếu Nại Tranh Chấp (Disputes)</h4>
          <p className="text-muted small mb-0">
            Hệ thống trọng tài phân xử eBay Money Back Guarantee giữa Người mua và Người bán khi có xung đột về chất lượng hàng hoặc giao nhận.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="danger" className="p-2 border">
            Chờ xử lý: <strong>{disputes.filter((d) => d.status === 'Pending').length}</strong>
          </Badge>
          <Badge bg="success" className="p-2 border">
            Đã giải quyết: <strong>{disputes.filter((d) => d.status === 'Refunded to Buyer' || d.status === 'Dismissed').length}</strong>
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <Row className="g-2">
            <Col md={7}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-white">
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm theo Mã DSP, Mã Đơn Hàng, Người Mua, Người Bán, Lý do..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả trạng thái khiếu nại --</option>
                <option value="Pending">Chờ phân xử (Pending)</option>
                <option value="Under Review">Đang yêu cầu chứng từ (Under Review)</option>
                <option value="Refunded to Buyer">Đã hoàn tiền cho Buyer</option>
                <option value="Dismissed">Bác bỏ khiếu nại (Dismissed)</option>
              </Form.Select>
            </Col>
            <Col md={1} className="d-grid">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                title="Đặt lại bộ lọc"
              >
                <Funnel />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Disputes Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã Tranh Chấp</th>
                <th>Mã Đơn Hàng</th>
                <th>Người Mua (Buyer)</th>
                <th>Người Bán (Seller)</th>
                <th>Số Tiền Tranh Chấp</th>
                <th>Lý Do Khiếu Nại</th>
                <th>Trạng Thái</th>
                <th className="text-end">Phân Xử Trọng Tài</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    Không có vụ tranh chấp khiếu nại nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((d) => (
                  <tr key={d.id} className={d.status === 'Pending' ? 'table-danger-subtle' : ''}>
                    {/* ID */}
                    <td className="fw-bold text-danger font-monospace">{d.id}</td>

                    {/* Order ID */}
                    <td className="font-monospace text-primary">{d.orderId}</td>

                    {/* Buyer */}
                    <td>
                      <div className="fw-semibold d-flex align-items-center gap-1">
                        <Person size={13} className="text-muted" /> {d.buyerName}
                      </div>
                      <small className="text-muted">{d.buyerEmail}</small>
                    </td>

                    {/* Seller */}
                    <td>
                      <div className="fw-semibold d-flex align-items-center gap-1">
                        <Shop size={13} className="text-muted" /> {d.sellerName}
                      </div>
                      <small className="text-muted">{d.sellerEmail}</small>
                    </td>

                    {/* Amount */}
                    <td>
                      <strong className="text-danger">${d.amount.toFixed(2)}</strong>
                    </td>

                    {/* Reason */}
                    <td>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '220px' }} title={d.reason}>
                        {d.reason}
                      </div>
                      <small className="text-muted">Tạo ngày: {d.createdAt}</small>
                    </td>

                    {/* Status */}
                    <td>{getStatusBadge(d.status)}</td>

                    {/* Action */}
                    <td className="text-end">
                      <Button
                        variant={d.status === 'Pending' ? 'danger' : 'outline-primary'}
                        size="sm"
                        className="action-btn d-flex align-items-center gap-1 ms-auto"
                        onClick={() => handleOpenArbitrate(d)}
                      >
                        <ExclamationOctagon size={13} />
                        <span>{d.status === 'Pending' ? 'Phân xử ngay' : 'Xem phán quyết'}</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Arbitrate Dispute Modal */}
      <Modal show={showArbitrateModal} onHide={() => setShowArbitrateModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="h6 d-flex align-items-center gap-2">
            <ShieldCheck size={20} /> Hội Đồng Trọng Tài Admin: Phân Xử Tranh Chấp {selectedDispute?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDispute && (
            <div>
              {/* Summary Header */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3 border">
                <div>
                  <div className="text-muted small">Đơn hàng liên quan: <strong>{selectedDispute.orderId}</strong></div>
                  <h6 className="fw-bold mb-0 text-danger mt-1">Lý do: {selectedDispute.reason}</h6>
                </div>
                <div className="text-end">
                  <div className="text-muted small">Số tiền yêu cầu bồi hoàn:</div>
                  <h4 className="fw-bold text-danger mb-0">${selectedDispute.amount.toFixed(2)}</h4>
                </div>
              </div>

              {/* Side-by-Side Claims: Buyer vs Seller */}
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <div className="border border-info rounded p-3 h-100 bg-info-subtle">
                    <h6 className="fw-bold small text-info-emphasis d-flex align-items-center gap-1 mb-2">
                      <Person /> Luận Điểm Của Người Mua ({selectedDispute.buyerName})
                    </h6>
                    <p className="small mb-0 text-dark">"{selectedDispute.buyerClaim}"</p>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border border-warning rounded p-3 h-100 bg-warning-subtle">
                    <h6 className="fw-bold small text-warning-emphasis d-flex align-items-center gap-1 mb-2">
                      <Shop /> Phản Hồi Từ Người Bán ({selectedDispute.sellerName})
                    </h6>
                    <p className="small mb-0 text-dark">"{selectedDispute.sellerResponse}"</p>
                  </div>
                </Col>
              </Row>

              {/* Resolution Form */}
              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold small mb-2 text-uppercase text-muted">Quyết Định Phân Xử Của Quản Trị Viên (Admin Verdict):</h6>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Chọn phương án phán quyết:</Form.Label>
                  <div className="d-flex flex-column gap-2">
                    <Form.Check
                      type="radio"
                      id="opt-refund"
                      name="arbitrationVerdict"
                      label="1. Hoàn tiền 100% cho Người Mua (eBay Money Back Guarantee - Trừ tài khoản Người Bán)"
                      checked={resolutionChoice === 'Refunded to Buyer'}
                      onChange={() => setResolutionChoice('Refunded to Buyer')}
                      className="fw-semibold text-success"
                    />
                    <Form.Check
                      type="radio"
                      id="opt-dismiss"
                      name="arbitrationVerdict"
                      label="2. Bác bỏ khiếu nại (Ủng hộ Người Bán - Khiếu nại của Người Mua không đủ căn cứ)"
                      checked={resolutionChoice === 'Dismissed'}
                      onChange={() => setResolutionChoice('Dismissed')}
                      className="fw-semibold text-secondary"
                    />
                    <Form.Check
                      type="radio"
                      id="opt-review"
                      name="arbitrationVerdict"
                      label="3. Yêu cầu hai bên tiếp tục bổ sung hình ảnh / biên lai vận chuyển (Đang điều tra)"
                      checked={resolutionChoice === 'Under Review'}
                      onChange={() => setResolutionChoice('Under Review')}
                      className="fw-semibold text-warning"
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small">Biên bản & Ghi chú phân xử (sẽ gửi email cho cả hai bên):</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Nhập căn cứ điều khoản eBay và lý giải phân xử..."
                    required
                  />
                </Form.Group>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowArbitrateModal(false)}>
            Hủy Bỏ
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmResolution}>
            Ban Hành Quyết Định Phân Xử
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DisputesManagement;

