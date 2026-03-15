import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaFilm, 
  FaHome, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaMoon, 
  FaSun, 
  FaPhone, 
  FaEnvelope,
  FaComments
} from 'react-icons/fa';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <FaFilm className="me-2" />
            CGV Cinemas
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/')}`} to="/">
                  <FaHome className="me-1" />
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/movies')}`} to="/movies">
                  <FaFilm className="me-1" />
                  Phim
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/theater')}`} to="/theater">
                  <FaMapMarkerAlt className="me-1" />
                  Rạp chiếu
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/contact')}`} to="/contact">
                  <FaComments className="me-1" />
                  Liên hệ
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/tickets')}`} to="/tickets">
                    <FaTicketAlt className="me-1" />
                    Lịch sử vé
                  </Link>
                </li>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              {/* Theme Toggle */}
              <button 
                className="btn btn-outline-light me-2" 
                onClick={toggleTheme}
                title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
              
              {/* User Menu */}
              {user ? (
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    <FaUserCircle className="me-1" />
                    {user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/tickets">
                        <FaTicketAlt className="me-2" />
                        Lịch sử vé
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" />
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/auth" className="btn btn-outline-light">
                  <FaSignInAlt className="me-1" />
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold">
                <FaFilm className="me-2" />
                CGV Cinemas
              </h5>
              <p className="small">
                Hệ thống rạp chiếu phim hiện đại, mang đến trải nghiệm điện ảnh tuyệt vời nhất.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Liên kết nhanh</h6>
              <ul className="list-unstyled small">
                <li><Link to="/" className="text-white text-decoration-none">Trang chủ</Link></li>
                <li><Link to="/movies" className="text-white text-decoration-none">Phim</Link></li>
                <li><Link to="/theater" className="text-white text-decoration-none">Rạp chiếu</Link></li>
                <li><Link to="/contact" className="text-white text-decoration-none">Liên hệ</Link></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Liên hệ</h6>
              <ul className="list-unstyled small">
                <li><FaPhone className="me-2" />1900 6017</li>
                <li><FaEnvelope className="me-2" />info@cgv.vn</li>
                <li><FaMapMarkerAlt className="me-2" />Quận 1, TP. HCM</li>
              </ul>
            </div>
          </div>
          <hr className="bg-white" />
          <div className="text-center small">
            <p className="mb-0">&copy; 2026 CGV Cinemas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;