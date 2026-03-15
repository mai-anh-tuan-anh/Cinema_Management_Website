import React, { useState } from 'react';
import { Link } from 'react-router';
import { movies } from '../data/movies';
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const nowShowingMovies = movies.filter(m => m.status === 'now-showing');
  const comingSoonMovies = movies.filter(m => m.status === 'coming-soon');
  
  const featuredMovies = nowShowingMovies.slice(0, 3);
  
  const filteredMovies = searchTerm
    ? movies.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Hero Carousel */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
            ></button>
          ))}
        </div>
        
        <div className="carousel-inner">
          {featuredMovies.map((movie, index) => (
            <div key={movie.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={movie.poster} className="d-block w-100" alt={movie.title} />
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
                <h3>{movie.title}</h3>
                <p>{movie.genre} | {movie.duration} phút</p>
                <Link to={`/movie/${movie.id}`} className="btn btn-primary">
                  <FaInfoCircle className="me-2" />
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Search Section */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group input-group-lg">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm phim theo tên hoặc thể loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Search Results */}
            {searchTerm && (
              <div className="mt-3">
                <h5>Kết quả tìm kiếm ({filteredMovies.length})</h5>
                {filteredMovies.length > 0 ? (
                  <div className="row">
                    {filteredMovies.map(movie => (
                      <div key={movie.id} className="col-md-4 mb-3">
                        <div className="card movie-card h-100">
                          <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '300px', objectFit: 'cover' }} />
                          <div className="card-body">
                            <h6 className="card-title">{movie.title}</h6>
                            <p className="card-text small text-muted">{movie.genre}</p>
                            <Link to={`/movie/${movie.id}`} className="btn btn-sm btn-primary">
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">Không tìm thấy phim nào</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Now Showing Movies */}
      <div className="container my-5">
        <h2 className="mb-4">
          <FaFilm className="me-2 text-primary" />
          Phim Đang Chiếu
        </h2>
        <div className="row">
          {nowShowingMovies.map(movie => (
            <div key={movie.id} className="col-md-3 col-sm-6 mb-4">
              <div className="card movie-card h-100">
                <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '350px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text text-muted small mb-2">
                    <FaTag className="me-1" />
                    {movie.genre}
                  </p>
                  <p className="card-text small mb-2">
                    <FaClock className="me-1" />
                    {movie.duration} phút
                  </p>
                  <div className="mb-2">
                    <FaStar className="text-warning me-1" />
                    <span className="fw-bold">{movie.rating.toFixed(1)}</span>/5.0
                  </div>
                  <div className="mt-auto">
                    <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100 mb-2">
                      <FaInfoCircle className="me-1" />
                      Chi tiết
                    </Link>
                    <Link to={`/book/${movie.id}`} className="btn btn-success w-100">
                      <FaTicketAlt className="me-1" />
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
      <div className="container my-5">
        <h2 className="mb-4">
          <FaCalendarAlt className="me-2 text-primary" />
          Phim Sắp Chiếu
        </h2>
        <div className="row">
          {comingSoonMovies.map(movie => (
            <div key={movie.id} className="col-md-3 col-sm-6 mb-4">
              <div className="card movie-card h-100">
                <div className="position-relative">
                  <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '350px', objectFit: 'cover' }} />
                  <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-2">
                    Sắp chiếu
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text text-muted small mb-2">
                    <FaTag className="me-1" />
                    {movie.genre}
                  </p>
                  <p className="card-text small mb-2">
                    <FaClock className="me-1" />
                    {movie.duration} phút
                  </p>
                  <div className="mb-2">
                    <FaStar className="text-warning me-1" />
                    <span className="fw-bold">{movie.rating.toFixed(1)}</span>/5.0
                  </div>
                  <div className="mt-auto">
                    <Link to={`/movie/${movie.id}`} className="btn btn-primary w-100">
                      <FaInfoCircle className="me-1" />
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