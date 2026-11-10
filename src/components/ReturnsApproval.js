import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  ArrowReturnLeft,
  CheckCircle,
  XCircle,
  Eye,
  Funnel
} from 'react-bootstrap-icons';

function ReturnsApproval(props) {
  const context = useOutletContext() || {};
  const returnRequests = props.returnRequests || context.returnRequests || [];
  const onUpdateReturn = props.onUpdateReturn || context.handleUpdateReturn || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Reviewing / Deciding
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [decisionAction, setDecisionAction] = useState('Approved'); // 'Approved' | 'Rejected'
  const [adminNote, setAdminNote] = useState('');

  // Filter requests
  const filteredReturns = returnRequests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (request, defaultDecision = 'Approved') => {
    setSelectedReturn(request);
    setDecisionAction(defaultDecision);
    setAdminNote(
      defaultDecision === 'Approved'
        ? 'Chấp thuận yêu cầu hoàn tiền/đổi trả. Người mua vui lòng dán nhãn vận chuyển eBay Return Label gửi lại hàng.'
        : 'Từ chối yêu cầu do quá hạn thời gian hoặc sản phẩm có dấu hiệu can thiệp sử dụng không còn nguyên vẹn.'
    );
    setShowReviewModal(true);
  };

  const handleConfirmDecision = async () => {
    if (!selectedReturn) return;
    await onUpdateReturn(selectedReturn.id, {
      status: decisionAction,
      adminNote: adminNote,
      decisionDate: new Date().toISOString().split('T')[0]
    });
    setShowReviewModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning" text="dark">Chờ xét duyệt (Pending)</Badge>;
      case 'Approved':
        return <Badge bg="success">Đã phê duyệt hoàn tiền</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Đã từ chối hoàn trả</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Xét Duyệt Yêu Cầu Hoàn Trả Đơn Hàng (Returns)</h4>
          <p className="text-muted small mb-0">
            Kiểm tra yêu cầu trả hàng, bằng chứng sản phẩm lỗi, phê duyệt hoàn tiền hoặc từ chối theo tiêu chuẩn bảo hành.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="warning" text="dark" className="p-2 border">
            Chờ duyệt: <strong>{returnRequests.filter((r) => r.status === 'Pending').length}</strong>
          </Badge>
          <Badge bg="success" className="p-2 border">
            Đã duyệt: <strong>{returnRequests.filter((r) => r.status === 'Approved').length}</strong>
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
                  placeholder="Tìm theo Mã RET, Mã Đơn Hàng, Người Mua, Sản phẩm..."
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
                <option value="ALL">-- Tất cả trạng thái --</option>
                <option value="Pending">Đang chờ xét duyệt (Pending)</option>
                <option value="Approved">Đã duyệt hoàn tiền (Approved)</option>
                <option value="Rejected">Đã từ chối (Rejected)</option>
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

      {/* Return Requests Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã Yêu Cầu</th>
                <th>Mã Đơn Hàng</th>
                <th>Người Mua</th>
                <th>Sản Phẩm Yêu Cầu Trả</th>
                <th>Giá Trị</th>
                <th>Lý Do Hoàn Trả</th>
                <th>Trạng Thái</th>
                <th className="text-end">Xét Duyệt</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    Không có yêu cầu hoàn trả nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((r) => (
                  <tr key={r.id} className={r.status === 'Pending' ? 'table-warning-subtle' : ''}>
                    {/* ID */}
                    <td className="fw-bold text-info font-monospace">{r.id}</td>

                    {/* Order ID */}
                    <td className="font-monospace text-primary">{r.orderId}</td>

                    {/* Buyer */}
                    <td>
                      <div className="fw-semibold">{r.buyerName}</div>
                      <small className="text-muted">Bán bởi: {r.sellerName}</small>
                    </td>

                    {/* Product */}
                    <td>
                      <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }} title={r.itemTitle}>
                        {r.itemTitle}
                      </div>
                      <Badge bg="light" text="dark" className="border">
                        {r.returnType}
                      </Badge>
                    </td>

                    {/* Price */}
                    <td>
                      <strong className="text-dark">${r.itemPrice.toFixed(2)}</strong>
                    </td>

                    {/* Reason */}
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={r.reason}>
                        {r.reason}
                      </div>
                      <small className="text-muted">Ngày gửi: {r.requestDate}</small>
                    </td>

                    {/* Status */}
                    <td>{getStatusBadge(r.status)}</td>

                    {/* Actions */}
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {r.status === 'Pending' ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="action-btn d-flex align-items-center gap-1"
                              onClick={() => handleOpenReview(r, 'Approved')}
                              title="Duyệt hoàn trả"
                            >
                              <CheckCircle size={12} /> Duyệt
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn d-flex align-items-center gap-1"
                              onClick={() => handleOpenReview(r, 'Rejected')}
                              title="Từ chối hoàn trả"
                            >
                              <XCircle size={12} /> Từ chối
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="action-btn d-flex align-items-center gap-1"
                            onClick={() => handleOpenReview(r, r.status)}
                            title="Xem chi tiết quyết định"
                          >
                            <Eye size={12} /> Chi tiết
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

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold d-flex align-items-center gap-2">
            <ArrowReturnLeft className="text-primary" /> Quyết Định Xét Duyệt Hoàn Trả: {selectedReturn?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReturn && (
            <div>
              <div className="p-3 bg-light rounded border mb-3">
                <Row className="g-2 small">
                  <Col md={6}>
                    <div><strong>Đơn hàng:</strong> {selectedReturn.orderId}</div>
                    <div><strong>Người mua:</strong> {selectedReturn.buyerName}</div>
                    <div><strong>Người bán:</strong> {selectedReturn.sellerName}</div>
                  </Col>
                  <Col md={6}>
                    <div><strong>Sản phẩm:</strong> {selectedReturn.itemTitle}</div>
                    <div><strong>Số tiền hoàn trả:</strong> <span className="text-danger fw-bold">${selectedReturn.itemPrice.toFixed(2)}</span></div>
                    <div><strong>Hình thức yêu cầu:</strong> {selectedReturn.returnType}</div>
                  </Col>
                </Row>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold small text-muted text-uppercase">Bằng chứng & Lý do hoàn trả từ khách hàng:</h6>
                <div className="p-3 bg-white border rounded">
                  <div className="fw-semibold mb-1">Lý do: {selectedReturn.reason}</div>
                  <div className="text-muted small">Bằng chứng ghi nhận: {selectedReturn.evidence}</div>
                </div>
              </div>

              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold small mb-2 text-uppercase text-muted">Quyết định của Quản trị viên:</h6>
                <Form.Group className="mb-3">
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="radio"
                      id="dec-approve"
                      name="decisionRadio"
                      label="Phê Duyệt Hoàn Tiền (Approved)"
                      checked={decisionAction === 'Approved'}
                      onChange={() => setDecisionAction('Approved')}
                      className="fw-bold text-success"
                    />
                    <Form.Check
                      type="radio"
                      id="dec-reject"
                      name="decisionRadio"
                      label="Từ Chối Yêu Cầu (Rejected)"
                      checked={decisionAction === 'Rejected'}
                      onChange={() => setDecisionAction('Rejected')}
                      className="fw-bold text-danger"
                    />
                  </div>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="fw-bold small">Ghi chú phản hồi cho Người mua & Người bán:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowReviewModal(false)}>
            Hủy
          </Button>
          <Button
            variant={decisionAction === 'Approved' ? 'success' : 'danger'}
            size="sm"
            onClick={handleConfirmDecision}
          >
            Lưu Quyết Định Xét Duyệt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReturnsApproval;

