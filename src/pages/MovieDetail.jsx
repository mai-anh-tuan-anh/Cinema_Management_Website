import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { movies } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import {
    FaTicketAlt,
    FaCalendarAlt,
    FaTag,
    FaClock,
    FaStar,
    FaInfoCircle,
    FaPlayCircle,
    FaComments,
    FaPaperPlane,
    FaUserCircle,
    FaExclamationTriangle,
    FaArrowLeft
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MovieDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const movie = movies.find((m) => m.id === parseInt(id));

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [userRating, setUserRating] = useState(0);

    // Load reviews from localStorage for this movie
    useEffect(() => {
        const storedReviews = JSON.parse(
            localStorage.getItem(`reviews_${id}`) || '[]'
        );
        setReviews(storedReviews);
    }, [id]);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (movie) {
            // Load reviews from localStorage
            const storedReviews = JSON.parse(
                localStorage.getItem(`reviews_${movie.id}`) || '[]'
            );
            setReviews(storedReviews);
        }
    }, [movie]);

    if (!movie) {
        return (
            <div className='container my-5'>
                <div className='alert alert-danger'>
                    <FaExclamationTriangle className='me-2' />
                    Không tìm thấy phim
                </div>
                <Link to='/' className='btn btn-primary'>
                    <FaArrowLeft className='me-2' />
                    Về trang chủ
                </Link>
            </div>
        );
    }

    // Check if user has purchased tickets for this movie
    const hasPurchasedTicket = () => {
        if (!user || !user.tickets) return false;
        return user.tickets.some((ticket) => ticket.movieId === movie.id);
    };

    // Check if user has already reviewed this movie
    const hasReviewed = () => {
        if (!user) return false;
        return reviews.some((review) => review.userId === user.id);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Vui lòng đăng nhập để đánh giá!');
            navigate('/auth');
            return;
        }

        if (!hasPurchasedTicket()) {
            toast.error(
                'Bạn cần đặt vé và thanh toán cho bộ phim này trước khi đánh giá'
            );
            return;
        }

        if (hasReviewed()) {
            toast.error(
                'Bạn đã đánh giá bộ phim này rồi. Mỗi tài khoản chỉ được đánh giá một lần.'
            );
            return;
        }

        if (!newReview.comment.trim()) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        const review = {
            id: Date.now(),
            movieId: parseInt(id),
            userId: user.id,
            username: user.username,
            rating: userRating,
            comment: newReview.comment,
            date: new Date().toISOString()
        };

        const updatedReviews = [...reviews, review];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));

        // Update movie rating in localStorage
        const updatedMovies = JSON.parse(
            localStorage.getItem('movies') || '[]'
        );
        const movieIndex = updatedMovies.findIndex(
            (m) => m.id === parseInt(id)
        );
        if (movieIndex !== -1) {
            const totalRating = updatedReviews.reduce(
                (sum, r) => sum + r.rating,
                0
            );
            updatedMovies[movieIndex].rating =
                totalRating / updatedReviews.length;
            localStorage.setItem('movies', JSON.stringify(updatedMovies));
        }

        setNewReview({ rating: 5, comment: '' });
        setUserRating(0);
        toast.success('Cảm ơn bạn đã đánh giá!');
    };

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : movie.rating.toFixed(1);

    return (
        <>
            <div className='container my-5'>
                <div className='row'>
                    {/* Movie Info */}
                    <div className='col-md-4 mb-4'>
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className='img-fluid rounded shadow'
                            style={{ height: '700px', objectFit: 'cover' }}
                        />
                        <div className='mt-3'>
                            {movie.status === 'now-showing' ? (
                                <Link
                                    to={`/book/${movie.id}`}
                                    className='btn btn-success w-100 btn-lg'
                                >
                                    <FaTicketAlt className='me-2' />
                                    Đặt vé ngay
                                </Link>
                            ) : (
                                <button
                                    className='btn btn-warning w-100 btn-lg'
                                    disabled
                                >
                                    <FaCalendarAlt className='me-2' />
                                    Sắp chiếu
                                </button>
                            )}
                        </div>
                    </div>

                    <div className='col-md-8'>
                        <h1 className='mb-3'>{movie.title}</h1>

                        <div className='mb-3'>
                            <span className='badge bg-primary me-2'>
                                <FaTag className='me-1' />
                                {movie.genre}
                            </span>
                            <span className='badge bg-info me-2'>
                                <FaClock className='me-1' />
                                {movie.duration} phút
                            </span>
                            <span className='badge bg-warning text-dark'>
                                <FaStar className='me-1' />
                                {averageRating} / 5.0
                            </span>
                        </div>

                        <div className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaInfoCircle className='me-2' />
                                    Thông tin phim
                                </h5>
                                <p
                                    className='card-text'
                                    style={{
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {movie.description}
                                </p>
                                <ul className='list-unstyled'>
                                    <li className='mb-2'>
                                        <strong>Đạo diễn:</strong>{' '}
                                        {movie.director}
                                    </li>
                                    <li className='mb-2'>
                                        <strong>Diễn viên:</strong> {movie.cast}
                                    </li>
                                    <li className='mb-2'>
                                        <strong>Giá vé:</strong>{' '}
                                        <span
                                            className='text-success fw-bold'
                                            style={{ fontSize: '24px' }}
                                        >
                                            {movie.price.toLocaleString(
                                                'vi-VN'
                                            )}
                                            đ
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Trailer */}
                        <div className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaPlayCircle className='me-2' />
                                    Trailer
                                </h5>
                                <div className='ratio ratio-16x9'>
                                    <iframe
                                        src={movie.trailer}
                                        title={`${movie.title} Trailer`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className='card'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <FaComments className='me-2' />
                                    Đánh giá ({reviews.length})
                                </h5>

                                {/* Review Form */}
                                {user ? (
                                    <form
                                        onSubmit={handleSubmitReview}
                                        className='mb-4'
                                    >
                                        <div className='mb-3'>
                                            <label className='form-label fw-bold'>
                                                Chấm điểm:
                                            </label>
                                            <div className='star-rating'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`${star <= (hoverRating || newReview.rating) ? 'text-warning' : 'text-muted'}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontSize: '2rem'
                                                        }}
                                                        onMouseEnter={() =>
                                                            setHoverRating(star)
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoverRating(0)
                                                        }
                                                        onClick={() =>
                                                            setNewReview({
                                                                ...newReview,
                                                                rating: star
                                                            })
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label fw-bold'>
                                                Nhận xét:
                                            </label>
                                            <textarea
                                                className='form-control'
                                                rows='3'
                                                placeholder='Chia sẻ cảm nhận của bạn về bộ phim...'
                                                value={newReview.comment}
                                                onChange={(e) =>
                                                    setNewReview({
                                                        ...newReview,
                                                        comment: e.target.value
                                                    })
                                                }
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type='submit'
                                            className='btn btn-primary'
                                        >
                                            <FaPaperPlane className='me-2' />
                                            Gửi đánh giá
                                        </button>
                                    </form>
                                ) : (
                                    <div className='alert alert-info mb-4'>
                                        <FaInfoCircle className='me-2' />
                                        Vui lòng{' '}
                                        <Link to='/auth'>đăng nhập</Link> để
                                        đánh giá phim
                                    </div>
                                )}

                                {/* Reviews List */}
                                <div>
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className='border-bottom pb-3 mb-3'
                                            >
                                                <div className='d-flex justify-content-between align-items-start'>
                                                    <div>
                                                        <h6 className='mb-1'>
                                                            <FaUserCircle className='me-2' />
                                                            {review.username}
                                                        </h6>
                                                        <div className='mb-2'>
                                                            {[
                                                                1, 2, 3, 4, 5
                                                            ].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    className={`${star <= review.rating ? 'text-warning' : 'text-muted'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <small className='text-muted'>
                                                        {new Date(
                                                            review.date
                                                        ).toLocaleDateString(
                                                            'vi-VN'
                                                        )}
                                                    </small>
                                                </div>
                                                <p className='mb-0'>
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-muted'>
                                            Chưa có đánh giá nào
                                        </p>
                                    )}
                                </div>
                            </div>
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

export default MovieDetail;
