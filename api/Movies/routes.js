const express = require("express");
const {
  getMovie,
  createMovie,
  getByMovieId,
  fetchMovie,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");

// Everything with the word movie is a placeholder that you'll change in accordance with your project

router.param("movieId", async (req, res, next, movieId) => {
  try {
    const foundMovie = await fetchMovie(movieId);
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    req.movie = foundMovie;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", getMovie);
router.get("/:movieId", getByMovieId);
router.post("/", passport.authenticate("jwt", { session: false }), createMovie);

module.exports = router;
