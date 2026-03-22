import { createBrowserRouter } from 'react-router';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import BookTicket from './pages/BookTicket';
import Payment from './pages/Payment';
import TicketHistory from './pages/TicketHistory';
import TheaterInfo from './pages/TheaterInfo';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import AdminRoute from './components/AdminRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'movies', element: <Movies /> },
            { path: 'movie/:id', element: <MovieDetail /> },
            { path: 'book/:id', element: <BookTicket /> },
            {
                path: 'payment/:id/:date/:showtimeId/:seats',
                element: <Payment />
            },
            { path: 'tickets', element: <TicketHistory /> },
            { path: 'theater', element: <TheaterInfo /> },
            { path: 'contact', element: <Contact /> },
            { path: 'auth', element: <Auth /> },
            {
                path: 'admin',
                element: (
                    <AdminRoute>
                        <Admin />
                    </AdminRoute>
                )
            },
            { path: '*', element: <NotFound /> }
        ]
    }
]);
