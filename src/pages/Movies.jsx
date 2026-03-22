import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { movies } from '../data/movies';
import {
    FaFilm,
    FaPlayCircle,
    FaCalendarAlt,
    FaTag,
    FaClock,
    FaStar,
    FaDollarSign,
    FaInfoCircle,
    FaTicketAlt,
    FaThLarge,
    FaSearch,
    FaComments
} from 'react-icons/fa';

const Movies = () => {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [allMovies, setAllMovies] = useState([]);
    const moviesPerPage = 8;

    // Load movies from localStorage or fallback to initial movies
    useEffect(() => {
        const storedMovies = localStorage.getItem('movies');
        if (storedMovies) {
            setAllMovies(JSON.parse(storedMovies));
        } else {
            setAllMovies(movies);
        }
    }, []);

    // Extract unique genres
    const allGenres = [
        ...new Set(allMovies.flatMap((m) => m.genre.split(', ')))
    ].sort();

    let filteredMovies = allMovies;

    // Filter by status
    if (filter !== 'all') {
        filteredMovies = filteredMovies.filter((m) => m.status === filter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
        filteredMovies = filteredMovies.filter((m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by genre
    if (genreFilter !== 'all') {
        filteredMovies = filteredMovies.filter((m) =>
            m.genre.includes(genreFilter)
        );
    }

    // Sort movies
    filteredMovies = [...filteredMovies].sort((a, b) => {
        if (sortBy === 'name') {
            return a.title.localeCompare(b.title, 'vi');
        } else if (sortBy === 'rating') {
            return b.rating - a.rating;
        } else if (sortBy === 'duration') {
            return b.duration - a.duration;
        }
        return 0;
    });

    // Pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredMovies.slice(
        indexOfFirstMovie,
        indexOfLastMovie
    );

    // Get review count and average rating for each movie
    const getReviewCount = (movieId) => {
        const reviews = JSON.parse(
            localStorage.getItem(`reviews_${movieId}`) || '[]'
        );
        return reviews.length;
    };

    const getMovieRating = (movie) => {
        const reviews = JSON.parse(
            localStorage.getItem(`reviews_${movie.id}`) || '[]'
        );
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            return (totalRating / reviews.length).toFixed(1);
        }
        return movie.rating.toFixed(1);
    };

    return (
        <div className='container my-5'>
            <h1 className='mb-4'>
                <FaFilm className='me-2 text-primary' />
                Danh Sách Phim
            </h1>

            {/* Filters and Sort */}
            <div className='row mb-4'>
                <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Bộ lọc:</label>
                    <div className='btn-group w-100' role='group'>
                        <input
                            type='radio'
                            className='btn-check'
                            name='filter'
                            id='all'
                            checked={filter === 'all'}
                            onChange={() => setFilter('all')}
                        />
                        <label
                            className='btn btn-outline-primary'
                            htmlFor='all'
                        >
                            <FaThLarge className='me-1' />
                            Tất cả
                        </label>

                        <input
                            type='radio'
                            className='btn-check'
                            name='filter'
                            id='now-showing'
                            checked={filter === 'now-showing'}
                            onChange={() => setFilter('now-showing')}
                        />
                        <label
                            className='btn btn-outline-primary'
                            htmlFor='now-showing'
                        >
                            <FaPlayCircle className='me-1' />
                            Đang chiếu
                        </label>

                        <input
                            type='radio'
                            className='btn-check'
                            name='filter'
                            id='coming-soon'
                            checked={filter === 'coming-soon'}
                            onChange={() => setFilter('coming-soon')}
                        />
                        <label
                            className='btn btn-outline-primary'
                            htmlFor='coming-soon'
                        >
                            <FaCalendarAlt className='me-1' />
                            Sắp chiếu
                        </label>
                    </div>
                </div>

                <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Sắp xếp theo:</label>
                    <select
                        className='form-select'
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value='name'>Tên phim (A-Z)</option>
                        <option value='rating'>Đánh giá cao nhất</option>
                        <option value='duration'>Thời lượng</option>
                    </select>
                </div>
            </div>

            {/* Search and Genre Filter */}
            <div className='row mb-4'>
                <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Tìm kiếm phim:</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <FaSearch />
                        </span>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Nhập tên phim...'
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchQuery(e.target.value);
                                }
                            }}
                        />
                        {searchQuery && (
                            <button
                                className='btn btn-outline-secondary'
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className='col-md-6 mb-3'>
                    <label className='form-label fw-bold'>Thể loại:</label>
                    <select
                        className='form-select'
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                    >
                        <option value='all'>Tất cả</option>
                        {allGenres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Movie Grid */}
            <div className='row'>
                {currentMovies.map((movie) => {
                    const reviewCount = getReviewCount(movie.id);
                    const movieRating = getMovieRating(movie);
                    return (
                        <div
                            key={movie.id}
                            className='col-lg-3 col-md-4 col-sm-6 mb-4'
                        >
                            <div className='card movie-card h-100'>
                                <div className='position-relative'>
                                    <img
                                        src={movie.poster}
                                        className='card-img-top'
                                        alt={movie.title}
                                        style={{
                                            height: '400px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    {movie.status === 'coming-soon' && (
                                        <span className='position-absolute top-0 end-0 badge bg-warning text-dark m-2'>
                                            Sắp chiếu
                                        </span>
                                    )}
                                    {movie.ageRating && (
                                        <span className='position-absolute top-0 start-0 badge bg-danger m-2'>
                                            {movie.ageRating}
                                        </span>
                                    )}
                                </div>
                                <div className='card-body d-flex flex-column'>
                                    <h5
                                        className='card-title'
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {movie.title}
                                    </h5>
                                    <p
                                        className='card-text text-muted small mb-2'
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        <FaTag className='me-1' />
                                        {movie.genre}
                                    </p>
                                    <p className='card-text small mb-2'>
                                        <FaClock className='me-1' />
                                        {movie.duration} phút
                                    </p>
                                    <div className='mb-2'>
                                        <FaStar className='text-warning me-1' />
                                        <span className='fw-bold'>
                                            {movieRating}
                                        </span>
                                        /5.0
                                        <span className='text-muted ms-2'>
                                            ({reviewCount} đánh giá)
                                        </span>
                                    </div>
                                    <p className='card-text small text-muted'>
                                        <FaDollarSign className='me-1' />
                                        {movie.price.toLocaleString('vi-VN')}đ
                                    </p>
                                    <div className='mt-auto'>
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className='btn btn-primary w-100 mb-2'
                                        >
                                            <FaInfoCircle className='me-1' />
                                            Chi tiết
                                        </Link>
                                        {movie.status === 'now-showing' && (
                                            <Link
                                                to={`/book/${movie.id}`}
                                                className='btn btn-success w-100'
                                            >
                                                <FaTicketAlt className='me-1' />
                                                Đặt vé
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className='d-flex justify-content-center mt-4'>
                <button
                    className='btn btn-outline-primary me-2'
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) =>
                        (e.target.style.transform = 'scale(1.05)')
                    }
                    onMouseLeave={(e) =>
                        (e.target.style.transform = 'scale(1)')
                    }
                >
                    Trước đó
                </button>
                <span className='mx-3'>Trang {currentPage}</span>
                <button
                    className='btn btn-outline-primary ms-2'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastMovie >= filteredMovies.length}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) =>
                        (e.target.style.transform = 'scale(1.05)')
                    }
                    onMouseLeave={(e) =>
                        (e.target.style.transform = 'scale(1)')
                    }
                >
                    Tiếp theo
                </button>
            </div>

            {filteredMovies.length === 0 && (
                <div className='alert alert-info text-center mt-5'>
                    <FaInfoCircle className='me-2' />
                    Không có phim nào phù hợp với tìm kiếm của bạn
                </div>
            )}
        </div>
    );
};

export default Movies;
