export const movies = [
  {
    id: '1',
    title: 'Oppenheimer',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    rating: 'R',
    language: 'English',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    releaseDate: '2023-07-21',
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    genre: ['Science Fiction', 'Adventure'],
    duration: 166,
    rating: 'PG-13',
    language: 'English',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    releaseDate: '2024-03-01',
  },
  {
    id: '3',
    title: 'The Batman',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber9r3yK703f8t.jpg',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 176,
    rating: 'PG-13',
    language: 'English',
    synopsis: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
    releaseDate: '2022-03-04',
  },
  {
    id: '4',
    title: 'Interstellar',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    genre: ['Science Fiction', 'Drama'],
    duration: 169,
    rating: 'PG-13',
    language: 'English',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    releaseDate: '2014-11-07',
  },
  {
    id: '5',
    title: 'Joker',
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    genre: ['Crime', 'Drama', 'Thriller'],
    duration: 122,
    rating: 'R',
    language: 'English',
    synopsis: 'A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.',
    releaseDate: '2019-10-04',
  },
  {
    id: '6',
    title: 'Avatar: The Way of Water',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    genre: ['Science Fiction', 'Adventure'],
    duration: 192,
    rating: 'PG-13',
    language: 'English',
    synopsis: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.',
    releaseDate: '2022-12-16',
  },
];



export const screens = [
  { id: 'screen-1', name: 'Screen 1', rows: 8, seatsPerRow: 12 },
  { id: 'screen-2', name: 'Screen 2 - Premium', rows: 6, seatsPerRow: 10 },
  { id: 'screen-3', name: 'IMAX', rows: 10, seatsPerRow: 15 },
];

const generateShowtimes = () => {
  const showtimes = [];
  const times = ['14:00', '17:00', '20:00', '22:30'];
  const today = new Date();

  movies.forEach((movie) => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      screens.forEach((screen, screenIndex) => {
        times.forEach((time, timeIndex) => {
          if ((screenIndex + timeIndex + dayOffset) % 3 !== 0) {
            const bookedCount = Math.floor(Math.random() * 40);
            const bookedSeats = [];
            const rows = 'ABCDEFGHIJ'.split('');

            for (let i = 0; i < bookedCount; i++) {
              const row = rows[Math.floor(Math.random() * screen.rows)];
              const seat = Math.floor(Math.random() * screen.seatsPerRow) + 1;
              const seatId = `${row}${seat}`;
              if (!bookedSeats.includes(seatId)) {
                bookedSeats.push(seatId);
              }
            }

            showtimes.push({
              id: `${movie.id}-${screen.id}-${dateStr}-${time}`,
              movieId: movie.id,
              screenId: screen.id,
              date: dateStr,
              time,
              bookedSeats,
              heldSeats: [],
            });
          }
        });
      });
    }
  });

  return showtimes;
};

export const showtimes = generateShowtimes();

export const pricing = {
  frontRow: 200,
  normal: 300,
  discountDays: [2, 3], // Tuesday and Wednesday
  discountPercent: 30,
};

export const getOccupancyStatus = (showtime, screen) => {
  const totalSeats = screen.rows * screen.seatsPerRow;
  const bookedSeats = showtime.bookedSeats.length + showtime.heldSeats.length;
  const occupancy = (bookedSeats / totalSeats) * 100;

  if (occupancy >= 90) return { status: 'sold-out', label: 'Sold Out', color: 'destructive' };
  if (occupancy >= 70) return { status: 'almost-full', label: 'Filling Fast', color: 'orange' };
  if (occupancy >= 40) return { status: 'filling', label: 'Available', color: 'warning' };
  return { status: 'available', label: 'Available', color: 'success' };
};
