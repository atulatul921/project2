require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.log("Errors in db : " + error);
});
db.once("open", () => console.log("Database connected successfully!"));

const express = require("express");
const app = express();

app.use(cors());

app.use("/images", express.static("./uploads"));

app.use([
  express.urlencoded({ extended: false }),
  express.json(),
  session({
    secret: "ONE PIECE IS REAL",
    saveUninitialized: true,
    resave: false,
  }),
]);

app.use("", require("./routes/routes"));
app.use("/students", require("./routes/studentRoutes"));
app.use("/batches", require("./routes/batchRoutes"));
app.use("/batchTimings", require("./routes/batchTimingRoute"));
app.use("/courses", require("./routes/courseRoutes"));
app.use("/tests", require("./routes/testRoutes"));
app.use("/attendance", require("./routes/attendanceRoutes"));

app.listen(PORT);
