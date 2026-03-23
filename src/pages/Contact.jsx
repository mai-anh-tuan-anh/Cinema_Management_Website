import React, { useState, useEffect } from 'react';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaPaperPlane,
    FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [messages, setMessages] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Load messages from localStorage
        const storedMessages = JSON.parse(
            localStorage.getItem('contact_messages') || '[]'
        );
        setMessages(storedMessages);

        // Auto-fill user info if logged in
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.username,
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newMessage = {
            id: Date.now(),
            ...formData,
            date: new Date().toISOString(),
            status: 'pending'
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem(
            'contact_messages',
            JSON.stringify(updatedMessages)
        );

        // Reset form
        setFormData({
            name: user ? user.username : '',
            email: user ? user.email || '' : '',
            phone: '',
            subject: '',
            message: ''
        });

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <div className='container my-5'>
            {/* Header */}
            <div className='text-center mb-5'>
                <h1 className='mb-3'>Liên Hệ Với Chúng Tôi</h1>
                <p className='text-muted'>
                    Gửi tin nhắn cho chúng tôi và chúng tôi sẽ phản hồi sớm nhất
                    có thể
                </p>
            </div>

            <div className='row'>
                {/* Contact Form */}
                <div className='col-lg-8 mb-4'>
                    <div className='card shadow'>
                        <div className='card-body p-4'>
                            <h4 className='card-title mb-4'>
                                <FaPaperPlane className='me-2' />
                                Gửi Tin Nhắn
                            </h4>

                            {showSuccess && (
                                <div
                                    className='alert alert-success d-flex align-items-center'
                                    role='alert'
                                >
                                    <FaCheckCircle className='me-2' />
                                    <div>
                                        Tin nhắn của bạn đã được gửi thành công!
                                        Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-md-6 mb-3'>
                                        <label
                                            htmlFor='name'
                                            className='form-label fw-bold'
                                        >
                                            Họ và tên{' '}
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            id='name'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder='Nhập họ và tên của bạn'
                                        />
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label
                                            htmlFor='email'
                                            className='form-label fw-bold'
                                        >
                                            Email{' '}
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type='email'
                                            className='form-control'
                                            id='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder='email@example.com'
                                        />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6 mb-3'>
                                        <label
                                            htmlFor='phone'
                                            className='form-label fw-bold'
                                        >
                                            Số điện thoại
                                        </label>
                                        <input
                                            type='tel'
                                            className='form-control'
                                            id='phone'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='0912345678'
                                        />
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label
                                            htmlFor='subject'
                                            className='form-label fw-bold'
                                        >
                                            Chủ đề{' '}
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className='form-select'
                                            id='subject'
                                            name='subject'
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value=''>
                                                Chọn chủ đề
                                            </option>
                                            <option value='booking'>
                                                Hỗ trợ đặt vé
                                            </option>
                                            <option value='payment'>
                                                Thanh toán
                                            </option>
                                            <option value='feedback'>
                                                Góp ý
                                            </option>
                                            <option value='complaint'>
                                                Khiếu nại
                                            </option>
                                            <option value='partnership'>
                                                Hợp tác
                                            </option>
                                            <option value='other'>Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label
                                        htmlFor='message'
                                        className='form-label fw-bold'
                                    >
                                        Nội dung tin nhắn{' '}
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <textarea
                                        className='form-control'
                                        id='message'
                                        name='message'
                                        rows='6'
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder='Nhập nội dung tin nhắn của bạn...'
                                    ></textarea>
                                </div>

                                <button
                                    type='submit'
                                    className='btn btn-primary btn-lg'
                                >
                                    <FaPaperPlane className='me-2' />
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='col-lg-4'>
                    <div className='card shadow mb-4'>
                        <div className='card-body p-4'>
                            <h5 className='card-title mb-4'>
                                Thông Tin Liên Hệ
                            </h5>

                            <div className='mb-4'>
                                <div className='d-flex align-items-start mb-3'>
                                    <div
                                        className='text-primary me-3'
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h6 className='mb-1'>Địa chỉ</h6>
                                        <p className='text-muted mb-0 small'>
                                            Lê Văn Lương, Phường Hà Cầu, Quận Hà
                                            Đông, Hà Nội.
                                        </p>
                                    </div>
                                </div>

                                <div className='d-flex align-items-start mb-3'>
                                    <div
                                        className='text-primary me-3'
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <h6 className='mb-1'>Điện thoại</h6>
                                        <p className='text-muted mb-0 small'>
                                            Hotline:{' '}
                                            <a
                                                href='tel:19006017'
                                                className='text-decoration-none'
                                            >
                                                1900 6017
                                            </a>
                                            <br />
                                            Di động:{' '}
                                            <a
                                                href='tel:0901234567'
                                                className='text-decoration-none'
                                            >
                                                090 123 4567
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className='d-flex align-items-start mb-3'>
                                    <div
                                        className='text-primary me-3'
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h6 className='mb-1'>Email</h6>
                                        <p className='text-muted mb-0 small'>
                                            <a
                                                href='mailto:info@cgv.vn'
                                                className='text-decoration-none'
                                            >
                                                hoidap@cgv.vn
                                            </a>
                                            <br />
                                            <a
                                                href='mailto:support@cgv.vn'
                                                className='text-decoration-none'
                                            >
                                                support@cgv.vn
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className='d-flex align-items-start'>
                                    <div
                                        className='text-primary me-3'
                                        style={{ fontSize: '1.5rem' }}
                                    >
                                        <FaClock />
                                    </div>
                                    <div>
                                        <h6 className='mb-1'>Giờ làm việc</h6>
                                        <p className='text-muted mb-0 small'>
                                            Tất cả các ngày: 8:00 - 23:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card shadow'>
                        <div className='card-body p-4'>
                            <h5 className='card-title mb-3'>
                                Kết Nối Với Chúng Tôi
                            </h5>
                            <div className='d-flex gap-2'>
                                <a
                                    href='https://www.facebook.com/CJCGV'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='btn btn-outline-primary btn-sm flex-fill'
                                >
                                    Facebook
                                </a>
                                <a
                                    href='https://www.instagram.com/cgvcinemasvietnam/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='btn btn-outline-danger btn-sm flex-fill'
                                >
                                    Instagram
                                </a>
                                <a
                                    href='https://www.tiktok.com/@cgv_vn?lang=en'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='btn btn-outline-info btn-sm flex-fill'
                                >
                                    TikTok
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='row mt-5'>
                <div className='col-12'>
                    <h3 className='mb-4'>Câu Hỏi Thường Gặp</h3>
                    <div className='accordion' id='faqAccordion'>
                        <div className='accordion-item'>
                            <h2 className='accordion-header'>
                                <button
                                    className='accordion-button'
                                    type='button'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#faq1'
                                >
                                    Làm sao để đặt vé xem phim?
                                </button>
                            </h2>
                            <div
                                id='faq1'
                                className='accordion-collapse collapse show'
                                data-bs-parent='#faqAccordion'
                            >
                                <div className='accordion-body'>
                                    Bạn có thể đặt vé trực tuyến bằng cách chọn
                                    phim, chọn suất chiếu, chọn ghế và thanh
                                    toán. Hoặc đến trực tiếp rạp để mua vé tại
                                    quầy.
                                </div>
                            </div>
                        </div>

                        <div className='accordion-item'>
                            <h2 className='accordion-header'>
                                <button
                                    className='accordion-button collapsed'
                                    type='button'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#faq2'
                                >
                                    Tôi có thể hủy vé đã đặt không?
                                </button>
                            </h2>
                            <div
                                id='faq2'
                                className='accordion-collapse collapse'
                                data-bs-parent='#faqAccordion'
                            >
                                <div className='accordion-body'>
                                    Vé đã đặt có thể được hủy trước giờ chiếu ít
                                    nhất 2 giờ. Phí hủy vé là 10% giá trị vé.
                                    Vui lòng liên hệ hotline để được hỗ trợ.
                                </div>
                            </div>
                        </div>

                        <div className='accordion-item'>
                            <h2 className='accordion-header'>
                                <button
                                    className='accordion-button collapsed'
                                    type='button'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#faq3'
                                >
                                    CGV có chương trình ưu đãi gì không?
                                </button>
                            </h2>
                            <div
                                id='faq3'
                                className='accordion-collapse collapse'
                                data-bs-parent='#faqAccordion'
                            >
                                <div className='accordion-body'>
                                    Chúng tôi có nhiều chương trình ưu đãi cho
                                    thành viên, giảm giá vào các ngày trong
                                    tuần, combo bắp nước và các sự kiện đặc
                                    biệt. Theo dõi website để cập nhật thông tin
                                    mới nhất.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
