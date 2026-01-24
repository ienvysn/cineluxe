const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const Screen = require("../models/screenModel");
const Showtime = require("../models/showtimeModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. Today's Bookings
    const todayBookings = await Booking.count({
      where: {
        created_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    // 2. Today's Revenue
    const todayRevenue = await Booking.sum("totalAmount", {
      where: {
        created_at: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        status: { [Op.ne]: "cancelled" },
      },
    });

    // 3. Weekly Revenue
    const weeklyRevenue = await Booking.sum("totalAmount", {
      where: {
        created_at: {
          [Op.gte]: oneWeekAgo,
        },
        status: { [Op.ne]: "cancelled" },
      },
    });

    // 4. Total Customers
    const totalCustomers = await User.count({
        where: { role: 'user' }
    }).catch(() => User.count()); // Fallback if role doesn't exist or error

    // 5. Total Movies & Screens
    const totalMovies = await Movie.count();
    const totalScreens = await Screen.count();

    // 6. Today's Showtimes
    // We need to format today as YYYY-MM-DD for string comparison if date is stored as string/dateonly
    // Or if it's datetime, use range.
    // Looking at previous code `const todayDate = new Date().toISOString().split("T")[0];` implies date is likely YYYY-MM-DD string or DATEONLY.
    // Let's assume DATEONLY or string YYYY-MM-DD as per common practice in this codebase.
    const todayStr = today.toISOString().split("T")[0];

    const todayShowtimes = await Showtime.findAll({
      where: {
        date: todayStr
      },
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
      order: [["time", "ASC"]],
    });

    res.status(200).json({
      todayBookings,
      todayRevenue: todayRevenue || 0,
      weeklyRevenue: weeklyRevenue || 0,
      totalCustomers,
      totalMovies,
      totalScreens,
      todayShowtimes,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

module.exports = { getDashboardStats };
