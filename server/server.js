const express = require("express");
const { connection } = require("./db/db");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoutes");
const screenRoute = require("./routes/screenRoutes");
const showtimeRoute = require("./routes/showtimeRoutes");
const { createUploadFolder } = require("./utils/imageHelper");
const bookingRoute = require("./routes/bookingRoutes");
const pricingRoute = require("./routes/pricingRoutes")
const dashboardRoute = require("./routes/dashboardRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
createUploadFolder();
connection();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/screens", screenRoute);
app.use("/api/showtimes", showtimeRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/pricing", pricingRoute);

app.listen(port, () => {
  console.log(`Server Running at port : ${port}`);
});
