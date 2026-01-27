const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Pricing = sequelize.define("Pricing", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  frontRow: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 200,
  },
  normal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 300,
  },
  discountDays: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [2, 3], // Tuesday (2) and Wednesday (3)
  },
  discountPercent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Pricing;
