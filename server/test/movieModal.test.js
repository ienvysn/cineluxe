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
  it("should create a new movie", async () => {
    await expect(MovieMock.create({ MovieMock   })).rejects.toThrow();
    expect(MovieMock.create).toHaveBeenCalledWith({ Movie });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Movie created successfully",
      movie: expect.any(Object),
    });
  });
});
