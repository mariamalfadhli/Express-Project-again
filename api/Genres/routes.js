const express = require("express");
const {
  getGenre,
  createGenre,
  fetchGenre,
  addGenreToMovie,
} = require("./controllers");
const passport = require("passport");
const router = express.Router();

// Everything with the word genre is a placeholder that you'll change in accordance with your project

router.param("genreId", async (req, res, next, genreId) => {
  try {
    const foundGenre = await fetchGenre(genreId);
    if (!foundGenre) return next({ status: 404, message: "Genre not found" });
    req.genre = foundGenre;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getGenre);
router.post("/", passport.authenticate("jwt", { session: false }), createGenre);
router.put(
  "/:genreId/:movieId",
  passport.authenticate("jwt", { session: false }),
  addGenreToMovie
);

module.exports = router;
