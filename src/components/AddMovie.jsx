import React, { useState } from 'react';
import { movies, showtimes } from '../data/movies';
import {
    saveMoviesToStorage,
    saveShowtimesToStorage
} from '../utils/localStorageUtils';

const AddMovie = ({ onMovieAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        duration: '',
        status: 'now-showing',
        poster: '',
        trailer: '',
        description: '',
        price: '',
        director: '',
        cast: '',
        ageRating: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get existing movies from localStorage or use initial movies
        const existingMovies = JSON.parse(
            localStorage.getItem('movies') || JSON.stringify(movies)
        );

        // Generate new ID
        const newId = Math.max(...existingMovies.map((m) => m.id)) + 1;

        // Create new movie object
        const newMovie = {
            id: newId,
            title: formData.title,
            genre: formData.genre,
            duration: parseInt(formData.duration),
            status: formData.status,
            poster: formData.poster,
            trailer: formData.trailer,
            description: formData.description,
            price: parseInt(formData.price),
            director: formData.director,
            cast: formData.cast,
            ...(formData.ageRating && { ageRating: formData.ageRating })
        };

        // Generate showtimes for new movie
        const generateShowtimes = (movieId) => {
            const defaultTimes = ['09:00', '12:30', '15:30', '18:30', '21:30'];
            const roomNumber = ((movieId - 1) % 5) + 1; // Rotate between rooms 1-5

            return defaultTimes.map((time, index) => ({
                movieId: movieId,
                id: showtimes.length + index + 1, // Generate unique ID
                time: time,
                room: `Phòng ${roomNumber}`
            }));
        };

        // Add to movies array
        const updatedMovies = [...existingMovies, newMovie];

        // Generate and save showtimes
        const newShowtimes = generateShowtimes(newId);
        const updatedShowtimes = [...showtimes, ...newShowtimes];

        // Save to localStorage with real-time sync
        saveMoviesToStorage(updatedMovies);
        saveShowtimesToStorage(updatedShowtimes);

        // Reset form
        setFormData({
            title: '',
            genre: '',
            duration: '',
            status: 'now-showing',
            poster: '',
            trailer: '',
            description: '',
            price: '',
            director: '',
            cast: '',
            ageRating: ''
        });

        setMessage('Phim đã được thêm thành công!');

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);

        // Call the callback to refresh the movies list
        if (onMovieAdded) {
            onMovieAdded();
        }
    };

    return (
        <div className='card'>
            <div className='card-header bg-primary text-white'>
                <h4 className='mb-0'>
                    <i className='fas fa-film me-2'></i>
                    Thêm Phim Mới
                </h4>
            </div>
            <div className='card-body'>
                {message && (
                    <div
                        className='alert alert-success alert-dismissible fade show'
                        role='alert'
                    >
                        {message}
                        <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='alert'
                        ></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Tên phim *</label>
                            <input
                                type='text'
                                className='form-control'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Thể loại *</label>
                            <input
                                type='text'
                                className='form-control'
                                name='genre'
                                value={formData.genre}
                                onChange={handleChange}
                                placeholder='VD: Hành Động, Phiêu Lưu, Kinh Dị'
                                required
                            />
                        </div>

                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>
                                Thời lượng (phút) *
                            </label>
                            <input
                                type='number'
                                className='form-control'
                                name='duration'
                                value={formData.duration}
                                onChange={handleChange}
                                min='1'
                                required
                            />
                        </div>

                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Giá vé (VNĐ) *</label>
                            <input
                                type='number'
                                className='form-control'
                                name='price'
                                value={formData.price}
                                onChange={handleChange}
                                min='0'
                                required
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Trạng thái *</label>
                            <select
                                className='form-select'
                                name='status'
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value='now-showing'>Đang chiếu</option>
                                <option value='coming-soon'>Sắp chiếu</option>
                            </select>
                        </div>

                        <div className='col-12 mb-3'>
                            <label className='form-label'>Poster URL *</label>
                            <input
                                type='url'
                                className='form-control'
                                name='poster'
                                value={formData.poster}
                                onChange={handleChange}
                                placeholder='https://...'
                                required
                            />
                        </div>

                        <div className='col-12 mb-3'>
                            <label className='form-label'>Trailer URL *</label>
                            <input
                                type='url'
                                className='form-control'
                                name='trailer'
                                value={formData.trailer}
                                onChange={handleChange}
                                placeholder='https://www.youtube.com/embed/...'
                                required
                            />
                        </div>

                        <div className='col-12 mb-3'>
                            <label className='form-label'>Mô tả *</label>
                            <textarea
                                className='form-control'
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows='4'
                                required
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Đạo diễn *</label>
                            <input
                                type='text'
                                className='form-control'
                                name='director'
                                value={formData.director}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>Diễn viên *</label>
                            <input
                                type='text'
                                className='form-control'
                                name='cast'
                                value={formData.cast}
                                onChange={handleChange}
                                placeholder='VD: Tom Cruise, Hayley Atwell, Rebecca Ferguson'
                                required
                            />
                        </div>

                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                Độ tuổi giới hạn
                            </label>
                            <select
                                className='form-control'
                                name='ageRating'
                                value={formData.ageRating}
                                onChange={handleChange}
                            >
                                <option value=''>Không giới hạn</option>
                                <option value='12+'>12+</option>
                                <option value='15+'>15+</option>
                                <option value='18+'>18+</option>
                            </select>
                        </div>
                    </div>

                    <div className='d-flex justify-content-end'>
                        <button
                            type='button'
                            className='btn btn-secondary me-2'
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    genre: '',
                                    duration: '',
                                    status: 'now-showing',
                                    poster: '',
                                    trailer: '',
                                    description: '',
                                    price: '',
                                    director: '',
                                    cast: '',
                                    ageRating: ''
                                });
                            }}
                        >
                            <i className='fas fa-times me-2'></i>
                            Hủy
                        </button>
                        <button type='submit' className='btn btn-primary'>
                            <i className='fas fa-plus me-2'></i>
                            Thêm Phim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMovie;
