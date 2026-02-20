const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 25],
        msg: "Full name must be between 0 and 25 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: {
        args: [0, 50],
        msg: "Email must be between 0 and 50 characters",
      },
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  google_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = User;
