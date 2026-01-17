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
          msg: "Capacity must be at least 1"
        }
      }
    },
    screenType: {
      type: DataTypes.STRING,
      defaultValue: "2D",
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

module.exports = Screen;
