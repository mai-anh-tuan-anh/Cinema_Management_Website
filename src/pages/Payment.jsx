import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { movies } from '../data/movies';
import {
    FaArrowLeft,
    FaCreditCard,
    FaUniversity,
    FaMobileAlt,
    FaMoneyBillWave,
    FaReceipt,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
    const { id, date, showtimeId, seats } = useParams();
    const navigate = useNavigate();

    const movie = movies.find((m) => m.id === parseInt(id));
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [isProcessing, setIsProcessing] = useState(false);

    // Parse seats from URL
    const selectedSeats = seats ? seats.split(',') : [];
    const totalPrice = selectedSeats.length * (movie?.price || 0);

    // Find showtime details
    const showtimes = [
        { id: 1, time: '09:00', room: 'Phòng 1' },
        { id: 2, time: '12:30', room: 'Phòng 2' },
        { id: 3, time: '15:00', room: 'Phòng 1' },
        { id: 4, time: '18:30', room: 'Phòng 3' },
        { id: 5, time: '21:00', room: 'Phòng 2' }
    ];
    const selectedShowtime = showtimes.find(
        (s) => s.id === parseInt(showtimeId)
    );

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Save booked seats
            const key = `booked_${movie.id}_${date}_${showtimeId}`;
            const currentBooked = JSON.parse(localStorage.getItem(key) || '[]');
            const updatedBooked = [...currentBooked, ...selectedSeats];
            localStorage.setItem(key, JSON.stringify(updatedBooked));

            // Create ticket
            const ticket = {
                id: Date.now(),
                movieId: movie.id,
                movieTitle: movie.title,
                poster: movie.poster,
                date: date,
                showtime: selectedShowtime.time,
                room: selectedShowtime.room,
                seats: selectedSeats.sort(),
                price: movie.price,
                totalPrice: totalPrice,
                bookingDate: new Date().toISOString()
            };

            // Get user from localStorage and add ticket
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.tickets) {
                user.tickets.push(ticket);
            } else {
                user.tickets = [ticket];
            }
            localStorage.setItem('user', JSON.stringify(user));

            setIsProcessing(false);
            toast.success('Thanh toán thành công! Đang chuyển hướng...');

            // Redirect to tickets after delay
            setTimeout(() => {
                navigate('/tickets');
            }, 2000);
        }, 2000);
    };

    if (!movie) {
        return (
            <div className='container my-5'>
                <div className='alert alert-danger'>Không tìm thấy phim</div>
            </div>
        );
    }

    return (
        <div className='container my-5'>
            <div className='row'>
                <div className='col-md-8 mx-auto'>
                    {/* Header */}
                    <div className='d-flex align-items-center mb-4'>
                        <button
                            className='btn btn-outline-secondary me-3'
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft className='me-2' />
                            Quay lại
                        </button>
                        <h2 className='mb-0'>
                            <FaReceipt className='me-2' />
                            Thanh toán
                        </h2>
                    </div>

                    {/* Order Summary */}
                    <div className='card mb-4'>
                        <div className='card-header bg-primary text-white'>
                            <h5 className='mb-0'>Chi tiết đơn hàng</h5>
                        </div>
                        <div className='card-body'>
                            <div className='row mb-3'>
                                <div className='col-md-4'>
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className='img-fluid rounded'
                                        style={{
                                            maxHeight: '200px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div className='col-md-8'>
                                    <h5 className='text-primary'>
                                        {movie.title}
                                    </h5>
                                    <div className='row mt-3'>
                                        <div className='col-6'>
                                            <p className='mb-1'>
                                                <strong>Ngày chiếu:</strong>
                                            </p>
                                            <p className='mb-1'>
                                                <strong>Suất chiếu:</strong>
                                            </p>
                                            <p className='mb-1'>
                                                <strong>Phòng chiếu:</strong>
                                            </p>
                                            <p className='mb-1'>
                                                <strong>Ghế ngồi:</strong>
                                            </p>
                                            <p className='mb-0'>
                                                <strong>Số lượng:</strong>
                                            </p>
                                        </div>
                                        <div className='col-6 text-end'>
                                            <p className='mb-1'>{date}</p>
                                            <p className='mb-1'>
                                                {selectedShowtime?.time}
                                            </p>
                                            <p className='mb-1'>
                                                {selectedShowtime?.room}
                                            </p>
                                            <p className='mb-1'>
                                                {selectedSeats.join(', ')}
                                            </p>
                                            <p className='mb-0'>
                                                {selectedSeats.length} ghế
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-6'>
                                    <h5>Đơn giá:</h5>
                                </div>
                                <div className='col-6 text-end'>
                                    <h5>
                                        {movie.price.toLocaleString('vi-VN')}đ
                                    </h5>
                                </div>
                                <div className='col-6'>
                                    <h5>Số lượng:</h5>
                                </div>
                                <div className='col-6 text-end'>
                                    <h5>x {selectedSeats.length}</h5>
                                </div>
                                <div className='col-12'>
                                    <hr />
                                </div>
                                <div className='col-6'>
                                    <h4 className='text-success'>Tổng cộng:</h4>
                                </div>
                                <div className='col-6 text-end'>
                                    <h4 className='text-success'>
                                        {totalPrice.toLocaleString('vi-VN')}đ
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className='card mb-4'>
                        <div className='card-header bg-primary text-white'>
                            <h5 className='mb-0'>Phương thức thanh toán</h5>
                        </div>
                        <div className='card-body'>
                            <div className='row g-3'>
                                <div className='col-md-6'>
                                    <div
                                        className={`card h-100 cursor-pointer ${paymentMethod === 'credit' ? 'border-primary' : ''}`}
                                        style={{
                                            border:
                                                paymentMethod === 'credit'
                                                    ? '2px solid'
                                                    : '1px solid #dee2e6'
                                        }}
                                        onClick={() =>
                                            setPaymentMethod('credit')
                                        }
                                    >
                                        <div className='card-body text-center'>
                                            <FaCreditCard
                                                size={48}
                                                className='mb-3 text-primary'
                                            />
                                            <h6>Thẻ tín dụng/Ghi nợ</h6>
                                            <small className='text-muted'>
                                                Visa, Mastercard, JCB
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div
                                        className={`card h-100 cursor-pointer ${paymentMethod === 'banking' ? 'border-primary' : ''}`}
                                        style={{
                                            border:
                                                paymentMethod === 'banking'
                                                    ? '2px solid'
                                                    : '1px solid #dee2e6'
                                        }}
                                        onClick={() =>
                                            setPaymentMethod('banking')
                                        }
                                    >
                                        <div className='card-body text-center'>
                                            <FaUniversity
                                                size={48}
                                                className='mb-3 text-primary'
                                            />
                                            <h6>Chuyển khoản ngân hàng</h6>
                                            <small className='text-muted'>
                                                Internet Banking
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div
                                        className={`card h-100 cursor-pointer ${paymentMethod === 'ewallet' ? 'border-primary' : ''}`}
                                        style={{
                                            border:
                                                paymentMethod === 'ewallet'
                                                    ? '2px solid'
                                                    : '1px solid #dee2e6'
                                        }}
                                        onClick={() =>
                                            setPaymentMethod('ewallet')
                                        }
                                    >
                                        <div className='card-body text-center'>
                                            <FaMobileAlt
                                                size={48}
                                                className='mb-3 text-primary'
                                            />
                                            <h6>Ví điện tử</h6>
                                            <small className='text-muted'>
                                                MoMo, ZaloPay
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div
                                        className={`card h-100 cursor-pointer ${paymentMethod === 'cash' ? 'border-primary' : ''}`}
                                        style={{
                                            border:
                                                paymentMethod === 'cash'
                                                    ? '2px solid'
                                                    : '1px solid #dee2e6'
                                        }}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <div className='card-body text-center'>
                                            <FaMoneyBillWave
                                                size={48}
                                                className='mb-3 text-primary'
                                            />
                                            <h6>Tiền mặt</h6>
                                            <small className='text-muted'>
                                                Thanh toán tại rạp
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            {paymentMethod === 'credit' && (
                                <div className='mt-3'>
                                    <div className='alert alert-info'>
                                        <strong>
                                            Thông tin thẻ sẽ được bảo mật
                                        </strong>
                                        <br />
                                        Hệ thống sẽ chuyển bạn đến cổng thanh
                                        toán an toàn.
                                    </div>

                                    {/* Credit Card Form */}
                                    <div className='card'>
                                        <div className='card-body'>
                                            <h6 className='card-title mb-4'>
                                                <FaCreditCard className='me-2' />
                                                Thông tin thẻ
                                            </h6>

                                            <div className='row g-3'>
                                                <div className='col-12'>
                                                    <label className='form-label'>
                                                        Số thẻ
                                                    </label>
                                                    <input
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='1234 5678 9012 3456'
                                                        maxLength={19}
                                                    />
                                                    <small className='text-muted'>
                                                        Nhập số thẻ 16 chữ số
                                                    </small>
                                                </div>

                                                <div className='col-md-6'>
                                                    <label className='form-label'>
                                                        Tên chủ thẻ
                                                    </label>
                                                    <input
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='NGUYEN VAN A'
                                                    />
                                                </div>

                                                <div className='col-md-3'>
                                                    <label className='form-label'>
                                                        Ngày hết hạn
                                                    </label>
                                                    <input
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='MM/YY'
                                                        maxLength={5}
                                                    />
                                                    <small className='text-muted'>
                                                        MM/YY
                                                    </small>
                                                </div>

                                                <div className='col-md-3'>
                                                    <label className='form-label'>
                                                        CVV
                                                    </label>
                                                    <input
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='123'
                                                        maxLength={3}
                                                    />
                                                    <small className='text-muted'>
                                                        3 số ở mặt sau
                                                    </small>
                                                </div>

                                                <div className='col-12'>
                                                    <div className='form-check'>
                                                        <input
                                                            className='form-check-input'
                                                            type='checkbox'
                                                            id='saveCard'
                                                        />
                                                        <label
                                                            className='form-check-label'
                                                            htmlFor='saveCard'
                                                        >
                                                            Lưu thông tin thẻ
                                                            cho lần sau
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'banking' && (
                                <div className='mt-3'>
                                    <div className='alert alert-info'>
                                        <strong>Thông tin chuyển khoản:</strong>
                                        <br />
                                        Ngân hàng: Vietcombank
                                        <br />
                                        Số tài khoản: 1234567890
                                        <br />
                                        Chủ tài khoản: CGV CINEMAS
                                    </div>

                                    {/* QR Code Section */}
                                    <div className='card'>
                                        <div className='card-body text-center'>
                                            <h6 className='card-title mb-4'>
                                                <FaUniversity className='me-2' />
                                                Quét mã QR để thanh toán
                                            </h6>

                                            <div className='mb-3'>
                                                <div
                                                    className='d-inline-block p-4 border rounded'
                                                    style={{
                                                        width: '200px',
                                                        height: '200px',
                                                        backgroundColor:
                                                            '#f8f9fa',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            backgroundColor:
                                                                '#000',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        {/* QR Code Placeholder Pattern */}
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '10px',
                                                                left: '10px',
                                                                width: '30px',
                                                                height: '30px',
                                                                backgroundColor:
                                                                    '#fff'
                                                            }}
                                                        ></div>
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '10px',
                                                                right: '10px',
                                                                width: '30px',
                                                                height: '30px',
                                                                backgroundColor:
                                                                    '#fff'
                                                            }}
                                                        ></div>
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                bottom: '10px',
                                                                left: '10px',
                                                                width: '30px',
                                                                height: '30px',
                                                                backgroundColor:
                                                                    '#fff'
                                                            }}
                                                        ></div>
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform:
                                                                    'translate(-50%, -50%)',
                                                                width: '40px',
                                                                height: '40px',
                                                                backgroundColor:
                                                                    '#fff',
                                                                borderRadius:
                                                                    '50%'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='text-muted'>
                                                <small>
                                                    <strong>Số tiền:</strong>{' '}
                                                    {totalPrice.toLocaleString(
                                                        'vi-VN'
                                                    )}
                                                    đ<br />
                                                    <strong>
                                                        Nội dung:
                                                    </strong>{' '}
                                                    THANHTOAN_{movie.id}_
                                                    {Date.now()}
                                                    <br />
                                                    Vui lòng thanh toán trong
                                                    vòng 15 phút
                                                </small>
                                            </div>

                                            <div className='mt-3'>
                                                <button className='btn btn-outline-primary btn-sm'>
                                                    <FaMobileAlt className='me-2' />
                                                    Mở ứng dụng ngân hàng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'ewallet' && (
                                <div className='mt-3'>
                                    <div className='alert alert-info'>
                                        <strong>Quét mã QR:</strong>
                                        <br />
                                        Mở ứng dụng ví điện tử và quét mã để
                                        thanh toán.
                                    </div>

                                    {/* E-wallet Apps Selection */}
                                    <div className='card'>
                                        <div className='card-body'>
                                            <h6 className='card-title mb-4'>
                                                <FaMobileAlt className='me-2' />
                                                Chọn ứng dụng thanh toán
                                            </h6>

                                            <div className='row g-3'>
                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#e60024',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '20px'
                                                                }}
                                                            >
                                                                MoMo
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                MoMo
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Ví điện tử
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#0066ff',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '16px'
                                                                }}
                                                            >
                                                                ZaloPay
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                ZaloPay
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Ví điện tử
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#ff6900',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '14px'
                                                                }}
                                                            >
                                                                ShopeePay
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                ShopeePay
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Ví điện tử
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#00a651',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '16px'
                                                                }}
                                                            >
                                                                VNPay
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                VNPay
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Cổng thanh toán
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#5c2d91',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '14px'
                                                                }}
                                                            >
                                                                Moca
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                Moca
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Ví điện tử Grab
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-6'>
                                                    <div
                                                        className='card h-100 cursor-pointer text-center'
                                                        style={{
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        <div className='card-body p-3'>
                                                            <div
                                                                className='mb-2 mx-auto'
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor:
                                                                        '#00bfa5',
                                                                    borderRadius:
                                                                        '12px',
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    justifyContent:
                                                                        'center',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        '16px'
                                                                }}
                                                            >
                                                                ZaloPay
                                                            </div>
                                                            <h6 className='mb-1'>
                                                                Viettel Pay
                                                            </h6>
                                                            <small className='text-muted'>
                                                                Ví điện tử
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mt-3 text-center'>
                                                <button className='btn btn-primary'>
                                                    <FaMobileAlt className='me-2' />
                                                    Mở ứng dụng đã chọn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'cash' && (
                                <div className='alert alert-info mt-3'>
                                    <strong>Thanh toán tại quầy:</strong>
                                    <br />
                                    Vui lòng đến quầy vé trước giờ chiếu 30 phút
                                    để thanh toán.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className='d-grid'>
                        <button
                            className='btn btn-success btn-lg'
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <span className='spinner-border spinner-border-sm me-2'></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className='me-2' />
                                    Xác nhận thanh toán -{' '}
                                    {totalPrice.toLocaleString('vi-VN')}đ
                                </>
                            )}
                        </button>
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
        </div>
    );
};

export default Payment;
