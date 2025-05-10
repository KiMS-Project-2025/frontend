// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/userPanel/dashboard/Dashboard';  // Import Dashboard
import PageLayout from './components/userPanel/knowledgeBase/PageLayout';  // Import PageLayout

function App() {
  return (
    <Router>
      <Routes>
        {/* Điều hướng tới Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Điều hướng tới trang PageLayout cho mỗi tài liệu */}
        <Route path="/page-layout/:id" element={<PageLayout />} />
      </Routes>
    </Router>
  );
}

export default App;