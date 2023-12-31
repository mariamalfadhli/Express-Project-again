const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./api/Users/routes");
const moviesRoutes = require("./api/Movies/routes");
const actorsRoutes = require("./api/Actors/routes");
const genresRoutes = require("./api/Genres/routes");
const reviewsRoutes = require("./api/Reviews/routes");
const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

// Everything with the word temp is a placeholder that you'll change in accordance with your project
app.use("/auth", userRoutes);
app.use("/movies", moviesRoutes);
app.use("/actors", actorsRoutes);
app.use("/genres", genresRoutes);
app.use("/reviews", reviewsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`The application is running on ${config.PORT}`);
});

module.exports = app;
