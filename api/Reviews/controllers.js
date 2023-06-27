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
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const reviews = await Review.find()
      .select("-__v")
      .populate("movieId userId", "name username");
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: { _id: req.user._id } })
      .select("-__v")
      .populate("movieId userId", "name username");
    if (reviews.length <= 0)
      return res.status(200).json({ message: "you have zero reviews!" });
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    //getting the movie by id
    const { movieId } = req.params;
    const foundMovie = await Movie.findById({ _id: movieId }).populate(
      "reviews"
    );
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });

    /////////////////////////////
    //Checking if the user have reviewed the movie before
    let reviewed = false;
    if (foundMovie.reviews.length > 0) {
      foundMovie.reviews.forEach((review) =>
        review.userId._id.equals(req.user._id)
          ? (reviewed = true)
          : (reviewed = false)
      );
    }

    if (reviewed)
      return next({
        status: 401,
        message: `you have already reviewed ${foundMovie.name}`,
      });
    /////////////////////////////
    //creating a new review
    req.body.userId = req.user._id;
    req.body.movieId = foundMovie._id;
    const newReview = await Review.create(req.body);

    /////////////////////////////
    //calculate the average ratings
    let counter = 0;
    let total = 0;
    foundMovie.reviews.push(newReview);
    foundMovie.reviews.forEach((review) => {
      if (review.rating >= 0) {
        total += review.rating;
        counter++;
      }
    });

    const averageRate = Number((total / counter).toFixed(1));
    /////////////////////////////

    /////////////////////////////
    //adding and pushing to the Database
    await req.user.updateOne({
      $push: { reviews: newReview._id },
    });
    await foundMovie.updateOne({
      $push: { reviews: newReview._id },
    });

    if (foundMovie.reviews.length >= 1) {
      await foundMovie.updateOne({
        $set: { averageRate },
      });
    } else if (foundMovie.reviews.length == 0) {
      await foundMovie.updateOne({
        $set: { averageRate: newReview.rating },
      });
    }
    /////////////////////////////

    res.status(201).json(newReview);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    if (!req.user.isStaff && !req.user._id.equals(req.review.userId._id))
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });

    const updatedReview = await Review.findOneAndUpdate(
      req.review._id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(201).json(updatedReview);
  } catch (error) {
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    if (!req.user.isStaff && !req.user._id.equals(req.review.userId._id))
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });

    await req.review.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

// // optimized verison
// exports.addReview = async (req, res, next) => {
//   try {
//     const { movieId } = req.params;
//     const { rating } = req.body;

//     // Validate rating value
//     if (rating < 1 || rating > 10)
//       return next({
//         status: 404,
//         message: "The Rating Should be between 1 - 10",
//       });

//     // Fetch the movie along with its reviews
//     const foundMovie = await Movie.findById(movieId).populate("reviews");

//     // Handle not found scenario
//     if (!foundMovie) return next({ status: 404, message: "Movie not found" });

//     // Create the new review
//     const newReview = await Review.create({
//       ...req.body,
//       userId: req.user._id,
//       movieId: foundMovie._id,
//     });

//     // Add the new review to the movie's reviews array
//     foundMovie.reviews.push(newReview);

//     // Calculate the new average rating
//     const totalRating = foundMovie.reviews.reduce(
//       (total, review) => total + review.rating,
//       0
//     );
//     const averageRate = Number(
//       (totalRating / foundMovie.reviews.length).toFixed(1)
//     );

//     // Update the movie with the new reviews array and the new average rating
//     await foundMovie.updateOne({
//       $push: { reviews: newReview._id },
//       $set: { averageRate },
//     });

//     res.status(201).json(newReview);
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };
