const Showtime = require("../models/showtimeModel");
const Movie = require("../models/movieModel");
const Screen = require("../models/screenModel");
const { Op } = require("sequelize");

const formatTime = (time) => {
  if (!time) return time;

  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
};

const getDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(new Date(current).toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const createShowtime = async (req, res) => {
  try {
    const { movieId, screenId, date, time, price } = req.body;

    if (!movieId || !screenId || !date || !time) {
      return res.status(400).json({
        error: "Movie, screen, date, and time are required",
      });
    }

    // Check if movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if screen exists
    const screen = await Screen.findByPk(screenId);
    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }

    // Check for duplicate showtime
    const existingShowtime = await Showtime.findOne({
      where: { movieId, screenId, date, time },
    });

    if (existingShowtime) {
      return res.status(409).json({
        error:
          "A showtime already exists for this movie, screen, date, and time",
      });
    }

    const showtime = await Showtime.create({
      movieId,
      screenId,
      date,
      time: formatTime(time),
      price: price || 300.0,
      bookedSeats: [],
      heldSeats: [],
    });

    const showtimeWithDetails = await Showtime.findByPk(showtime.id, {
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
    });

    res.status(201).json(showtimeWithDetails);
  } catch (error) {
    console.error("Error creating showtime:", error);
    res.status(500).json({ error: error.message });
  }
};

const createRecurringShowtimes = async (req, res) => {
  try {
    const { movieId, screenId, startDate, endDate, times, price } = req.body;

    if (
      !movieId ||
      !screenId ||
      !startDate ||
      !endDate ||
      !times ||
      times.length === 0
    ) {
      return res.status(400).json({
        error:
          "Movie, screen, start date, end date, and at least one time are required",
      });
    }

    // Check if movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if screen exists
    const screen = await Screen.findByPk(screenId);
    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }

    const dates = getDateRange(startDate, endDate);
    const showtimesToCreate = [];
    const errors = [];

    // Generate all showtimes
    for (const date of dates) {
      for (const time of times) {
        const formattedTime = formatTime(time);

        // Check for existing showtime
        const existing = await Showtime.findOne({
          where: { movieId, screenId, date, time: formattedTime },
        });

        if (!existing) {
          showtimesToCreate.push({
            movieId,
            screenId,
            date,
            time: formattedTime,
            price: price || 300.0,
            bookedSeats: [],
            heldSeats: [],
          });
        } else {
          errors.push({
            date,
            time: formattedTime,
            message: "Showtime already exists",
          });
        }
      }
    }

    // Bulk create showtimes
    const createdShowtimes = await Showtime.bulkCreate(showtimesToCreate);

    res.status(201).json({
      created: createdShowtimes.length,
      showtimes: createdShowtimes,
      skipped: errors.length,
      errors: errors,
    });
  } catch (error) {
    console.error("Error creating recurring showtimes:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllShowtimes = async (req, res) => {
  try {
    const { movieId, screenId, date, startDate, endDate } = req.query;
    const whereClause = {};

    if (movieId) {
      whereClause.movieId = movieId;
    }

    if (screenId) {
      whereClause.screenId = screenId;
    }

    if (date) {
      whereClause.date = date;
    }

    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    res.status(500).json({ error: error.message });
  }
};

const getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const showtime = await Showtime.findByPk(id, {
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
    });

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    res.status(200).json(showtime);
  } catch (error) {
    console.error("Error fetching showtime:", error);
    res.status(500).json({ error: error.message });
  }
};

const getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const whereClause = { movieId };

    if (date) {
      whereClause.date = date;
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });

    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes by movie:", error);
    res.status(500).json({ error: error.message });
  }
};

const getShowtimesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const today = new Date(); // Strict visibility check based on TODAY

    const showtimes = await Showtime.findAll({
      where: { date },
      include: [
        {
          model: Movie,
          as: "movie",
          where: {
            releaseDate: {
              [Op.lte]: today, // Only show if movie is already released (or releasing today)
            },
          },
        },
        { model: Screen, as: "screen" },
      ],
      order: [["time", "ASC"]],
    });

    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes by date:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, price } = req.body;

    const showtime = await Showtime.findByPk(id);

    if (!showtime) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    // Check for duplicate if date or time is being changed
    if (date || time) {
      const newDate = date || showtime.date;
      const newTime = time || showtime.time;

      const duplicate = await Showtime.findOne({
        where: {
          movieId: showtime.movieId,
          screenId: showtime.screenId,
          date: newDate,
          time: newTime,
          id: { [Op.ne]: id },
        },
      });

      if (duplicate) {
        return res.status(409).json({
          error:
            "A showtime already exists for this movie, screen, date, and time",
        });
      }
    }

    const updateData = {};
    if (date) updateData.date = date;
    if (time) updateData.time = formatTime(time);
    if (price) updateData.price = price;

    await showtime.update(updateData);

    const updatedShowtime = await Showtime.findByPk(id, {
      include: [
        { model: Movie, as: "movie" },
        { model: Screen, as: "screen" },
      ],
    });

    res.status(200).json(updatedShowtime);
  } catch (error) {
    console.error("Error updating showtime:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Showtime.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Showtime not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting showtime:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMultipleShowtimes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No showtime IDs provided" });
    }

    const deleted = await Showtime.destroy({
      where: {
        id: ids,
      },
    });

    res.status(200).json({ message: `${deleted} showtimes deleted successfully` });
  } catch (error) {
    console.error("Error deleting multiple showtimes:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShowtime,
  createRecurringShowtimes,
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovie,
  getShowtimesByDate,
  updateShowtime,
  deleteShowtime,
  deleteMultipleShowtimes,
};

