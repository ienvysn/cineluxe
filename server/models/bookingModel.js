const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const Movie = require("./movieModel");
const Screen = require("./screenModel");
const Showtime = require("./showtimeModel");
const User = require("./userModel");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    showtimeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Showtime,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    seats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "WALLET",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "confirmed",
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);


Booking.belongsTo(Showtime, { foreignKey: "showtimeId", as: "showtime" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
Showtime.hasMany(Booking, { foreignKey: "showtimeId", as: "bookings" });
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });

module.exports = Booking;
