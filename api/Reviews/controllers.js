const Review = require("../../models/Review");
const Movie = require("../../models/Movie");

// Everything with the word review is a placeholder that you'll change in accordance with your project

exports.fetchReview = async (reviewId, next) => {
  try {
    const review1 = await Review.findById(reviewId);
    return review1;
  } catch (error) {
    return next(error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .select("-__v")
      .populate("movieId userId", "name username");
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

// optimized verison
exports.addReview = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;

    // Validate rating value
    if (rating < 1 || rating > 10)
      return next({
        status: 404,
        message: "The Rating Should be between 1 - 10",
      });

    // Fetch the movie along with its reviews
    const foundMovie = await Movie.findById(movieId).populate("reviews");

    // Handle not found scenario
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });

    // Create the new review
    const newReview = await Review.create({
      ...req.body,
      userId: req.user._id,
      movieId: foundMovie._id,
    });

    // Add the new review to the movie's reviews array
    foundMovie.reviews.push(newReview);

    // Calculate the new average rating
    const totalRating = foundMovie.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    const averageRate = Number(
      (totalRating / foundMovie.reviews.length).toFixed(1)
    );

    // Update the movie with the new reviews array and the new average rating
    await foundMovie.updateOne({
      $push: { reviews: newReview._id },
      $set: { averageRate },
    });

    res.status(201).json(newReview);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    await Review.findByIdAndUpdate(req.review.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndRemove({ _id: req.review.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

// exports.addReview = async (req, res, next) => {
//   try {
//     const { movieId } = req.params;
//     const foundMovie = await Movie.findById({ _id: movieId }).populate(
//       "reviews"
//     );
//     if (!foundMovie) return next({ status: 404, message: "Movie not found" });
//     if (req.body.rating < 1 || req.body.rating > 10)
//       return next({
//         status: 404,
//         message: "The Rating Should be between 1 - 10",
//       });
//     req.body.userId = req.user._id;
//     req.body.movieId = foundMovie._id;
//     const newReview = await Review.create(req.body);

//     await foundMovie.updateOne({
//       $push: { reviews: newReview._id },
//     });
//     let counter = 0;
//     let total = 0;
//     foundMovie.reviews.push(newReview);
//     foundMovie.reviews.forEach((review) => {
//       if (review.rating >= 0) {
//         total += review.rating;
//         counter++;
//       }
//     });

//     const averageRate = Number((total / counter).toFixed(1));

//     if (foundMovie.reviews.length >= 1) {
//       await foundMovie.updateOne({
//         $set: { averageRate },
//       });
//     } else if (foundMovie.reviews.length == 0) {
//       await foundMovie.updateOne({
//         $set: { averageRate: newReview.rating },
//       });
//     }

//     res.status(201).json(newReview);
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };
