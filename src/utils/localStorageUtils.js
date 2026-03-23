import { movies, showtimes, theaterInfo } from '../data/movies';

// Initialize localStorage with complete data from movies.js
export const initializeLocalStorage = () => {
    // Save all movies data
    localStorage.setItem('movies', JSON.stringify(movies));

    // Save all showtimes data
    localStorage.setItem('showtimes', JSON.stringify(showtimes));

    // Save theater info
    localStorage.setItem('theaterInfo', JSON.stringify(theaterInfo));

    console.log('LocalStorage initialized with complete data');
};

// Get movies from localStorage
export const getMoviesFromStorage = () => {
    const storedMovies = localStorage.getItem('movies');
    return storedMovies ? JSON.parse(storedMovies) : movies;
};

// Get showtimes from localStorage
export const getShowtimesFromStorage = () => {
    const storedShowtimes = localStorage.getItem('showtimes');
    return storedShowtimes ? JSON.parse(storedShowtimes) : showtimes;
};

// Get theater info from localStorage
export const getTheaterInfoFromStorage = () => {
    const storedTheaterInfo = localStorage.getItem('theaterInfo');
    return storedTheaterInfo ? JSON.parse(storedTheaterInfo) : theaterInfo;
};

// Save movies to localStorage
export const saveMoviesToStorage = (moviesData) => {
    localStorage.setItem('movies', JSON.stringify(moviesData));

    // Trigger custom event for same-tab updates
    window.dispatchEvent(
        new CustomEvent('localStorageUpdate', {
            detail: { key: 'movies', value: moviesData }
        })
    );

    console.log('Movies saved to localStorage and event dispatched');
};

// Save showtimes to localStorage
export const saveShowtimesToStorage = (showtimesData) => {
    localStorage.setItem('showtimes', JSON.stringify(showtimesData));

    // Trigger custom event for same-tab updates
    window.dispatchEvent(
        new CustomEvent('localStorageUpdate', {
            detail: { key: 'showtimes', value: showtimesData }
        })
    );

    console.log('Showtimes saved to localStorage and event dispatched');
};
