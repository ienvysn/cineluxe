const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 50],
          msg: "Title must be between 0 and 50 characters",
        },
      },
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.ENUM("G", "PG", "PG-13", "R", "NC-17"),
      defaultValue: "PG-13",
    },
    language: {
      type: DataTypes.STRING,
    },
    synopsis: {
      type: DataTypes.TEXT,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);
module.exports = Movie;
