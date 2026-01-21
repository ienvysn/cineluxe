const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Screen = sequelize.define(
  "Screen",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Capacity must be at least 1",
        },
      },
    },
    rows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    seatsPerRow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    underscored: true,
  },
);

module.exports = Screen;
