import React, { useState } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Eye,
  Receipt,
  Truck,
  CreditCard,
  Funnel,
  CheckCircle,
  XCircle
} from 'react-bootstrap-icons';

function OrdersManagement(props) {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const onUpdateOrder = props.onUpdateOrder || context.handleUpdateOrder || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Viewing Order Details
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await onUpdateOrder(orderId, { status: newStatus });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'primary';
      case 'Shipped':
        return 'info';
      case 'Disputed':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-1">Quản Lý Đơn Hàng Toàn Hệ Thống</h4>
          <p className="text-muted small mb-0">
            Theo dõi dòng giao dịch mua bán, tiến độ vận đơn, trạng thái thanh toán quốc tế và can thiệp điều phối.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="success" className="p-2 border">
            Hoàn tất: <strong>{orders.filter((o) => o.status === 'Delivered').length}</strong>
          </Badge>
          <Badge bg="warning" text="dark" className="p-2 border">
            Đang tranh chấp: <strong>{orders.filter((o) => o.status === 'Disputed').length}</strong>
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
                  placeholder="Tìm theo Mã Đơn (VD: EBAY-ORD-9021), Tên Người Mua, Người Bán..."
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
                <option value="ALL">-- Tất cả trạng thái đơn --</option>
                <option value="Processing">Đang chuẩn bị hàng (Processing)</option>
                <option value="Shipped">Đang vận chuyển (Shipped)</option>
                <option value="Delivered">Đã giao thành công (Delivered)</option>
                <option value="Disputed">Đang bị khiếu nại (Disputed)</option>
                <option value="Cancelled">Đã hủy đơn (Cancelled)</option>
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

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Người Mua</th>
                <th>Người Bán</th>
                <th>Số Lượng Món</th>
                <th>Tổng Tiền</th>
                <th>Phương Thức TT</th>
                <th>Ngày Đặt</th>
                <th>Trạng Thái</th>
                <th className="text-end">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className={o.status === 'Disputed' ? 'table-warning-subtle' : ''}>
                    {/* Order ID */}
                    <td className="fw-bold text-primary font-monospace">{o.id}</td>

                    {/* Buyer */}
                    <td>
                      <div className="fw-semibold">{o.buyerName}</div>
                      <small className="text-muted">{o.buyerEmail}</small>
                    </td>

                    {/* Seller */}
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {o.sellerName}
                    </td>

                    {/* Items count */}
                    <td className="text-center">
                      <Badge bg="light" text="dark" className="border">
                        {o.items ? o.items.reduce((sum, item) => sum + item.quantity, 0) : 1} món
                      </Badge>
                    </td>

                    {/* Total */}
                    <td>
                      <strong className="text-dark">${o.totalAmount.toFixed(2)}</strong>
                    </td>

                    {/* Payment Method */}
                    <td>
                      <span className="d-flex align-items-center gap-1">
                        <CreditCard size={13} className="text-muted" />
                        <span>{o.paymentMethod}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="text-muted">{o.orderDate}</td>

                    {/* Status */}
                    <td>
                      <Badge bg={getStatusBadgeVariant(o.status)}>
                        {o.status}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="action-btn d-flex align-items-center gap-1 ms-auto"
                        onClick={() => handleViewDetail(o)}
                      >
                        <Eye size={13} /> Xem
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Order Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold d-flex align-items-center gap-2">
            <Receipt className="text-primary" /> Chi Tiết Đơn Hàng: {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order summary bar */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
                <div>
                  <div className="text-muted small">Ngày đặt: {selectedOrder.orderDate}</div>
                  <div className="fw-bold">Phương thức thanh toán: {selectedOrder.paymentMethod}</div>
                </div>
                <div className="text-end">
                  <div className="text-muted small">Trạng thái hiện tại:</div>
                  <Badge bg={getStatusBadgeVariant(selectedOrder.status)} className="fs-6">
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              {/* Customer & Shipping info */}
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <div className="border p-3 rounded h-100">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Người mua (Buyer)</h6>
                    <div><strong>Họ tên:</strong> {selectedOrder.buyerName}</div>
                    <div><strong>Email:</strong> {selectedOrder.buyerEmail}</div>
                    <div className="mt-2">
                      <Truck className="text-primary me-1" />
                      <strong>Địa chỉ giao nhận:</strong>
                      <div className="text-muted small">{selectedOrder.shippingAddress}</div>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border p-3 rounded h-100">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2">Người bán & Vận đơn</h6>
                    <div><strong>Cửa hàng:</strong> {selectedOrder.sellerName}</div>
                    <div className="mt-2">
                      <strong>Mã vận đơn bưu chính:</strong>
                      <div className="font-monospace text-primary fw-bold">
                        {selectedOrder.trackingNumber || 'Chưa phát sinh mã vận đơn'}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Items Table */}
              <h6 className="fw-bold small text-muted text-uppercase mb-2">Danh mục sản phẩm trong đơn</h6>
              <Table bordered hover responsive size="sm" className="mb-3">
                <thead className="table-light small">
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {selectedOrder.items &&
                    selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.title}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">${item.price.toFixed(2)}</td>
                        <td className="text-end fw-semibold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan={3} className="text-end">Phí vận chuyển:</td>
                    <td className="text-end">${selectedOrder.shippingFee.toFixed(2)}</td>
                  </tr>
                  <tr className="table-light fw-bold">
                    <td colSpan={3} className="text-end">TỔNG CỘNG:</td>
                    <td className="text-end text-success">${selectedOrder.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>

              {/* Admin status override control */}
              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold small mb-2">Can thiệp điều chỉnh trạng thái đơn (Admin Override):</h6>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-success"
                    size="sm"
                    disabled={selectedOrder.status === 'Delivered'}
                    onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                  >
                    <CheckCircle className="me-1" /> Đánh dấu Đã Giao (Delivered)
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={selectedOrder.status === 'Shipped'}
                    onClick={() => handleStatusChange(selectedOrder.id, 'Shipped')}
                  >
                    <Truck className="me-1" /> Đang Vận Chuyển (Shipped)
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={selectedOrder.status === 'Cancelled'}
                    onClick={() => handleStatusChange(selectedOrder.id, 'Cancelled')}
                  >
                    <XCircle className="me-1" /> Hủy Đơn Hàng (Cancelled)
                  </Button>
                </div>
              </div>
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

export default OrdersManagement;

