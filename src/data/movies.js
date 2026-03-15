// Dữ liệu mẫu cho các bộ phim
export const movies = [
  {
    id: 1,
    title: "Nhiệm Vụ Bất Khả Thi",
    genre: "Hành động, Phiêu lưu",
    duration: 143,
    rating: 4.5,
    status: "now-showing",
    poster: "https://images.unsplash.com/photo-1643677841226-d6427625f118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlciUyMGRhcmt8ZW58MXx8fHwxNzczMzgyNzEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/avz06PDqDbM",
    description: "Một điệp viên phải đối mặt với nhiệm vụ nguy hiểm nhất trong sự nghiệp của mình. Với những pha hành động mãn nhãn và kịch tính cao trào, bộ phim hứa hẹn mang đến những giây phút giải trí tuyệt vời.",
    price: 85000,
    director: "Christopher McQuarrie",
    cast: "Tom Cruise, Rebecca Ferguson, Hayley Atwell"
  },
  {
    id: 2,
    title: "Vũ Trụ Huyền Bí",
    genre: "Khoa học viễn tưởng",
    duration: 156,
    rating: 4.8,
    status: "now-showing",
    poster: "https://images.unsplash.com/photo-1634585738250-09ee92cae0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBmdXR1cmlzdGljJTIwbW92aWV8ZW58MXx8fHwxNzczNDE0NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    description: "Một hành trình khám phá vũ trụ đầy bí ẩn và kỳ diệu. Nhân loại phải đối mặt với những thử thách chưa từng có khi bước chân vào những vùng đất chưa được khám phá.",
    price: 90000,
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson"
  },
  {
    id: 3,
    title: "Ác Mộng Kinh Hoàng",
    genre: "Kinh dị, Thriller",
    duration: 108,
    rating: 4.2,
    status: "now-showing",
    poster: "https://images.unsplash.com/photo-1662937599687-2db5ce600f56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjB0aHJpbGxlciUyMGRhcmslMjBjaW5lbWF8ZW58MXx8fHwxNzczNDE0NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/FnCdOQsX5kc",
    description: "Một ngôi nhà cũ kỹ ẩn chứa những bí mật đáng sợ. Khi một gia đình chuyển đến, họ phải đối mặt với những hiện tượng siêu nhiên đầy rùng rợn.",
    price: 80000,
    director: "James Wan",
    cast: "Vera Farmiga, Patrick Wilson, Madison Wolfe"
  },
  {
    id: 4,
    title: "Tiếng Cười Vang Vọng",
    genre: "Hài, Gia đình",
    duration: 95,
    rating: 4.0,
    status: "now-showing",
    poster: "https://images.unsplash.com/photo-1747807112118-6dd39da7f7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBoYXBweSUyMGNpbmVtYXxlbnwxfHx8fDE3NzM0MTQ2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/6hB3S9bIaco",
    description: "Một bộ phim hài lãng mạn nhẹ nhàng về cuộc sống thường ngày. Những tình huống dở khóc dở cười sẽ mang đến tiếng cười cho cả gia đình.",
    price: 75000,
    director: "Judd Apatow",
    cast: "Adam Sandler, Jennifer Aniston, Brooklyn Decker"
  },
  {
    id: 5,
    title: "Tình Yêu Mùa Hạ",
    genre: "Lãng mạn, Tâm lý",
    duration: 118,
    rating: 4.6,
    status: "coming-soon",
    poster: "https://images.unsplash.com/photo-1697558933060-60b8c037f5d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMG1vdmllfGVufDF8fHx8MTc3MzMzMzUyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/U0JBaJ5ocks",
    description: "Câu chuyện tình yêu đẹp như mơ giữa hai con người từ hai thế giới khác nhau. Họ phải vượt qua nhiều thử thách để đến với nhau.",
    price: 85000,
    director: "Richard Linklater",
    cast: "Emma Stone, Ryan Gosling, John Legend"
  },
  {
    id: 6,
    title: "Hành Trình Vĩ Đại",
    genre: "Phiêu lưu, Hành động",
    duration: 162,
    rating: 4.7,
    status: "coming-soon",
    poster: "https://images.unsplash.com/photo-1758523957586-0e9592d880f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBlcGljJTIwbW92aWV8ZW58MXx8fHwxNzczNDE0NjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/XW2E2Fnh52w",
    description: "Một cuộc phiêu lưu hoành tráng qua những vùng đất kỳ bí. Những chiến binh dũng cảm phải đối mặt với nhiều hiểm nguy để cứu thế giới.",
    price: 90000,
    director: "Peter Jackson",
    cast: "Viggo Mortensen, Elijah Wood, Ian McKellen"
  },
  {
    id: 7,
    title: "Những Giọt Nước Mắt",
    genre: "Tâm lý, Chính kịch",
    duration: 127,
    rating: 4.4,
    status: "coming-soon",
    poster: "https://images.unsplash.com/photo-1640127249305-793865c2efe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGVtb3Rpb25hbCUyMGNpbmVtYXxlbnwxfHx8fDE3NzMzNzk3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/gH-VYnMTHc4",
    description: "Một câu chuyện cảm động về gia đình và tình yêu thương. Những thử thách trong cuộc sống khiến họ phải học cách trân trọng những gì mình có.",
    price: 80000,
    director: "Greta Gerwig",
    cast: "Saoirse Ronan, Florence Pugh, Emma Watson"
  },
  {
    id: 8,
    title: "Vương Quốc Phép Thuật",
    genre: "Giả tưởng, Phiêu lưu",
    duration: 145,
    rating: 4.5,
    status: "coming-soon",
    poster: "https://images.unsplash.com/photo-1763244734635-72b34a167bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbWFnaWMlMjBtb3ZpZXxlbnwxfHx8fDE3NzMzNjU5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    trailer: "https://www.youtube.com/embed/mxD-5z_xHBU",
    description: "Một thế giới phép thuật đầy màu sắc và kỳ diệu. Những phù thủy trẻ tuổi phải học cách sử dụng sức mạnh của mình để chống lại thế lực hắc ám.",
    price: 85000,
    director: "Alfonso Cuarón",
    cast: "Daniel Radcliffe, Emma Watson, Rupert Grint"
  }
];

// Dữ liệu suất chiếu
export const showtimes = [
  { id: 1, time: "09:00", room: "Phòng 1" },
  { id: 2, time: "12:30", room: "Phòng 2" },
  { id: 3, time: "15:00", room: "Phòng 1" },
  { id: 4, time: "18:30", room: "Phòng 3" },
  { id: 5, time: "21:00", room: "Phòng 2" }
];

// Thông tin rạp chiếu phim
export const theaterInfo = {
  name: "CGV Cinemas",
  address: "72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  phone: "1900 6017",
  email: "info@cgv.vn",
  coordinates: {
    lat: 10.7743,
    lng: 106.7021
  }
};
