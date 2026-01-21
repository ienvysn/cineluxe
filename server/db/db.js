const Sequelize = require("sequelize");

const sequelize = new Sequelize("cineluxe", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
});

const connection = async () => {
  try {
    await sequelize.sync({ alter: true });
    await sequelize.sync();
    console.log("Connected");
  } catch (error) {
    console.log("unable to connect", error.message);
  }
};

module.exports = { sequelize, connection };
