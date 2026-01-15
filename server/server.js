const express = require("express");
const { connection } = require("./db/db");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoutes");
const screenRoute = require("./routes/screenRoutes");

const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
connection();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/screens", screenRoute);

app.listen(port, () => {
  console.log(`Server Running at port : ${port}`);
});
