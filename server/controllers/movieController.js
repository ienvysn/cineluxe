const Movie = require("../models/movieModel");
const { Op } = require("sequelize");

const createMovie = async (req, res) => {
  try {
    let {
      title,
      poster,
      genre,
      duration,
      rating,
      language,
      synopsis,
      releaseDate,
    } = req.body;

    if (req.file) {
      poster = `/uploads/posters/${req.file.filename}`;
    }

    if (!title || !duration) {
      return res.status(400).json({ error: "Title and duration are required" });
    }
    if (typeof genre === "string") {
      genre = genre.split(",").map((g) => g.trim());
    }
    const movie = await Movie.create({
      title,
      poster,
      genre,
      duration,
      rating,
      language,
      synopsis,
      releaseDate,
    });
    console.log("This is worling");
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      updateData.poster = `/uploads/posters/${req.file.filename}`;
    }

    if (typeof updateData.genre === "string") {
      updateData.genre = updateData.genre.split(",").map((g) => g.trim());
    }

    const [updated] = await Movie.update(updateData, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const updatedMovie = await Movie.findByPk(id);
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Movie.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUpcomingMovies = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const movies = await Movie.findAll({
      where: {
        releaseDate: {
          [Op.gt]: nextMonth,
        },
      },
      order: [["releaseDate", "ASC"]],
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    res.status(500).json({ error: error.message });
  }
};

const getNowShowingMovies = async (req, res) => {
  try {
    const today = new Date();
    const movies = await Movie.findAll({
      where: {
        releaseDate: {
          [Op.lte]: today,
        },
      },
      order: [["releaseDate", "DESC"]],
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching now showing movies:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getUpcomingMovies,
  getNowShowingMovies,
};
