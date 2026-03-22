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
    FaInfoCircle,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import img from '../assets/images/bg.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                    toast.error('Vui lòng điền đầy đủ thông tin');
                    return;
                }
                login(formData.email, formData.password);
                toast.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                // Register
                if (
                    !formData.username ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword
                ) {
                    toast.error('Vui lòng điền đầy đủ thông tin');
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Mật khẩu xác nhận không khớp');
                    return;
                }
                if (formData.password.length < 6) {
                    toast.error('Mật khẩu phải có ít nhất 6 ký tự');
                    return;
                }
                register(formData.username, formData.email, formData.password);
                toast.success('Đăng ký thành công!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.message);
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
        <>
            <div
                className='container-fluid'
                style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '120vh',
                    width: '100vw',
                    margin: 0,
                    padding: 0,
                    position: 'relative'
                }}
            >
                <div
                    className='row justify-content-center align-items-center'
                    style={{ padding: '2rem 0', minHeight: '100vh' }}
                >
                    <div className='col-md-6 col-lg-5'>
                        <div className='card shadow'>
                            <div className='card-body p-5'>
                                <div className='text-center mb-4'>
                                    <FaFilm
                                        style={{
                                            fontSize: '3rem',
                                            color: '#0d6efd'
                                        }}
                                    />
                                    <h2 className='mt-3 text-light'>
                                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                                    </h2>
                                    <p className='text-light'>
                                        {isLogin
                                            ? 'Chào mừng bạn quay trở lại!'
                                            : 'Tạo tài khoản mới'}
                                    </p>
                                </div>

                                {error && (
                                    <div
                                        className='alert alert-danger'
                                        role='alert'
                                    >
                                        <FaExclamationTriangle className='me-2' />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {!isLogin && (
                                        <div className='mb-3'>
                                            <label
                                                htmlFor='username'
                                                className='form-label'
                                            >
                                                <FaUser className='me-2' />
                                                Tên đăng nhập
                                            </label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='username'
                                                name='username'
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder='Nhập tên đăng nhập'
                                                required={!isLogin}
                                            />
                                        </div>
                                    )}

                                    <div className='mb-3'>
                                        <label
                                            htmlFor='email'
                                            className='form-label'
                                        >
                                            <FaEnvelope className='me-2' />
                                            Email
                                        </label>
                                        <input
                                            type='email'
                                            className='form-control'
                                            id='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder='Nhập email của bạn'
                                            required
                                        />
                                    </div>

                                    <div className='mb-3 position-relative'>
                                        <label
                                            htmlFor='password'
                                            className='form-label'
                                        >
                                            <FaLock className='me-2' />
                                            Mật khẩu
                                        </label>
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            className='form-control pe-5'
                                            id='password'
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder='Nhập mật khẩu'
                                            required
                                        />
                                        <button
                                            type='button'
                                            className='btn btn-link position-absolute end-0 bottom-0  border-0 bg-transparent text-muted'
                                            style={{
                                                right: '10px',
                                                top: '35px'
                                            }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                    </div>

                                    {!isLogin && (
                                        <div className='mb-3 position-relative'>
                                            <label
                                                htmlFor='confirmPassword'
                                                className='form-label'
                                            >
                                                <FaLock className='me-2' />
                                                Xác nhận mật khẩu
                                            </label>
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className='form-control pe-5'
                                                id='confirmPassword'
                                                name='confirmPassword'
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder='Nhập lại mật khẩu'
                                                required={!isLogin}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-link position-absolute end-0 bottom-0 border-0 bg-transparent text-muted'
                                                style={{
                                                    right: '10px',
                                                    top: '35px'
                                                }}
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        type='submit'
                                        className='btn btn-primary w-100 btn-lg mt-3'
                                    >
                                        {isLogin ? (
                                            <FaSignInAlt className='me-2' />
                                        ) : (
                                            <FaUserPlus className='me-2' />
                                        )}
                                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                                    </button>
                                </form>

                                <hr className='my-4' />

                                <div className='text-center'>
                                    <p className='mb-0'>
                                        {isLogin
                                            ? 'Chưa có tài khoản?'
                                            : 'Đã có tài khoản?'}
                                        <button
                                            className='btn btn-link text-decoration-none'
                                            onClick={toggleMode}
                                        >
                                            {isLogin
                                                ? 'Đăng ký ngay'
                                                : 'Đăng nhập'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Demo Account Info */}
                        <div
                            className='alert alert-info mt-3'
                            style={{ color: '#0d6efd' }}
                        >
                            <FaInfoCircle className='me-2' />
                            <strong>Lưu ý:</strong> Đây là demo sử dụng
                            localStorage. Dữ liệu chỉ được lưu trên trình duyệt
                            của bạn.
                            <br />
                            Tài khoản admin: <code>admin@cinema.vn</code>
                            <br /> Mật khẩu: <code>admin123</code>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
        </>
    );
};

export default Auth;
