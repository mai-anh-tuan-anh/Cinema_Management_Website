import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { movies } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import {
    initializeLocalStorage,
    getShowtimesFromStorage
} from '../utils/localStorageUtils';
import {
    FaTicketAlt,
    FaCalendarAlt,
    FaClock,
    FaThLarge,
    FaTv,
    FaReceipt,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addTicket } = useAuth();
    const movie = movies.find((m) => m.id === parseInt(id));

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [showtimes, setShowtimes] = useState([]);

    useEffect(() => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để đặt vé');
            navigate('/auth');
            return;
        }

        // Load showtimes from localStorage
        initializeLocalStorage();
        const allShowtimes = getShowtimesFromStorage();
        setShowtimes(allShowtimes);

        if (movie) {
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);

            // Load booked seats from localStorage
            loadBookedSeats(today, allShowtimes[0]?.id);
        }
    }, [movie, user, navigate]);

    // Reload booked seats when date or showtime changes
    useEffect(() => {
        if (selectedDate && selectedShowtime) {
            loadBookedSeats(selectedDate, selectedShowtime.id);
        }
    }, [selectedDate, selectedShowtime]);

    // Filter showtimes based on current time (30 minutes before showtime) and movie
    const getAvailableShowtimes = () => {
        const now = new Date();
        const today = new Date().toISOString().split('T')[0];

        // Filter showtimes for current movie only
        const movieShowtimes = showtimes.filter(
            (showtime) => showtime.movieId === movie.id
        );

        // If selected date is not today, show all showtimes for this movie
        if (selectedDate !== today) {
            return movieShowtimes;
        }

        // If selected date is today, filter out showtimes that start in less than 30 minutes
        return movieShowtimes.filter((showtime) => {
            const [hours, minutes] = showtime.time.split(':').map(Number);
            const showtimeDateTime = new Date();
            showtimeDateTime.setHours(hours, minutes, 0, 0);

            // Calculate time until showtime starts
            const timeUntilShowtime = showtimeDateTime - now;
            const thirtyMinutesInMs = 30 * 60 * 1000;

            // Only allow booking if showtime starts more than 30 minutes from now
            return timeUntilShowtime > thirtyMinutesInMs;
        });
    };

    const loadBookedSeats = (date, showtimeId) => {
        if (!movie || !date || !showtimeId) return;

        const key = `booked_${movie.id}_${date}_${showtimeId}`;
        const seats = JSON.parse(localStorage.getItem(key) || '[]');
        setBookedSeats(seats);
    };

    if (!movie) {
        return (
            <div className='container my-5'>
                <div className='alert alert-danger'>Không tìm thấy phim</div>
            </div>
        );
    }

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedSeats([]);
        if (selectedShowtime) {
            loadBookedSeats(date, selectedShowtime.id);
        }
    };

    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
        setSelectedSeats([]);
        loadBookedSeats(selectedDate, showtime.id);
    };

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return;

        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const getSeatClass = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return 'seat booked';
        if (selectedSeats.includes(seatNumber)) return 'seat selected';
        return 'seat available';
    };

    const totalPrice = selectedSeats.length * movie.price;

    const handleBooking = () => {
        if (!selectedDate) {
            toast.error('Vui lòng chọn ngày chiếu');
            return;
        }

        if (!selectedShowtime) {
            toast.error('Vui lòng chọn suất chiếu');
            return;
        }

        if (selectedSeats.length === 0) {
            toast.error('Vui lòng chọn ít nhất một ghế');
            return;
        }

        // Navigate to payment page with booking details
        const seatsParam = selectedSeats.join(',');
        navigate(
            `/payment/${movie.id}/${selectedDate}/${selectedShowtime.id}/${seatsParam}`
        );
    };

    const handlePayment = () => {
        // Close payment modal and show checkout modal
        setShowPaymentModal(false);
        setShowCheckoutModal(true);
    };

    const handleConfirmBooking = () => {
        // Save booked seats
        const key = `booked_${movie.id}_${selectedDate}_${selectedShowtime.id}`;
        const currentBooked = JSON.parse(localStorage.getItem(key) || '[]');
        const updatedBooked = [...currentBooked, ...selectedSeats];
        console.log('Saving booked seats:', key, updatedBooked);
        localStorage.setItem(key, JSON.stringify(updatedBooked));

        // Create ticket
        const ticket = {
            id: Date.now(),
            movieId: movie.id,
            movieTitle: movie.title,
            poster: movie.poster,
            date: selectedDate,
            showtime: selectedShowtime.time,
            room: selectedShowtime.room,
            seats: selectedSeats.sort(),
            price: movie.price,
            totalPrice: totalPrice,
            bookingDate: new Date().toISOString()
        };

        // Add ticket to user
        addTicket(ticket);

        // Close modal and show success
        setShowCheckoutModal(false);
        toast.success('Đặt vé thành công! Đang chuyển hướng...');

        // Redirect after delay
        setTimeout(() => {
            navigate('/tickets');
        }, 1500);
    };

    // Generate dates for next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date);
    }

    return (
        <>
            <div className='container my-5'>
                <h1 className='mb-4'>
                    <FaTicketAlt className='me-2 text-primary' />
                    Đặt Vé Xem Phim
                </h1>

                <div className='row'>
                    <div className='col-md-8'>
                        {/* Movie Info */}
                        <div className='card mb-4'>
                            <div className='row g-0'>
                                <div className='col-md-4'>
                                    <img
                                        src={movie.poster}
                                        className='img-fluid rounded-start'
                                        alt={movie.title}
                                        style={{
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                                <div className='col-md-8'>
                                    <div className='card-body'>
                                        <h5 className='card-title'>
                                            {movie.title}
                                        </h5>
                                        <p className='card-text'>
                                            <span className='badge bg-primary me-2'>
                                                {movie.genre}
                                            </span>
                                            <span className='badge bg-info'>
                                                {movie.duration} phút
                                            </span>
                                        </p>
                                        <p className='card-text'>
                                            <strong>Giá vé:</strong>{' '}
                                            <span
                                                className='text-success'
                                                style={{
                                                    fontSize: '24px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {movie.price.toLocaleString(
                                                    'vi-VN'
                                                )}
                                                đ
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaCalendarAlt className='me-2' />
                                    Chọn ngày
                                </h5>
                                <div className='d-flex flex-wrap gap-2'>
                                    {dates.map((date) => {
                                        const dateStr = date
                                            .toISOString()
                                            .split('T')[0];
                                        const displayDate =
                                            date.toLocaleDateString('vi-VN', {
                                                weekday: 'short',
                                                day: '2-digit',
                                                month: '2-digit'
                                            });
                                        return (
                                            <button
                                                key={dateStr}
                                                className={`btn ${selectedDate === dateStr ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() =>
                                                    handleDateChange(dateStr)
                                                }
                                            >
                                                {displayDate}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Showtime Selection */}
                        <div className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaClock className='me-2' />
                                    Chọn suất chiếu
                                </h5>
                                {getAvailableShowtimes().length > 0 ? (
                                    <div className='d-flex flex-wrap gap-2'>
                                        {getAvailableShowtimes().map(
                                            (showtime) => (
                                                <button
                                                    key={showtime.id}
                                                    className={`btn ${selectedShowtime?.id === showtime.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() =>
                                                        handleShowtimeSelect(
                                                            showtime
                                                        )
                                                    }
                                                >
                                                    <div>{showtime.time}</div>
                                                    <small>
                                                        {showtime.room}
                                                    </small>
                                                </button>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className='alert alert-warning'>
                                        <FaClock className='me-2' />
                                        {selectedDate ===
                                        new Date().toISOString().split('T')[0]
                                            ? 'Tất cả suất chiếu hôm nay đã qua hoặc sắp bắt đầu trong vòng 30 phút. Vui lòng chọn ngày khác.'
                                            : 'Không có suất chiếu cho ngày này.'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seat Selection */}
                        {selectedShowtime && (
                            <div className='card mb-4'>
                                <div className='card-body'>
                                    <h5 className='card-title'>
                                        <FaThLarge className='me-2' />
                                        Chọn ghế
                                    </h5>

                                    {/* Screen */}
                                    <div className='text-center mb-4'>
                                        <div
                                            className='bg-secondary text-white py-2 rounded mb-3'
                                            style={{
                                                maxWidth: '80%',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <FaTv className='me-2' />
                                            Màn hình
                                        </div>
                                    </div>

                                    {/* Seat Map */}
                                    <div className='d-flex flex-column align-items-center'>
                                        {rows.map((row) => (
                                            <div
                                                key={row}
                                                className='d-flex align-items-center mb-2'
                                            >
                                                <span
                                                    className='me-2 fw-bold'
                                                    style={{ width: '20px' }}
                                                >
                                                    {row}
                                                </span>
                                                {Array.from(
                                                    { length: seatsPerRow },
                                                    (_, i) => {
                                                        const seatNumber = `${row}${i + 1}`;
                                                        return (
                                                            <button
                                                                key={seatNumber}
                                                                className={getSeatClass(
                                                                    seatNumber
                                                                )}
                                                                onClick={() =>
                                                                    handleSeatClick(
                                                                        seatNumber
                                                                    )
                                                                }
                                                                disabled={bookedSeats.includes(
                                                                    seatNumber
                                                                )}
                                                                title={
                                                                    seatNumber
                                                                }
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className='d-flex justify-content-center gap-4 mt-4'>
                                        <div>
                                            <button
                                                className='seat available me-2'
                                                disabled
                                            ></button>
                                            <span>Ghế trống</span>
                                        </div>
                                        <div>
                                            <button
                                                className='seat selected me-2'
                                                disabled
                                            ></button>
                                            <span>Ghế đang chọn</span>
                                        </div>
                                        <div>
                                            <button
                                                className='seat booked me-2'
                                                disabled
                                            ></button>
                                            <span>Ghế đã đặt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Summary */}
                    <div className='col-md-4'>
                        <div
                            className='card sticky-top'
                            style={{ top: '20px' }}
                        >
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaReceipt className='me-2' />
                                    Thông tin đặt vé
                                </h5>
                                <hr />

                                <div className='mb-3'>
                                    <strong>Phim:</strong>
                                    <p className='mb-1'>{movie.title}</p>
                                </div>

                                {selectedDate && (
                                    <div className='mb-3'>
                                        <strong>Ngày:</strong>
                                        <p className='mb-1'>
                                            {new Date(
                                                selectedDate
                                            ).toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}

                                {selectedShowtime && (
                                    <div className='mb-3'>
                                        <strong>Suất chiếu:</strong>
                                        <p className='mb-1'>
                                            {selectedShowtime.time} -{' '}
                                            {selectedShowtime.room}
                                        </p>
                                    </div>
                                )}

                                {selectedSeats.length > 0 && (
                                    <div className='mb-3'>
                                        <strong>Ghế đã chọn:</strong>
                                        <p className='mb-1'>
                                            {selectedSeats.sort().join(', ')}
                                        </p>
                                        <strong>Số lượng:</strong>{' '}
                                        {selectedSeats.length} ghế
                                    </div>
                                )}

                                <hr />

                                <div className='mb-3'>
                                    <div className='d-flex justify-content-between'>
                                        <strong>Giá vé:</strong>
                                        <span>
                                            {movie.price.toLocaleString(
                                                'vi-VN'
                                            )}
                                            đ
                                        </span>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <strong>Số lượng:</strong>
                                        <span>x {selectedSeats.length}</span>
                                    </div>
                                </div>

                                <hr />

                                <div className='d-flex justify-content-between mb-3'>
                                    <h5>Tổng tiền:</h5>
                                    <h5 className='text-success'>
                                        {totalPrice.toLocaleString('vi-VN')}đ
                                    </h5>
                                </div>

                                <button
                                    className='btn btn-success w-100 btn-lg'
                                    onClick={handleBooking}
                                    disabled={
                                        !selectedShowtime ||
                                        selectedSeats.length === 0
                                    }
                                >
                                    <FaCheckCircle className='me-2' />
                                    Thanh Toán
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div
                    className='modal show d-block'
                    tabIndex='-1'
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    <FaReceipt className='me-2' />
                                    Thanh toán
                                </h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => setShowPaymentModal(false)}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                <div className='mb-4'>
                                    <h6 className='text-primary mb-3'>
                                        {movie.title}
                                    </h6>
                                    <div className='bg-light p-3 rounded mb-3'>
                                        <p className='mb-1'>
                                            <strong>Ngày:</strong>{' '}
                                            {selectedDate}
                                        </p>
                                        <p className='mb-1'>
                                            <strong>Suất:</strong>{' '}
                                            {selectedShowtime?.time} -{' '}
                                            {selectedShowtime?.room}
                                        </p>
                                        <p className='mb-1'>
                                            <strong>Ghế:</strong>{' '}
                                            {selectedSeats.sort().join(', ')}
                                        </p>
                                        <p className='mb-0'>
                                            <strong>Số lượng:</strong>{' '}
                                            {selectedSeats.length} ghế
                                        </p>
                                    </div>
                                    <div className='text-end'>
                                        <h4 className='text-success'>
                                            Tổng cộng:{' '}
                                            {totalPrice.toLocaleString('vi-VN')}
                                            đ
                                        </h4>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label fw-bold'>
                                        Phương thức thanh toán:
                                    </label>
                                    <div className='d-grid gap-2'>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentMethod'
                                                id='credit'
                                                value='credit'
                                                checked={
                                                    paymentMethod === 'credit'
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='credit'
                                            >
                                                <strong>
                                                    💳 Thẻ tín dụng/Ghi nợ
                                                </strong>
                                                <div className='text-muted small'>
                                                    Visa, Mastercard, JCB
                                                </div>
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentMethod'
                                                id='banking'
                                                value='banking'
                                                checked={
                                                    paymentMethod === 'banking'
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='banking'
                                            >
                                                <strong>
                                                    🏦 Chuyển khoản ngân hàng
                                                </strong>
                                                <div className='text-muted small'>
                                                    Internet Banking, Mobile
                                                    Banking
                                                </div>
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentMethod'
                                                id='ewallet'
                                                value='ewallet'
                                                checked={
                                                    paymentMethod === 'ewallet'
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='ewallet'
                                            >
                                                <strong>📱 Ví điện tử</strong>
                                                <div className='text-muted small'>
                                                    MoMo, ZaloPay, ShopeePay
                                                </div>
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentMethod'
                                                id='cash'
                                                value='cash'
                                                checked={
                                                    paymentMethod === 'cash'
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='cash'
                                            >
                                                <strong>💵 Tiền mặt</strong>
                                                <div className='text-muted small'>
                                                    Thanh toán tại rạp
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'credit' && (
                                    <div className='alert alert-info'>
                                        <small>
                                            <strong>
                                                Thông tin thẻ sẽ được bảo mật
                                            </strong>
                                            <br />
                                            Hệ thống sẽ chuyển bạn đến cổng
                                            thanh toán an toàn.
                                        </small>
                                    </div>
                                )}

                                {paymentMethod === 'banking' && (
                                    <div className='alert alert-info'>
                                        <small>
                                            <strong>
                                                Thông tin chuyển khoản:
                                            </strong>
                                            <br />
                                            Ngân hàng: Vietcombank
                                            <br />
                                            Số tài khoản: 1234567890
                                            <br />
                                            Chủ tài khoản: CGV CINEMAS
                                        </small>
                                    </div>
                                )}
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    <FaTimes className='me-2' />
                                    Quay lại
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-lg'
                                    onClick={handlePayment}
                                >
                                    <FaReceipt className='me-2' />
                                    Tiếp tục thanh toán
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div
                    className='modal show d-block'
                    tabIndex='-1'
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    <FaReceipt className='me-2' />
                                    Xác nhận đặt vé
                                </h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => setShowCheckoutModal(false)}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                <div className='mb-3'>
                                    <h6 className='text-primary'>
                                        {movie.title}
                                    </h6>
                                    <p className='mb-1'>
                                        <strong>Ngày chiếu:</strong>{' '}
                                        {selectedDate}
                                    </p>
                                    <p className='mb-1'>
                                        <strong>Suất chiếu:</strong>{' '}
                                        {selectedShowtime?.time} -{' '}
                                        {selectedShowtime?.room}
                                    </p>
                                    <p className='mb-1'>
                                        <strong>Ghế đã chọn:</strong>{' '}
                                        {selectedSeats.sort().join(', ')}
                                    </p>
                                    <p className='mb-1'>
                                        <strong>Số lượng:</strong>{' '}
                                        {selectedSeats.length} ghế
                                    </p>
                                    <p className='mb-1'>
                                        <strong>Đơn giá:</strong>{' '}
                                        {movie.price.toLocaleString('vi-VN')}đ
                                    </p>
                                    <hr />
                                    <h5 className='text-success mb-0'>
                                        <strong>Tổng tiền:</strong>{' '}
                                        {totalPrice.toLocaleString('vi-VN')}đ
                                    </h5>
                                </div>
                                <div className='alert alert-info'>
                                    <FaCheckCircle className='me-2' />
                                    Vui lòng kiểm tra lại thông tin trước khi
                                    xác nhận.
                                </div>
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => setShowCheckoutModal(false)}
                                >
                                    <FaTimes className='me-2' />
                                    Hủy
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-success'
                                    onClick={handleConfirmBooking}
                                >
                                    <FaCheckCircle className='me-2' />
                                    Xác nhận đặt vé
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

export default BookTicket;
