import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col, Alert } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  EyeSlash,
  Eye,
  Trash,
  ExclamationOctagon,
  ShieldExclamation,
  Shop,
  Tag,
  Funnel
} from 'react-bootstrap-icons';

function ProductsManagement(props) {
  const context = useOutletContext() || {};
  const products = props.products || context.products || [];
  const onUpdateProduct = props.onUpdateProduct || context.handleUpdateProduct || (() => {});
  const onDeleteProduct = props.onDeleteProduct || context.handleDeleteProduct || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State for Deleting Product
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');

  // Modal State for Viewing Violation Details
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [selectedProductViolation, setSelectedProductViolation] = useState(null);

  // Extract unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleHide = async (product) => {
    const newStatus = product.status === 'hidden' ? 'active' : 'hidden';
    await onUpdateProduct(product.id, { status: newStatus });
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProductToDelete(product);
    setDeleteReason(product.violationReason || 'Sản phẩm vi phạm bản quyền / hàng cấm bán.');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductToDelete) return;
    await onDeleteProduct(selectedProductToDelete.id, deleteReason);
    setShowDeleteModal(false);
  };

  const handleViewViolation = (product) => {
    setSelectedProductViolation(product);
    setShowViolationModal(true);
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Quản Lý Sản Phẩm Toàn Sàn</h4>
          <p className="text-muted small mb-0">
            Giám sát niêm yết, phát hiện hàng giả, hàng vi phạm bản quyền, thực hiện ẩn hoặc xóa vĩnh viễn sản phẩm vi phạm.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="danger" className="p-2 border">
            Vi phạm bản quyền: <strong>{products.filter((p) => p.status === 'flagged_violation').length}</strong>
          </Badge>
          <Badge bg="secondary" className="p-2 border">
            Đang bị ẩn: <strong>{products.filter((p) => p.status === 'hidden').length}</strong>
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
                  placeholder="Tìm sản phẩm theo Tên, Mã PRD, Người bán..."
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
                <option value="flagged_violation">Cảnh báo vi phạm (Flagged)</option>
                <option value="hidden">Đang bị ẩn (Hidden)</option>
                <option value="active">Đang hiển thị bình thường (Active)</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                size="sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">-- Tất cả danh mục --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={1} className="d-grid">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                }}
                title="Đặt lại bộ lọc"
              >
                <Funnel />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>Ảnh</th>
                <th>Tên sản phẩm & Mã</th>
                <th>Danh mục & Tình trạng</th>
                <th>Giá & Kho</th>
                <th>Người bán</th>
                <th>Trạng thái & Vi phạm</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className={p.status === 'flagged_violation' ? 'table-danger-subtle' : ''}>
                    {/* Image */}
                    <td>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="rounded border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      />
                    </td>

                    {/* Title */}
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '280px' }} title={p.title}>
                        {p.title}
                      </div>
                      <small className="text-muted font-monospace">{p.id}</small>
                    </td>

                    {/* Category & Condition */}
                    <td>
                      <Badge bg="light" text="dark" className="border me-1">
                        <Tag size={10} className="me-1" />
                        {p.category}
                      </Badge>
                      <Badge bg="secondary-subtle" text="secondary" style={{ fontSize: '0.7rem' }}>
                        {p.condition}
                      </Badge>
                    </td>

                    {/* Price & Stock */}
                    <td>
                      <div className="fw-bold text-dark">${p.price.toFixed(2)}</div>
                      <small className="text-muted">Kho: {p.stock} cái | {p.bids} lượt đấu</small>
                    </td>

                    {/* Seller */}
                    <td>
                      <div className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '160px' }}>
                        <Shop size={12} className="text-muted" />
                        <span>{p.sellerName}</span>
                      </div>
                    </td>

                    {/* Status & Violation info */}
                    <td>
                      {p.status === 'active' && <Badge bg="success">Đang hiển thị</Badge>}
                      {p.status === 'hidden' && <Badge bg="secondary">Đã bị ẩn</Badge>}
                      {p.status === 'flagged_violation' && (
                        <div>
                          <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                            <ExclamationOctagon size={12} /> Vi phạm ({p.reportCount} report)
                          </Badge>
                          <Button
                            variant="link"
                            className="p-0 text-danger small text-decoration-none mt-1 d-block"
                            onClick={() => handleViewViolation(p)}
                          >
                            Xem chi tiết vi phạm
                          </Button>
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {/* Ẩn / Bỏ ẩn */}
                        <Button
                          variant={p.status === 'hidden' ? 'outline-success' : 'outline-warning'}
                          size="sm"
                          className="action-btn"
                          onClick={() => handleToggleHide(p)}
                          title={p.status === 'hidden' ? 'Bỏ ẩn sản phẩm' : 'Tạm ẩn sản phẩm này'}
                        >
                          {p.status === 'hidden' ? <Eye /> : <EyeSlash />}
                        </Button>

                        {/* Xóa vĩnh viễn vi phạm */}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleOpenDeleteModal(p)}
                          title="Xóa vĩnh viễn sản phẩm vi phạm"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title className="h6 d-flex align-items-center gap-2">
            <Trash size={18} /> Xác Nhận Xóa Sản Phẩm Vi Phạm Vĩnh Viễn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProductToDelete && (
            <div>
              <Alert variant="danger" className="small py-2 mb-3">
                <ShieldExclamation className="me-1" /> Hành động này sẽ gỡ hoàn toàn sản phẩm khỏi hệ thống sàn eBay Clone và lưu vào <strong>Nhật Ký An Ninh (Audit Log)</strong>.
              </Alert>

              <div className="d-flex gap-3 align-items-center p-2 bg-light rounded mb-3">
                <img
                  src={selectedProductToDelete.image}
                  alt={selectedProductToDelete.title}
                  className="rounded border"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-bold small">{selectedProductToDelete.title}</div>
                  <div className="text-muted small">Người bán: {selectedProductToDelete.sellerName}</div>
                  <div className="text-danger fw-bold small">${selectedProductToDelete.price}</div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Lý do xóa vi phạm (ghi vào biên bản audit):</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Nhập lý do xóa sản phẩm vi phạm..."
                  required
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Xóa vĩnh viễn ngay
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Violation Details Modal */}
      <Modal show={showViolationModal} onHide={() => setShowViolationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold text-danger d-flex align-items-center gap-2">
            <ExclamationOctagon /> Chi Tiết Cảnh Báo Vi Phạm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProductViolation && (
            <div>
              <div className="text-center mb-3">
                <img
                  src={selectedProductViolation.image}
                  alt={selectedProductViolation.title}
                  className="rounded border"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h6 className="fw-bold mt-2 mb-1">{selectedProductViolation.title}</h6>
                <div className="text-muted small">Mã: {selectedProductViolation.id} | Người bán: {selectedProductViolation.sellerName}</div>
              </div>

              <div className="p-3 bg-danger-subtle border border-danger-subtle rounded mb-3">
                <div className="fw-bold text-danger mb-1">Nội dung vi phạm được ghi nhận:</div>
                <p className="small mb-2">{selectedProductViolation.violationReason}</p>
                <div className="d-flex justify-content-between small text-danger fw-semibold">
                  <span>Số lượt người mua báo cáo:</span>
                  <span>{selectedProductViolation.reportCount} lượt report</span>
                </div>
              </div>

              <div className="small text-muted">
                Admin có quyền tạm ẩn sản phẩm hoặc xóa vĩnh viễn nếu người bán không giải trình được nguồn gốc hàng hóa trong vòng 24h.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowViolationModal(false)}>
            Đóng
          </Button>
          {selectedProductViolation && selectedProductViolation.status !== 'hidden' && (
            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                handleToggleHide(selectedProductViolation);
                setShowViolationModal(false);
              }}
            >
              Tạm ẩn sản phẩm này
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductsManagement;

