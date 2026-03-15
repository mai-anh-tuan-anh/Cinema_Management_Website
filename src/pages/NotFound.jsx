import React from 'react';
import { Link } from 'react-router';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <FaExclamationTriangle className="text-warning" style={{ fontSize: '5rem' }} />
          <h1 className="display-1 fw-bold mt-3">404</h1>
          <h2 className="mb-3">Không Tìm Thấy Trang</h2>
          <p className="text-muted mb-4">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome className="me-2" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;