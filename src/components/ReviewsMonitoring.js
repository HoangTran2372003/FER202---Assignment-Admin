import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  StarFill,
  EyeSlash,
  Eye,
  ExclamationTriangle,
  ChatQuote,
  ShieldExclamation,
  Funnel
} from 'react-bootstrap-icons';

function ReviewsMonitoring(props) {
  const context = useOutletContext() || {};
  const reviews = props.reviews || context.reviews || [];
  const onUpdateReview = props.onUpdateReview || context.handleUpdateReview || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Moderation
  const [showModerateModal, setShowModerateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [flagReason, setFlagReason] = useState('');

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'ALL' || r.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleOpenModerate = (review) => {
    setSelectedReview(review);
    setFlagReason(review.flagReason || 'Bình luận chứa từ ngữ thô tục, xúc phạm hoặc vu khống người bán.');
    setShowModerateModal(true);
  };

  const handleConfirmHide = async () => {
    if (!selectedReview) return;
    await onUpdateReview(selectedReview.id, {
      status: 'hidden_toxic',
      isToxic: true,
      flagReason: flagReason
    });
    setShowModerateModal(false);
  };

  const handleRestoreReview = async (review) => {
    await onUpdateReview(review.id, {
      status: 'visible',
      isToxic: false,
      flagReason: null
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarFill
        key={i}
        size={13}
        className={i < rating ? 'text-warning' : 'text-secondary-subtle'}
      />
    ));
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Giám Sát Hệ Thống Đánh Giá & Phản Hồi</h4>
          <p className="text-muted small mb-0">
            Kiểm duyệt bình luận từ người mua (Buyer Reviews & Seller Feedback), ngăn chặn ngôn từ kích động, độc hại và bảo vệ uy tín người bán chân chính.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="danger" className="p-2 border">
            Độc hại / Đã ẩn: <strong>{reviews.filter((r) => r.status === 'hidden_toxic').length}</strong>
          </Badge>
          <Badge bg="success" className="p-2 border">
            Hợp lệ: <strong>{reviews.filter((r) => r.status === 'visible').length}</strong>
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
                  placeholder="Tìm theo Tên Sản Phẩm, Người Mua, Người Bán, Nội dung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả số sao đánh giá --</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                <option value="3">⭐⭐⭐ (3 sao)</option>
                <option value="2">⭐⭐ (2 sao)</option>
                <option value="1">⭐ (1 sao - Tiêu cực)</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả trạng thái --</option>
                <option value="visible">Đang hiển thị công khai</option>
                <option value="hidden_toxic">Đã ẩn do vi phạm (Toxic)</option>
              </Form.Select>
            </Col>
            <Col md={1} className="d-grid">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setRatingFilter('ALL');
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

      {/* Reviews Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '120px' }}>Số Sao</th>
                <th>Sản phẩm & Người bán</th>
                <th>Người đánh giá</th>
                <th>Nội dung bình luận (Feedback)</th>
                <th>Ngày đăng</th>
                <th>Trạng thái</th>
                <th className="text-end">Kiểm duyệt</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Không tìm thấy đánh giá nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className={r.status === 'hidden_toxic' ? 'table-warning-subtle' : ''}>
                    {/* Rating stars */}
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(r.rating)}
                      </div>
                      <small className="text-muted">({r.rating}.0 / 5)</small>
                    </td>

                    {/* Product & Seller */}
                    <td>
                      <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }} title={r.productTitle}>
                        {r.productTitle}
                      </div>
                      <small className="text-muted">Bán bởi: <strong>{r.sellerName}</strong></small>
                    </td>

                    {/* Buyer */}
                    <td>
                      <div className="fw-bold">{r.buyerName}</div>
                      <small className="text-muted">Mã: {r.id}</small>
                    </td>

                    {/* Comment */}
                    <td>
                      <div className="p-2 rounded bg-light border small" style={{ maxWidth: '350px' }}>
                        <ChatQuote className="me-1 text-muted" />
                        <span className={r.status === 'hidden_toxic' ? 'text-decoration-line-through text-muted' : ''}>
                          {r.comment}
                        </span>
                      </div>
                      {r.flagReason && (
                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                          <ExclamationTriangle size={12} /> {r.flagReason}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="text-muted">{r.date}</td>

                    {/* Status */}
                    <td>
                      {r.status === 'visible' ? (
                        <Badge bg="success">Công khai</Badge>
                      ) : (
                        <Badge bg="danger">Đã ẩn (Độc hại)</Badge>
                      )}
                    </td>

                    {/* Moderation Actions */}
                    <td className="text-end">
                      {r.status === 'visible' ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-btn d-flex align-items-center gap-1 ms-auto"
                          onClick={() => handleOpenModerate(r)}
                          title="Ẩn đánh giá độc hại vi phạm tiêu chuẩn cộng đồng"
                        >
                          <EyeSlash size={13} /> Ẩn bình luận
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="action-btn d-flex align-items-center gap-1 ms-auto"
                          onClick={() => handleRestoreReview(r)}
                          title="Khôi phục lại đánh giá"
                        >
                          <Eye size={13} /> Khôi phục
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Moderate Toxic Review Modal */}
      <Modal show={showModerateModal} onHide={() => setShowModerateModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="h6 d-flex align-items-center gap-2">
            <ShieldExclamation size={18} /> Kiểm Duyệt & Ẩn Đánh Giá Độc Hại
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <div>
              <Alert variant="warning" className="small py-2 mb-3">
                Đánh giá này sẽ bị ẩn khỏi trang sản phẩm eBay Clone công khai nhằm ngăn chặn quấy rối hoặc bôi nhọ uy tín người bán.
              </Alert>

              <div className="p-3 bg-light rounded border mb-3">
                <div className="fw-bold small mb-1">{selectedReview.buyerName} viết:</div>
                <div className="font-italic text-danger small">"{selectedReview.comment}"</div>
                <div className="text-muted small mt-2">Dành cho sản phẩm: {selectedReview.productTitle}</div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Lý do ẩn vi phạm (ghi vào báo cáo):</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Nhập lý do ẩn bình luận..."
                  required
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModerateModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmHide}>
            Xác nhận Ẩn đánh giá
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewsMonitoring;

