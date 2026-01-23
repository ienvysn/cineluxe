const movieController = require("../controllers/movieController");
const Movie = require("../models/movieModel");

jest.mock("../models/movieModel");

describe("Movie Controller - createMovie", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "Inception",
        duration: 148,
        genre: "Action, Sci-Fi",
        rating: "PG-13",
      },
      file: { filename: "poster.jpg" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should create a movie and return 201", async () => {
    const mockMovie = {
      id: "uuid-123",
      ...req.body,
      poster: "/uploads/posters/poster.jpg",
    };
    Movie.create.mockResolvedValue(mockMovie);

    await movieController.createMovie(req, res);

    expect(Movie.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Inception",
        genre: ["Action", "Sci-Fi"], // Verify split logic
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockMovie);
  });

  it("should return 400 if title is missing", async () => {
    req.body.title = "";
    await movieController.createMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Title and duration are required",
    });
  });
});
