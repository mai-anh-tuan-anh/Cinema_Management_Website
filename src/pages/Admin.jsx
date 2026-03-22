import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { movies } from '../data/movies';
import AddMovie from '../components/AddMovie';
import { FaFilm, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
    const navigate = useNavigate();
    const [adminMovies, setAdminMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'add'

    // Load movies from localStorage on mount
    useEffect(() => {
        // Always refresh from movies.js first
        localStorage.setItem('movies', JSON.stringify(movies));
        setAdminMovies(movies);
    }, []);

    // Refresh movies list after adding new movie
    const refreshMovies = () => {
        // Always get latest from localStorage (which should be synced with movies.js)
        const storedMovies = localStorage.getItem('movies');
        if (storedMovies) {
            setAdminMovies(JSON.parse(storedMovies));
        }
    };

    // Filter movies based on search
    const filteredMovies = adminMovies.filter(
        (movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteMovie = (movieId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
            const updatedMovies = adminMovies.filter((m) => m.id !== movieId);
            setAdminMovies(updatedMovies);
            localStorage.setItem('movies', JSON.stringify(updatedMovies));
            toast.success('Đã xóa phim thành công!');
        }
    };

    return (
        <div className='container my-5'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2>
                    <FaFilm className='me-2' />
                    Quản lý Phim
                </h2>
                <div className='btn-group'>
                    <button
                        className={`btn ${currentView === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentView('list')}
                    >
                        <FaFilm className='me-2' />
                        Danh sách
                    </button>
                    <button
                        className={`btn ${currentView === 'add' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentView('add')}
                    >
                        <FaPlus className='me-2' />
                        Thêm phim mới
                    </button>
                </div>
            </div>

            {currentView === 'add' ? (
                <AddMovie onMovieAdded={refreshMovies} />
            ) : (
                <>
                    {/* Search */}
                    <div className='mb-4'>
                        <div className='input-group'>
                            <span className='input-group-text'>
                                <FaSearch />
                            </span>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Tìm kiếm phim theo tên hoặc thể loại...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Movies Table */}
                    <div className='card'>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                <table className='table table-hover'>
                                    <thead className='table-dark'>
                                        <tr>
                                            <th>ID</th>
                                            <th>Poster</th>
                                            <th>Tên phim</th>
                                            <th>Thể loại</th>
                                            <th>Thời lượng</th>
                                            <th>Đánh giá</th>
                                            <th>Giá vé</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMovies.map((movie) => (
                                            <tr key={movie.id}>
                                                <td>{movie.id}</td>
                                                <td>
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        style={{
                                                            width: '50px',
                                                            height: '70px',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <strong>
                                                        {movie.title}
                                                    </strong>
                                                    <br />
                                                    <small className='text-muted'>
                                                        {movie.director}
                                                    </small>
                                                </td>
                                                <td>{movie.genre}</td>
                                                <td>{movie.duration} phút</td>
                                                <td>
                                                    <span className='badge bg-warning text-dark'>
                                                        {movie.rating}/5
                                                    </span>
                                                </td>
                                                <td>
                                                    {movie.price.toLocaleString(
                                                        'vi-VN'
                                                    )}
                                                    đ
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${movie.status === 'now-showing' ? 'bg-success' : 'bg-info'}`}
                                                    >
                                                        {movie.status ===
                                                        'now-showing'
                                                            ? 'Đang chiếu'
                                                            : 'Sắp chiếu'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className='btn-group'>
                                                        <button
                                                            className='btn btn-sm btn-outline-danger'
                                                            onClick={() =>
                                                                handleDeleteMovie(
                                                                    movie.id
                                                                )
                                                            }
                                                            title='Xóa'
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
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
        </div>
    );
};

export default Admin;
