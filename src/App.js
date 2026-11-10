import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import DashboardView from './components/DashboardView';
import UsersManagement from './components/UsersManagement';
import ProductsManagement from './components/ProductsManagement';
import OrdersManagement from './components/OrdersManagement';
import StatisticsAnalytics from './components/StatisticsAnalytics';
import ReviewsMonitoring from './components/ReviewsMonitoring';
import DisputesManagement from './components/DisputesManagement';
import ReturnsApproval from './components/ReturnsApproval';
import BroadcastSystem from './components/BroadcastSystem';
import SecurityAuditLog from './components/SecurityAuditLog';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout wrapper */}
        <Route path="/" element={<MainScreen />}>
          {/* Default redirect to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Nhóm 3: Các route chức năng của Quản Trị Viên */}
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="statistics" element={<StatisticsAnalytics />} />
          <Route path="reviews" element={<ReviewsMonitoring />} />
          <Route path="disputes" element={<DisputesManagement />} />
          <Route path="returns" element={<ReturnsApproval />} />
          <Route path="broadcasts" element={<BroadcastSystem />} />
          <Route path="security" element={<SecurityAuditLog />} />

          {/* Wildcard fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
