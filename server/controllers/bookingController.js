const Booking = require("../models/bookingModel");
const Showtime = require("../models/showtimeModel");
const Movie = require("../models/movieModel");
const Screen = require("../models/screenModel");
const { sequelize } = require("../db/db");
const { Op } = require("sequelize");

const createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
        showtimeId,
        seats,
        totalAmount,
        paymentMethod,
      } = req.body;

    if (!showtimeId || !seats || seats.length === 0 || !totalAmount) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const userId = req.user.id;

    const showtime = await Showtime.findByPk(showtimeId, { transaction: t });
    if (!showtime) {
      await t.rollback();
      return res.status(404).json({ error: "Showtime not found" });
    }

    const alreadyBooked = seats.some((seat) =>
      showtime.bookedSeats.includes(seat)
    );
    if (alreadyBooked) {
      await t.rollback();
      return res.status(409).json({
        error: "One or more selected seats are already booked",
      });
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const bookingNumber = Math.random().toString(36).substring(2, 8).toUpperCase();

    const booking = await Booking.create(
      {
        showtimeId,
        userId,
        seats,
        totalAmount,
        paymentMethod,
        status: "confirmed",
        isUsed: false,
        pin,
        bookingNumber,
      },
      { transaction: t }
    );

    const newBookedSeats = [...showtime.bookedSeats, ...seats];
    await showtime.update({ bookedSeats: newBookedSeats }, { transaction: t });

    await t.commit();


    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Showtime,
          as: "showtime",
          include: [
            { model: Movie, as: "movie" },
            { model: Screen, as: "screen" },
          ],
        },
      ],
    });

    res.status(201).json(completeBooking);
  } catch (error) {
    await t.rollback();
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      include: [
        {
          model: Showtime,
          as: "showtime",
          include: [
            { model: Movie, as: "movie" },
            { model: Screen, as: "screen" },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    // Calculate global stats independent of pagination
    const totalRevenue = await Booking.sum('totalAmount', {
        where: {
            status: { [Op.ne]: 'cancelled' }
        }
    });

    const confirmedCount = await Booking.count({
        where: { status: 'confirmed' }
    });

    const cancelledCount = await Booking.count({
        where: { status: 'cancelled' }
    });

    res.status(200).json({
      bookings: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count,
      stats: {
          totalRevenue: totalRevenue || 0,
          confirmedCount,
          cancelledCount,
          totalBookings: count
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Showtime,
          as: "showtime",
          include: [
            { model: Movie, as: "movie" },
            { model: Screen, as: "screen" },
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Showtime,
          as: "showtime",
          include: [
            { model: Movie, as: "movie" },
            { model: Screen, as: "screen" },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

const validateTicket = async (req, res) => {
  try {
    const { bookingId, pin } = req.body;

    if (!bookingId || !pin) {
      return res.status(400).json({ error: "Booking ID and PIN are required" });
    }

    // Use findOne to search by bookingNumber (or id if it happens to be one, though we prefer bookingNumber now)
    // We search by bookingNumber primarily.
    const booking = await Booking.findOne({
      where: { bookingNumber: bookingId },
      include: [
        {
            model: Showtime,
            as: "showtime",
            include: [
              { model: Movie, as: "movie" },
              { model: Screen, as: "screen" },
            ],
        }
      ]
    });

    if (!booking) {
        // Fallback: Optional, if we still want to support UUIDs we could check if it is a UUID and search by PK.
        // But for now, let's just stick to the short code to avoid 500 errors on invalid UUIDs.
      return res.status(404).json({ error: "Booking not found" });
    }

    if (String(booking.pin) !== String(pin)) {
        return res.status(401).json({ error: "Invalid PIN" });
    }

    if (booking.status === 'cancelled') {
        return res.status(400).json({ error: "This ticket has been cancelled" });
    }

    // Time Validation
    const showtimeDate = booking.showtime.date;
    const showtimeTime = booking.showtime.time;
    const dateTimeString = `${showtimeDate}T${showtimeTime}`;
    const showtimeStart = new Date(dateTimeString);
    const validUntil = new Date(showtimeStart.getTime() + 60 * 60 * 1000); // +1 hour

    const now = new Date();

    if (now > validUntil) {
       return res.status(400).json({ error: "Ticket expired. " });
    }

    if (booking.isUsed) {
        return res.status(409).json({ error: "Ticket has already been used" });
    }

    booking.isUsed = true;
    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
        message: "Ticket validated successfully",
        booking
    });

  } catch (error) {
    console.error("Error validating ticket:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getUserBookings,
  validateTicket,
};
