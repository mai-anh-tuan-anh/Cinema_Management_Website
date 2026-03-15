import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { movies, showtimes } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaThLarge, 
  FaTv, 
  FaReceipt, 
  FaCheckCircle 
} from 'react-icons/fa';

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addTicket } = useAuth();
  const movie = movies.find(m => m.id === parseInt(id));
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt vé');
      navigate('/auth');
      return;
    }

    if (movie) {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      
      // Load booked seats from localStorage
      loadBookedSeats(today, showtimes[0]?.id);
    }
  }, [movie, user, navigate]);

  const loadBookedSeats = (date, showtimeId) => {
    if (!movie || !date || !showtimeId) return;
    
    const key = `booked_${movie.id}_${date}_${showtimeId}`;
    const seats = JSON.parse(localStorage.getItem(key) || '[]');
    setBookedSeats(seats);
  };

  if (!movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Không tìm thấy phim</div>
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
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
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
    if (!selectedShowtime) {
      alert('Vui lòng chọn suất chiếu');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }

    // Save booked seats
    const key = `booked_${movie.id}_${selectedDate}_${selectedShowtime.id}`;
    const currentBooked = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedBooked = [...currentBooked, ...selectedSeats];
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

    // Show confirmation and redirect
    alert('Đặt vé thành công!');
    navigate('/tickets');
  };

  // Generate dates for next 7 days
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">
        <FaTicketAlt className="me-2 text-primary" />
        Đặt Vé Xem Phim
      </h1>

      <div className="row">
        <div className="col-md-8">
          {/* Movie Info */}
          <div className="card mb-4">
            <div className="row g-0">
              <div className="col-md-4">
                <img src={movie.poster} className="img-fluid rounded-start" alt={movie.title} style={{ height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">
                    <span className="badge bg-primary me-2">{movie.genre}</span>
                    <span className="badge bg-info">{movie.duration} phút</span>
                  </p>
                  <p className="card-text">
                    <strong>Giá vé:</strong> <span className="text-success">{movie.price.toLocaleString('vi-VN')}đ</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <FaCalendarAlt className="me-2" />
                Chọn ngày
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {dates.map(date => {
                  const dateStr = date.toISOString().split('T')[0];
                  const displayDate = date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
                  return (
                    <button
                      key={dateStr}
                      className={`btn ${selectedDate === dateStr ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleDateChange(dateStr)}
                    >
                      {displayDate}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Showtime Selection */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <FaClock className="me-2" />
                Chọn suất chiếu
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {showtimes.map(showtime => (
                  <button
                    key={showtime.id}
                    className={`btn ${selectedShowtime?.id === showtime.id ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleShowtimeSelect(showtime)}
                  >
                    <div>{showtime.time}</div>
                    <small>{showtime.room}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          {selectedShowtime && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <FaThLarge className="me-2" />
                  Chọn ghế
                </h5>
                
                {/* Screen */}
                <div className="text-center mb-4">
                  <div className="bg-secondary text-white py-2 rounded mb-3" style={{ maxWidth: '80%', margin: '0 auto' }}>
                    <FaTv className="me-2" />
                    Màn hình
                  </div>
                </div>

                {/* Seat Map */}
                <div className="d-flex flex-column align-items-center">
                  {rows.map(row => (
                    <div key={row} className="d-flex align-items-center mb-2">
                      <span className="me-2 fw-bold" style={{ width: '20px' }}>{row}</span>
                      {Array.from({ length: seatsPerRow }, (_, i) => {
                        const seatNumber = `${row}${i + 1}`;
                        return (
                          <button
                            key={seatNumber}
                            className={getSeatClass(seatNumber)}
                            onClick={() => handleSeatClick(seatNumber)}
                            disabled={bookedSeats.includes(seatNumber)}
                            title={seatNumber}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="d-flex justify-content-center gap-4 mt-4">
                  <div>
                    <button className="seat available me-2" disabled></button>
                    <span>Ghế trống</span>
                  </div>
                  <div>
                    <button className="seat selected me-2" disabled></button>
                    <span>Ghế đang chọn</span>
                  </div>
                  <div>
                    <button className="seat booked me-2" disabled></button>
                    <span>Ghế đã đặt</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-body">
              <h5 className="card-title">
                <FaReceipt className="me-2" />
                Thông tin đặt vé
              </h5>
              <hr />
              
              <div className="mb-3">
                <strong>Phim:</strong>
                <p className="mb-1">{movie.title}</p>
              </div>

              {selectedDate && (
                <div className="mb-3">
                  <strong>Ngày:</strong>
                  <p className="mb-1">{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
              )}

              {selectedShowtime && (
                <div className="mb-3">
                  <strong>Suất chiếu:</strong>
                  <p className="mb-1">{selectedShowtime.time} - {selectedShowtime.room}</p>
                </div>
              )}

              {selectedSeats.length > 0 && (
                <div className="mb-3">
                  <strong>Ghế đã chọn:</strong>
                  <p className="mb-1">{selectedSeats.sort().join(', ')}</p>
                  <strong>Số lượng:</strong> {selectedSeats.length} ghế
                </div>
              )}

              <hr />
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Giá vé:</strong>
                  <span>{movie.price.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Số lượng:</strong>
                  <span>x {selectedSeats.length}</span>
                </div>
              </div>

              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <h5>Tổng tiền:</h5>
                <h5 className="text-success">{totalPrice.toLocaleString('vi-VN')}đ</h5>
              </div>

              <button 
                className="btn btn-success w-100 btn-lg"
                onClick={handleBooking}
                disabled={!selectedShowtime || selectedSeats.length === 0}
              >
                <FaCheckCircle className="me-2" />
                Xác nhận đặt vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;