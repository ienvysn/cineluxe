const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Movie = require("./movieModel");
const Screen = require("./screenModel");

const Showtime = sequelize.define(
  "Showtime",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Movies",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    screenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Screens",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    bookedSeats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    heldSeats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 300.0,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["movie_id", "screen_id", "date", "time"],
        name: "unique_showtime",
      },
      {
        fields: ["date"],
      },
      {
        fields: ["movie_id"],
      },
    ],
  },
);

// Define associations
Showtime.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });
Showtime.belongsTo(Screen, { foreignKey: "screenId", as: "screen" });

Movie.hasMany(Showtime, { foreignKey: "movieId", as: "showtimes" });
Screen.hasMany(Showtime, { foreignKey: "screenId", as: "showtimes" });

module.exports = Showtime;
