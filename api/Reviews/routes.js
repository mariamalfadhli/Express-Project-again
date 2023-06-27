const express = require("express");
const {
  getReview,
  updateReview,
  deleteReview,
  fetchReview,
  addReview,
  getMyReviews,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");
const validateRating = require("../../middlewares/validateRating");
const signedIn = passport.authenticate("jwt", { session: false });
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
router.use(validateRating);
router.get("/", signedIn, getReview);
router.get("/my-reviews", signedIn, getMyReviews);
router.post("/:movieId", signedIn, addReview);
router.put("/edit/:reviewId", signedIn, updateReview);
router.delete("/delete/:reviewId", signedIn, deleteReview);

module.exports = router;
