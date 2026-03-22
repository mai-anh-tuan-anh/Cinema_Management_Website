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
                    version: 'weekly'
                });

                await loader.load();

                if (mapRef.current) {
                    const map = new google.maps.Map(mapRef.current, {
                        center: theaterInfo.coordinates,
                        zoom: 16
                    });

                    new google.maps.Marker({
                        position: theaterInfo.coordinates,
                        map: map,
                        title: theaterInfo.name
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
        <div className='container my-5'>
            <h1 className='mb-4'>
                <FaMapMarkerAlt className='me-2 text-primary' />
                Thông Tin Rạp Chiếu
            </h1>

            <div className='row'>
                <div className='col-md-6 mb-4'>
                    <div className='card h-100'>
                        <div className='card-body'>
                            <h3 className='card-title mb-4'>
                                <FaBuilding className='me-2' />
                                {theaterInfo.name}
                            </h3>

                            <div className='mb-4'>
                                <h5>
                                    <FaMapMarkerAlt className='text-primary me-2' />
                                    Địa chỉ
                                </h5>
                                <p className='ms-4'>
                                    Lê Văn Lương, Phường Hà Cầu, Quận Hà Đông,
                                    Hà Nội.
                                </p>
                            </div>

                            <div className='mb-4'>
                                <h5>
                                    <FaPhone className='text-success me-2' />
                                    Số điện thoại
                                </h5>
                                <p className='ms-4'>
                                    <a
                                        href={`tel:${theaterInfo.phone}`}
                                        className='text-decoration-none'
                                    >
                                        {theaterInfo.phone}
                                    </a>
                                </p>
                            </div>

                            <div className='mb-4'>
                                <h5>
                                    <FaEnvelope className='text-info me-2' />
                                    Email
                                </h5>
                                <p className='ms-4'>
                                    <a
                                        href='mailto:hoidap@cgv.vn'
                                        className='text-decoration-none'
                                    >
                                        hoidap@cgv.vn
                                    </a>
                                </p>
                            </div>

                            <div className='mb-4'>
                                <h5>
                                    <FaClock className='text-warning me-2' />
                                    Giờ mở cửa
                                </h5>
                                <p className='ms-4'>
                                    Tất cả các ngày: 8:00 - 23:00
                                </p>
                            </div>

                            <div className='d-grid gap-2'>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=AEON+Mall+Hà+Đông+Hà+Nội'`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='btn btn-primary'
                                >
                                    <FaMap className='me-2' />
                                    Xem trên Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-md-6 mb-4'>
                    <div className='card h-100'>
                        <div className='card-body p-0'>
                            {mapError ? (
                                <div className='text-center'>
                                    <FaMapMarkerAlt
                                        className='text-danger mt-2'
                                        style={{ fontSize: '2rem' }}
                                    />
                                    <h5 className='mt-3'>Bản đồ rạp chiếu</h5>
                                    <div className='rounded-lg overflow-hidden shadow-xl h-[600px] relative hover:shadow-2xl transition-shadow duration-300'>
                                        <iframe
                                            key='osm-map-iframe'
                                            src='https://www.openstreetmap.org/export/embed.html?bbox=105.7485,20.9875,105.7539,20.9915&layer=mapnik&marker=20.98943,105.75122'
                                            width='100%'
                                            height='500px'
                                            style={{
                                                marginTop: '5px',
                                                borderRadius: '5px',
                                                border: 0
                                            }}
                                            allowFullScreen
                                            loading='lazy'
                                            referrerPolicy='no-referrer-when-downgrade'
                                            title='AEON Mall Cinema Location'
                                        />
                                        <div
                                            className='absolute inset-0 z-10 cursor-pointer'
                                            onClick={() =>
                                                window.open(
                                                    'https://www.google.com/maps/dir/?api=1&destination=AEON+Mall+Hà+Đông+Hà+Nội',
                                                    '_blank'
                                                )
                                            }
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    ref={mapRef}
                                    style={{ width: '100%', height: '600px' }}
                                ></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className='row mt-4'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-body'>
                            <h4 className='card-title mb-4'>
                                <FaInfoCircle className='me-2 text-primary' />
                                Tiện ích tại rạp
                            </h4>
                            <div className='row'>
                                <div className='col-md-3 col-sm-6 mb-3'>
                                    <div className='text-center p-3 bg-light rounded'>
                                        <FaParking
                                            className='text-primary'
                                            style={{ fontSize: '2rem' }}
                                        />
                                        <p className='mt-2 mb-0 input-group-text'>
                                            Bãi đỗ xe rộng rãi
                                        </p>
                                    </div>
                                </div>
                                <div className='col-md-3 col-sm-6 mb-3'>
                                    <div className='text-center p-3 bg-light rounded'>
                                        <FaCoffee
                                            className='text-success'
                                            style={{ fontSize: '2rem' }}
                                        />
                                        <p className='mt-2 mb-0 input-group-text'>
                                            Quầy đồ ăn & nước
                                        </p>
                                    </div>
                                </div>
                                <div className='col-md-3 col-sm-6 mb-3'>
                                    <div className='text-center p-3 bg-light rounded'>
                                        <FaVolumeUp
                                            className='text-info'
                                            style={{ fontSize: '2rem' }}
                                        />
                                        <p className='mt-2 mb-0 input-group-text'>
                                            Âm thanh Dolby 7.1
                                        </p>
                                    </div>
                                </div>
                                <div className='col-md-3 col-sm-6 mb-3'>
                                    <div className='text-center p-3 bg-light rounded'>
                                        <FaFilm
                                            className='text-warning'
                                            style={{ fontSize: '2rem' }}
                                        />
                                        <p className='mt-2 mb-0 input-group-text'>
                                            Công nghệ 3D, IMAX
                                        </p>
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
