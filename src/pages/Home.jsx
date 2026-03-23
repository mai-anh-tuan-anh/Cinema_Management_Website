import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { movies } from '../data/movies';
import {
    initializeLocalStorage,
    getMoviesFromStorage
} from '../utils/localStorageUtils';
import {
    FaInfoCircle,
    FaSearch,
    FaFilm,
    FaTag,
    FaClock,
    FaStar,
    FaTicketAlt,
    FaCalendarAlt
} from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [allMovies, setAllMovies] = useState(movies);

    // Load movies from localStorage with real-time sync
    useEffect(() => {
        const updateMovies = () => {
            const storedMovies = getMoviesFromStorage();
            setAllMovies(storedMovies);
            console.log('Updated movies from localStorage:', storedMovies);
        };

        // Initialize localStorage on first visit
        if (
            !localStorage.getItem('movies') ||
            !localStorage.getItem('showtimes')
        ) {
            initializeLocalStorage();
        }

        // Always refresh with latest data from movies.js
        initializeLocalStorage();
        setAllMovies(movies);

        // Initial load
        updateMovies();

        // Storage event listener for real-time sync
        const handleStorageChange = (event) => {
            if (event.key === 'movies' && event.newValue) {
                try {
                    const updatedMovies = JSON.parse(event.newValue);
                    setAllMovies(updatedMovies);
                    console.log(
                        'Real-time movies update received:',
                        updatedMovies
                    );
                } catch (error) {
                    console.error('Error parsing storage event:', error);
                }
            }
        };

        // Custom event listener for same-tab updates
        const handleCustomUpdate = (event) => {
            if (event.detail.key === 'movies') {
                setAllMovies(event.detail.value);
                console.log(
                    'Custom movies update received:',
                    event.detail.value
                );
            }
        };

        // Add event listeners
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageUpdate', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(
                'localStorageUpdate',
                handleCustomUpdate
            );
        };
    }, []);

    const nowShowingMovies = allMovies
        .filter((m) => m.status === 'now-showing')
        .slice(0, 8);
    const comingSoonMovies = allMovies
        .filter((m) => m.status === 'coming-soon')
        .slice(0, 8);

    const featuredMovies = [...nowShowingMovies, ...comingSoonMovies].slice(
        0,
        3
    );
    console.log('Featured movies:', featuredMovies.length, featuredMovies);

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

    const filteredMovies = searchTerm
        ? allMovies.filter(
              (m) =>
                  m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.genre.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <div>
            {/* Hero Carousel */}
            <div
                id='heroCarousel'
                className='carousel slide mt-4'
                data-bs-ride='carousel'
                data-bs-interval='3000'
                data-bs-wrap='true'
            >
                <div className='carousel-indicators'>
                    {featuredMovies.map((_, index) => (
                        <button
                            key={index}
                            type='button'
                            data-bs-target='#heroCarousel'
                            data-bs-slide-to={index}
                            className={index === 0 ? 'active' : ''}
                        ></button>
                    ))}
                </div>

                <div className='carousel-inner'>
                    {featuredMovies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                        >
                            <img
                                src={movie.poster}
                                className='d-block w-100'
                                style={{
                                    height: '800px',
                                    objectFit: 'cover'
                                }}
                                alt={movie.title}
                            />
                            <div className='carousel-caption d-flex align-items-center justify-content-center h-100'>
                                <div className='text-center bg-dark bg-opacity-50 p-3 rounded w-50'>
                                    <h3>{movie.title}</h3>
                                    <p>
                                        {movie.genre} | {movie.duration} phút
                                    </p>
                                    <Link
                                        to={`/movie/${movie.id}`}
                                        className='btn btn-primary'
                                        onClick={() => window.scrollTo(0, 0)}
                                    >
                                        <FaInfoCircle className='me-2' />
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target='#heroCarousel'
                    data-bs-slide='prev'
                >
                    <span className='carousel-control-prev-icon'></span>
                </button>
                <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target='#heroCarousel'
                    data-bs-slide='next'
                >
                    <span className='carousel-control-next-icon'></span>
                </button>
            </div>

            {/* Now Showing Movies */}
            <div className='container my-5'>
                <h2 className='mb-4'>
                    <FaFilm className='me-2 text-primary' />
                    Phim Đang Chiếu
                </h2>
                <div className='row'>
                    {nowShowingMovies.map((movie) => (
                        <div key={movie.id} className='col-md-3 col-sm-6 mb-4'>
                            <div className='card movie-card h-100'>
                                <div className='position-relative'>
                                    <img
                                        src={movie.poster}
                                        className='card-img-top'
                                        alt={movie.title}
                                        style={{
                                            height: '350px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            navigate(`/movie/${movie.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                    />
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
                                            {getMovieRating(movie)}
                                        </span>
                                        /5.0
                                    </div>
                                    <div className='mt-auto'>
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className='btn btn-primary w-100 mb-2'
                                            onClick={() =>
                                                window.scrollTo(0, 0)
                                            }
                                        >
                                            <FaInfoCircle className='me-1' />
                                            Chi tiết
                                        </Link>
                                        <Link
                                            to={`/book/${movie.id}`}
                                            className='btn btn-success w-100'
                                            onClick={() =>
                                                window.scrollTo(0, 0)
                                            }
                                        >
                                            <FaTicketAlt className='me-1' />
                                            Đặt vé
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon Movies */}
            <div className='container my-5'>
                <h2 className='mb-4'>
                    <FaCalendarAlt className='me-2 text-primary' />
                    Phim Sắp Chiếu
                </h2>
                <div className='row'>
                    {comingSoonMovies.map((movie) => (
                        <div key={movie.id} className='col-md-3 col-sm-6 mb-4'>
                            <div className='card movie-card h-100'>
                                <div className='position-relative'>
                                    <img
                                        src={movie.poster}
                                        className='card-img-top'
                                        alt={movie.title}
                                        style={{
                                            height: '350px',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() =>
                                            navigate(`/movie/${movie.id}`)
                                        }
                                    />
                                    <span className='position-absolute top-0 end-0 badge bg-warning text-dark m-2'>
                                        Sắp chiếu
                                    </span>
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
                                    <div className='mt-auto'>
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className='btn btn-primary w-100'
                                            onClick={() =>
                                                window.scrollTo(0, 0)
                                            }
                                        >
                                            <FaInfoCircle className='me-1' />
                                            Chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
