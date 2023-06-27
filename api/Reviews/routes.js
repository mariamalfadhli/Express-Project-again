const express = require("express");
const {
  getReview,
  createReview,
  updateReview,
  deleteReview,
  fetchReview,
  addReview,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");

// Everything with the word review is a placeholder that you'll change in accordance with your project

router.param("reviewId", async (req, res, next, reviewId) => {
  try {
    const foundReview = await fetchReview(reviewId);
    if (!foundReview) return next({ status: 404, message: "Review not found" });
    req.review = foundReview;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getReview);
router.post(
  "/:movieId",
  passport.authenticate("jwt", { session: false }),
  addReview
);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
