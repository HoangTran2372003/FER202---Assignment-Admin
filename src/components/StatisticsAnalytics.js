import React, { useState } from 'react';
import { Card, Row, Col, Button, ButtonGroup, Table, ProgressBar, Badge } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import {
  CurrencyDollar,
  Receipt,
  People,
  ArrowUpRight,
  PieChart,
  Download,
  Calendar3,
  Award
} from 'react-bootstrap-icons';

function StatisticsAnalytics(props) {
  const context = useOutletContext() || {};
  const statistics = props.statistics || context.statistics;
  const [timeframe, setTimeframe] = useState('monthly'); // 'daily' | 'monthly' | 'quarterly'

  const currentData =
    timeframe === 'daily'
      ? statistics.daily
      : timeframe === 'monthly'
      ? statistics.monthly
      : statistics.quarterly;

  // Max values for chart scaling
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue));
  const maxOrders = Math.max(...currentData.map((d) => d.orders));

  const totalPeriodRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodOrders = currentData.reduce((sum, d) => sum + d.orders, 0);
  const totalPeriodUsers = currentData.reduce((sum, d) => sum + d.newUsers, 0);
  const avgOrderValue = totalPeriodOrders > 0 ? totalPeriodRevenue / totalPeriodOrders : 0;

  const handleExportReport = () => {
    alert(`Đã xuất báo cáo thống kê ${timeframe.toUpperCase()} thành công dạng bảng dữ liệu mẫu!`);
  };

  return (
    <div>
      {/* Title & Timeframe Selector */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1">Thống Kê Báo Cáo Hiệu Suất Hệ Thống</h4>
          <p className="text-muted small mb-0">
            Theo dõi chi tiết doanh thu, khối lượng đơn hàng và tăng trưởng người dùng theo ngày, tháng, quý.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <ButtonGroup size="sm">
            <Button
              variant={timeframe === 'daily' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('daily')}
            >
              Theo Ngày
            </Button>
            <Button
              variant={timeframe === 'monthly' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('monthly')}
            >
              Theo Tháng
            </Button>
            <Button
              variant={timeframe === 'quarterly' ? 'primary' : 'outline-primary'}
              onClick={() => setTimeframe('quarterly')}
            >
              Theo Quý
            </Button>
          </ButtonGroup>

          <Button variant="outline-secondary" size="sm" onClick={handleExportReport}>
            <Download className="me-1" /> Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                <span>Tổng Doanh Thu ({timeframe === 'daily' ? '8 Ngày qua' : timeframe === 'monthly' ? '7 Tháng' : '4 Quý'})</span>
                <CurrencyDollar className="text-success fs-5" />
              </div>
              <h4 className="fw-bold text-success mb-1">
                ${totalPeriodRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </h4>
              <div className="text-success small d-flex align-items-center gap-1">
                <ArrowUpRight /> +18.4% tăng trưởng
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                <span>Tổng Số Đơn Hàng</span>
                <Receipt className="text-primary fs-5" />
              </div>
              <h4 className="fw-bold text-dark mb-1">{totalPeriodOrders.toLocaleString()} đơn</h4>
              <div className="text-primary small d-flex align-items-center gap-1">
                <ArrowUpRight /> Tỷ lệ hoàn thành 96.8%
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                <span>Người Dùng Mới</span>
                <People className="text-info fs-5" />
              </div>
              <h4 className="fw-bold text-dark mb-1">{totalPeriodUsers.toLocaleString()} tài khoản</h4>
              <div className="text-info small">Đạt mục tiêu tăng trưởng</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
                <span>Giá Trị Đơn TB (AOV)</span>
                <Award className="text-warning fs-5" />
              </div>
              <h4 className="fw-bold text-dark mb-1">${avgOrderValue.toFixed(2)}</h4>
              <div className="text-muted small">Mỗi giao dịch trung bình</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Visual Chart & Breakdown */}
      <Row className="g-3 mb-4">
        {/* Main Column Visual Chart */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Calendar3 className="text-primary" />
                Biểu Đồ Doanh Thu & Số Đơn ({timeframe === 'daily' ? 'Theo Ngày' : timeframe === 'monthly' ? 'Theo Tháng' : 'Theo Quý'})
              </h6>
              <div className="d-flex align-items-center gap-3 small">
                <span className="d-flex align-items-center gap-1">
                  <span className="badge rounded-circle bg-primary p-1"> </span> Doanh thu ($)
                </span>
                <span className="d-flex align-items-center gap-1">
                  <span className="badge rounded-circle bg-info p-1"> </span> Số đơn hàng
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Visual Bars Container */}
              <div className="d-flex align-items-end justify-content-between pt-4 pb-2" style={{ height: '240px', gap: '12px' }}>
                {currentData.map((item, index) => {
                  const revHeight = Math.max(15, Math.round((item.revenue / maxRevenue) * 180));
                  const label = item.date || item.period;
                  return (
                    <div key={index} className="d-flex flex-column align-items-center flex-grow-1 text-center" style={{ minWidth: '40px' }}>
                      <div className="small fw-semibold text-primary mb-1" style={{ fontSize: '0.72rem' }}>
                        ${item.revenue > 1000 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue}
                      </div>

                      <div className="d-flex align-items-end justify-content-center w-100" style={{ height: '180px', gap: '3px' }}>
                        {/* Revenue Bar */}
                        <div
                          className="bg-primary rounded-top"
                          style={{
                            height: `${revHeight}px`,
                            width: '50%',
                            transition: 'height 0.3s ease',
                            cursor: 'pointer'
                          }}
                          title={`Doanh thu: $${item.revenue.toLocaleString()} | Số đơn: ${item.orders}`}
                        />
                        {/* Orders Bar */}
                        <div
                          className="bg-info rounded-top"
                          style={{
                            height: `${Math.max(10, Math.round((item.orders / maxOrders) * 160))}px`,
                            width: '35%',
                            transition: 'height 0.3s ease',
                            cursor: 'pointer'
                          }}
                          title={`Số đơn hàng: ${item.orders}`}
                        />
                      </div>

                      <div className="text-muted mt-2 text-truncate w-100" style={{ fontSize: '0.72rem' }} title={label}>
                        {label.replace('Tháng ', 'T').replace(' / 2025', '').replace(' / 2026', '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Category Breakdown */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white py-3 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <PieChart className="text-warning" /> Tỷ Trọng Doanh Số Ngành Hàng
              </h6>
            </Card.Header>
            <Card.Body>
              {statistics.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">{cat.name}</span>
                    <span className="text-muted">{cat.sales} ({cat.percent}%)</span>
                  </div>
                  <ProgressBar
                    now={cat.percent}
                    variant={idx === 0 ? 'primary' : idx === 1 ? 'warning' : idx === 2 ? 'success' : 'info'}
                    style={{ height: '8px' }}
                  />
                </div>
              ))}

              <div className="mt-4 p-3 bg-light rounded small border">
                <div className="fw-bold text-dark mb-1">Đánh giá chung:</div>
                <div className="text-muted">
                  Ngành <strong>Điện thoại & Đồ công nghệ</strong> tiếp tục dẫn đầu với 36% doanh thu toàn sàn, kế tiếp là dòng hàng <strong>Đồng hồ & Đồ sưu tầm cổ</strong> (28%).
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Data Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 border-bottom">
          <h6 className="fw-bold mb-0">Bảng Dữ Liệu Chi Tiết ({timeframe === 'daily' ? 'Theo Ngày' : timeframe === 'monthly' ? 'Theo Tháng' : 'Theo Quý'})</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Mốc Thời Gian</th>
                <th className="text-end">Doanh Thu ($)</th>
                <th className="text-center">Số Lượng Đơn</th>
                <th className="text-center">Người Dùng Mới</th>
                <th className="text-end">Giá Trị TB / Đơn</th>
                <th className="text-center">Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="small">
              {currentData.map((row, idx) => {
                const aov = row.orders > 0 ? (row.revenue / row.orders).toFixed(2) : 0;
                return (
                  <tr key={idx}>
                    <td className="fw-bold">{row.date || row.period}</td>
                    <td className="text-end fw-semibold text-success">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="text-center">{row.orders} đơn</td>
                    <td className="text-center">
                      <Badge bg="info-subtle" text="info" className="border border-info-subtle">
                        +{row.newUsers}
                      </Badge>
                    </td>
                    <td className="text-end">${aov}</td>
                    <td className="text-center">
                      <Badge bg="success-subtle" text="success" className="border border-success-subtle">
                        Đạt chỉ tiêu
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default StatisticsAnalytics;

