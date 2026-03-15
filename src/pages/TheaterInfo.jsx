import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { theaterInfo } from '../data/movies';
import { 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaMap, 
  FaExclamationTriangle, 
  FaLink, 
  FaInfoCircle, 
  FaParking, 
  FaCoffee, 
  FaVolumeUp,
  FaFilm
} from 'react-icons/fa';

const TheaterInfo = () => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Placeholder - người dùng cần thay thế bằng API key thực
          version: 'weekly',
        });

        await loader.load();

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: theaterInfo.coordinates,
            zoom: 16,
          });

          new google.maps.Marker({
            position: theaterInfo.coordinates,
            map: map,
            title: theaterInfo.name,
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };

    initMap();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4">
        <FaMapMarkerAlt className="me-2 text-primary" />
        Thông Tin Rạp Chiếu
      </h1>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <FaBuilding className="me-2" />
                {theaterInfo.name}
              </h3>

              <div className="mb-4">
                <h5>
                  <FaMapMarkerAlt className="text-primary me-2" />
                  Địa chỉ
                </h5>
                <p className="ms-4">{theaterInfo.address}</p>
              </div>

              <div className="mb-4">
                <h5>
                  <FaPhone className="text-success me-2" />
                  Số điện thoại
                </h5>
                <p className="ms-4">
                  <a href={`tel:${theaterInfo.phone}`} className="text-decoration-none">
                    {theaterInfo.phone}
                  </a>
                </p>
              </div>

              <div className="mb-4">
                <h5>
                  <FaEnvelope className="text-info me-2" />
                  Email
                </h5>
                <p className="ms-4">
                  <a href={`mailto:${theaterInfo.email}`} className="text-decoration-none">
                    {theaterInfo.email}
                  </a>
                </p>
              </div>

              <div className="mb-4">
                <h5>
                  <FaClock className="text-warning me-2" />
                  Giờ mở cửa
                </h5>
                <p className="ms-4">
                  Tất cả các ngày: 9:00 - 23:00
                </p>
              </div>

              <div className="d-grid gap-2">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${theaterInfo.coordinates.lat},${theaterInfo.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FaMap className="me-2" />
                  Xem trên Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body p-0">
              {mapError ? (
                <div className="p-4 text-center">
                  <FaExclamationTriangle className="text-warning" style={{ fontSize: '3rem' }} />
                  <h5 className="mt-3">Không thể tải bản đồ</h5>
                  <p className="text-muted">
                    Vui lòng thay thế <code>YOUR_GOOGLE_MAPS_API_KEY</code> trong file <code>TheaterInfo.jsx</code> bằng Google Maps API Key của bạn.
                  </p>
                  <a 
                    href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    <FaLink className="me-2" />
                    Hướng dẫn lấy API Key
                  </a>
                </div>
              ) : (
                <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">
                <FaInfoCircle className="me-2 text-primary" />
                Tiện ích tại rạp
              </h4>
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaParking className="text-primary" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 mb-0">Bãi đỗ xe rộng rãi</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaCoffee className="text-success" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 mb-0">Quầy đồ ăn & nước</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaVolumeUp className="text-info" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 mb-0">Âm thanh Dolby 7.1</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaFilm className="text-warning" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 mb-0">Công nghệ 3D, IMAX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterInfo;