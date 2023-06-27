const express = require("express");
const {
  getMovies,
  createMovie,
  getByMovieId,
  fetchMovie,
  addToWatchlist,
  getWatchlist,
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

router.get("/", getMovies);
router.post("/", passport.authenticate("jwt", { session: false }), createMovie);
router.get(
  "/watchlist/",
  passport.authenticate("jwt", { session: false }),
  getWatchlist
);

router.get("/:movieId", getByMovieId);
router.put(
  "/watchlist/:movieId",
  passport.authenticate("jwt", { session: false }),
  addToWatchlist
);
module.exports = router;
