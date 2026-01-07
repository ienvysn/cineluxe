const express = require("express");
const { connection } = require("./db/db");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");

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

app.listen(port, () => {
  console.log(`Server Running at port : ${port}`);
});
