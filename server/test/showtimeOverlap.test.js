const request = require("supertest");
const express = require("express");


jest.mock("../models/showtimeModel", () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  belongsTo: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
  bulkCreate: jest.fn(),
}));

jest.mock("../models/movieModel", () => ({
  findByPk: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../models/screenModel", () => ({
  findByPk: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../middleware/authMiddleware", () => (req, res, next) => next());
jest.mock("../middleware/adminMiddleware", () => (req, res, next) => next());


const { createShowtime } = require("../controllers/showtimeController");
const Showtime = require("../models/showtimeModel");
const Movie = require("../models/movieModel");
const Screen = require("../models/screenModel");

const app = express();
app.use(express.json());
app.post("/api/showtimes", createShowtime);

describe("POST /api/showtimes - Overlap Detection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validShowtimeData = {
    movieId: "movie123",
    screenId: "screen123",
    date: "2023-10-27",
    time: "14:00",
    price: 15.0,
  };

  const mockMovie = {
    id: "movie123",
    title: "Test Movie",
    duration: 120, // 2 hours
  };

  const mockScreen = {
    id: "screen123",
    name: "Screen 1",
  };

  it("should create showtime when no overlap exists", async () => {
    Movie.findByPk.mockResolvedValue(mockMovie);
    Screen.findByPk.mockResolvedValue(mockScreen);
    Showtime.findOne.mockResolvedValue(null);
    Showtime.findAll.mockResolvedValue([]);

    Showtime.create.mockResolvedValue({
      id: "showtimeNew",
      ...validShowtimeData,
    });
    Showtime.findByPk.mockResolvedValue({
      id: "showtimeNew",
      ...validShowtimeData,
      movie: mockMovie,
      screen: mockScreen,
    });

    const response = await request(app)
      .post("/api/showtimes")
      .send(validShowtimeData);

    expect(response.status).toBe(201);
    expect(Showtime.create).toHaveBeenCalled();
  });

  it("should return 409 when showtime overlaps with an existing one", async () => {
    Movie.findByPk.mockResolvedValue(mockMovie);
    Screen.findByPk.mockResolvedValue(mockScreen);
    Showtime.findOne.mockResolvedValue(null);


    const existingShowtime = {
      id: "existing1",
      date: "2023-10-27",
      time: "15:00",
      movie: { duration: 120 },
    };
    Showtime.findAll.mockResolvedValue([existingShowtime]);

    const response = await request(app)
      .post("/api/showtimes")
      .send(validShowtimeData);

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/overlaps/);
    expect(Showtime.create).not.toHaveBeenCalled();
  });
});
