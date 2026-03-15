import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { 
  FaTicketAlt, 
  FaExclamationTriangle, 
  FaSignInAlt, 
  FaFilm, 
  FaEye, 
  FaInfoCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaDoorOpen, 
  FaChair, 
  FaDollarSign, 
  FaHistory, 
  FaQrcode 
} from 'react-icons/fa';

const TicketHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <FaExclamationTriangle className="me-2" />
          Vui lòng đăng nhập để xem lịch sử đặt vé
        </div>
        <Link to="/auth" className="btn btn-primary">
          <FaSignInAlt className="me-2" />
          Đăng nhập
        </Link>
      </div>
    );
  }

  const tickets = user.tickets || [];

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">
        <FaTicketAlt className="me-2 text-primary" />
        Lịch Sử Đặt Vé
      </h1>

      {tickets.length === 0 ? (
        <div className="text-center py-5">
          <FaTicketAlt style={{ fontSize: '5rem', color: '#ccc' }} />
          <h4 className="mt-3">Bạn chưa đặt vé nào</h4>
          <p className="text-muted">Hãy chọn phim và đặt vé ngay!</p>
          <Link to="/movies" className="btn btn-primary mt-3">
            <FaFilm className="me-2" />
            Xem danh sách phim
          </Link>
        </div>
      ) : (
        <div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Phim</th>
                  <th>Ngày chiếu</th>
                  <th>Suất chiếu</th>
                  <th>Phòng</th>
                  <th>Ghế</th>
                  <th>Tổng tiền</th>
                  <th>Ngày đặt</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={ticket.poster} 
                          alt={ticket.movieTitle}
                          className="me-2 rounded"
                          style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                        />
                        <strong>{ticket.movieTitle}</strong>
                      </div>
                    </td>
                    <td>{new Date(ticket.date).toLocaleDateString('vi-VN')}</td>
                    <td>{ticket.showtime}</td>
                    <td>{ticket.room}</td>
                    <td>
                      <span className="badge bg-info">
                        {ticket.seats.length} ghế
                      </span>
                    </td>
                    <td className="text-success fw-bold">
                      {ticket.totalPrice.toLocaleString('vi-VN')}đ
                    </td>
                    <td>{new Date(ticket.bookingDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#ticketDetailModal"
                        onClick={() => handleViewDetail(ticket)}
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="alert alert-info mt-4">
            <FaInfoCircle className="me-2" />
            <strong>Tổng số vé đã đặt:</strong> {tickets.length} vé
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="modal fade" id="ticketDetailModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <FaTicketAlt className="me-2" />
                  Chi Tiết Vé
                </h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img 
                    src={selectedTicket.poster} 
                    alt={selectedTicket.movieTitle}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                
                <h5 className="text-center mb-4">{selectedTicket.movieTitle}</h5>

                <div className="row mb-3">
                  <div className="col-6">
                    <strong><FaCalendarAlt className="me-2" />Ngày chiếu:</strong>
                  </div>
                  <div className="col-6 text-end">
                    {new Date(selectedTicket.date).toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <strong><FaClock className="me-2" />Suất chiếu:</strong>
                  </div>
                  <div className="col-6 text-end">
                    {selectedTicket.showtime}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <strong><FaDoorOpen className="me-2" />Phòng chiếu:</strong>
                  </div>
                  <div className="col-6 text-end">
                    {selectedTicket.room}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <strong><FaChair className="me-2" />Ghế ngồi:</strong>
                  </div>
                  <div className="col-6 text-end">
                    {selectedTicket.seats.join(', ')}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <strong><FaDollarSign className="me-2" />Giá vé:</strong>
                  </div>
                  <div className="col-6 text-end">
                    {selectedTicket.price.toLocaleString('vi-VN')}đ x {selectedTicket.seats.length}
                  </div>
                </div>

                <hr />

                <div className="row mb-3">
                  <div className="col-6">
                    <h5><strong>Tổng tiền:</strong></h5>
                  </div>
                  <div className="col-6 text-end">
                    <h5 className="text-success">{selectedTicket.totalPrice.toLocaleString('vi-VN')}đ</h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <small className="text-muted">
                      <FaHistory className="me-2" />
                      Đặt vé lúc: {new Date(selectedTicket.bookingDate).toLocaleString('vi-VN')}
                    </small>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="text-center mt-4 p-3 bg-light rounded">
                  <FaQrcode style={{ fontSize: '4rem' }} />
                  <p className="small text-muted mb-0">Mã vé: #{selectedTicket.id}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketHistory;