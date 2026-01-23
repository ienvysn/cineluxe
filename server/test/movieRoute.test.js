const request = require("supertest");
const express = require("express");
const movieRoutes = require("../routes/movieRoutes");
const Movie = require("../models/movieModel");

// Create a dummy app for testing
const app = express();
app.use(express.json());
app.use("/api/movies", movieRoutes);

jest.mock("../models/movieModel");

jest.mock("../middleware/authMiddleware", () => (req, res, next) => next());
jest.mock("../middleware/adminMiddleware", () => (req, res, next) => next());

describe("GET /api/movies/now-showing", () => {
  it("should return list of movies with status 200", async () => {
    Movie.findAll.mockResolvedValue([{ title: "Avatar" }]);

    const response = await request(app).get("/api/movies/now-showing");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe("Avatar");
  });
});