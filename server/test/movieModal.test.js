const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();

const MovieMock = dbMock.define("Movie", {
  id: "fbbb750b-a147-481b-9f20-1e35b2b6c168",
  title: "Avatar",
  price: 10,
  poster:
    "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.ebay.com%2Fitm%2F165767261260&ved=0CBYQjRxqFwoTCNDt6anIoJIDFQAAAAAdAAAAABAI&opi=89978449",
  genre: ["Action", "Adventure", "Science Fiction"],
  duration: 120,
  rating: "PG-13",
  language: "English",
  synopsis: "A story about a man on a distant planet.",
  releaseDate: "2022-01-01",
});

describe("MovieModal", () => {
  it("should create a new movie mock instance", async () => {
    const movieData = {
      title: "Inception",
      duration: 148,
      genre: ["Action", "Sci-Fi"],
      rating: "PG-13",
    };

    const movie = await MovieMock.create(movieData);

    expect(movie.title).toBe("Inception");
    expect(movie.duration).toBe(148);
    expect(movie.genre).toContain("Action");
  });
});
