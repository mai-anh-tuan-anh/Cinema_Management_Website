Hãy tạo một website quản lý rạp chiếu phim bằng tiếng Việt với giao diện hiện đại, dễ sử dụng. Website chỉ sử dụng Frontend (ReactJS) và lưu dữ liệu bằng localStorage, không sử dụng backend hoặc database.

1. Công nghệ sử dụng

Frontend: ReactJS

CSS Framework: Bootstrap 5 (không sử dụng Tailwind)

API: Google Maps API

Lưu dữ liệu: localStorage

Icons: Bootstrap Icons hoặc FontAwesome

2. Chức năng chính của hệ thống
1. Trang chủ

Trang chủ hiển thị:

Danh sách phim đang chiếu

Danh sách phim sắp chiếu

Banner hoặc carousel quảng cáo phim

Thanh tìm kiếm phim

Hiển thị rating trung bình của phim

2. Hệ thống đăng ký / đăng nhập

Cho phép người dùng:

Đăng ký tài khoản

Đăng nhập

Đăng xuất

Lưu thông tin tài khoản trong localStorage

Thông tin lưu:

username

email

password

danh sách vé đã mua

Sau khi đăng nhập:

Hiển thị tên người dùng trên navbar

3. Danh sách phim

Hiển thị các thông tin:

Poster phim

Tên phim

Thể loại

Thời lượng

Rating

Nút Xem chi tiết

Layout sử dụng Bootstrap Card và Grid

4. Trang chi tiết phim

Trang chi tiết hiển thị:

Poster phim

Trailer (YouTube iframe)

Nội dung phim

Thể loại

Thời lượng

Rating trung bình

Người dùng có thể:

Viết review phim

Chấm điểm rating từ 1 đến 5 sao

Reviews được lưu trong localStorage.

5. Đặt vé và chọn ghế

Người dùng có thể:

Chọn phim

Chọn suất chiếu

Chọn ghế ngồi

Seat map hiển thị bằng grid layout:

Ghế trống: màu xanh

Ghế đã đặt: màu xám

Ghế đang chọn: màu vàng

Ghế đã đặt sẽ được lưu trong localStorage để tránh bị đặt lại.

6. Thanh toán và hóa đơn

Sau khi đặt vé:

Hiển thị hóa đơn

Thông tin hóa đơn gồm:

Tên phim

Suất chiếu

Ghế đã chọn

Giá vé

Tổng tiền

Thời gian đặt

Hóa đơn được:

Lưu vào localStorage

Hiển thị trong Trang lịch sử đặt vé

7. Lịch sử đặt vé

Trang này cho phép người dùng:

Xem tất cả vé đã đặt

Xem lại chi tiết hóa đơn

Hiển thị danh sách vé bằng Bootstrap Table

8. Google Maps API

Tạo trang Thông tin rạp hiển thị:

Bản đồ Google Maps

Vị trí rạp chiếu phim

Địa chỉ

Thông tin liên hệ

9. Dark Mode / Light Mode

Website có:

Nút chuyển Dark Mode / Light Mode

Lưu trạng thái theme bằng localStorage

Áp dụng class CSS toàn cục để thay đổi giao diện

10. Responsive Design

Website phải:

Responsive cho mobile, tablet, desktop

Sử dụng Bootstrap Grid System

3. Các trang chính của website

Website gồm các trang:

Trang chủ

Danh sách phim

Chi tiết phim

Đặt vé

Lịch sử đặt vé

Đăng nhập / đăng ký

Thông tin rạp (Google Maps)

4. Cấu trúc thư mục React

src
├ components
├ pages
├ services
├ hooks
├ context
├ layouts
├ utils
└ App.js

5. Yêu cầu giao diện

Sử dụng các component Bootstrap:

Navbar

Carousel

Cards

Modal

Buttons

Tables

Forms

Thiết kế:

Hiện đại

Dễ sử dụng

Tối ưu UX/UI

6. Yêu cầu code

Code rõ ràng, dễ hiểu

Có comment giải thích

Tách component hợp lý

Sử dụng React Hooks

Sử dụng localStorage để lưu dữ liệu người dùng, reviews, ghế đã đặt và hóa đơn

7. Dữ liệu mẫu

Tạo dữ liệu mẫu gồm:

6–10 bộ phim

Poster phim

Thể loại

Trailer

Giá vé