import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { 
  FaFilm, 
  FaExclamationTriangle, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaSignInAlt, 
  FaUserPlus, 
  FaInfoCircle 
} from 'react-icons/fa';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        login(formData.email, formData.password);
        navigate('/');
      } else {
        // Register
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          return;
        }
        if (formData.password.length < 6) {
          setError('Mật khẩu phải có ít nhất 6 ký tự');
          return;
        }
        register(formData.username, formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <FaFilm style={{ fontSize: '3rem', color: '#0d6efd' }} />
                <h2 className="mt-3">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
                <p className="text-muted">
                  {isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới'}
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <FaUser className="me-2" />
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nhập tên đăng nhập"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope className="me-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <FaLock className="me-2" />
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock className="me-2" />
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      required={!isLogin}
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 btn-lg mt-3">
                  {isLogin ? <FaSignInAlt className="me-2" /> : <FaUserPlus className="me-2" />}
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  <button 
                    className="btn btn-link text-decoration-none" 
                    onClick={toggleMode}
                  >
                    {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Demo Account Info */}
          <div className="alert alert-info mt-3">
            <FaInfoCircle className="me-2" />
            <strong>Lưu ý:</strong> Đây là demo sử dụng localStorage. Dữ liệu chỉ được lưu trên trình duyệt của bạn.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;