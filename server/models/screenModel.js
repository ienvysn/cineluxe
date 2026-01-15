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
    },
    screenType: {
      type: DataTypes.STRING, // e.g., '2D', '3D', 'IMAX'
      defaultValue: "2D",
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

module.exports = Screen;
