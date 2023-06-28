const Movie = require("../../models/Movie");
const Watchlist = require("../../models/Watchlist");
// Everything with the word movie is a placeholder that you'll change in accordance with your project

exports.fetchMovie = async (movieId, next) => {
  try {
    const movie1 = await Movie.findById(movieId)
      .select("-__v")
      .populate("genres actors.actor reviews", "name text");
    return movie1;
  } catch (error) {
    return next(error);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    // execute query with page and limit values
    const movies = await Movie.find()
      .select("-__v -reviews -actors -createdAt -updatedAt")
      .populate("genres", "name -_id")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    // get total documents in the Posts collection
    const count = await Movie.countDocuments();

    // return response with posts, total pages, and current page
    return res.status(200).json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getByMovieId = async (req, res, next) => {
  try {
    return res.status(200).json(req.movie);
  } catch (error) {
    return next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const newMovie = await Movie.create(req.body);

    res.status(201).json(newMovie);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    await Movie.findByIdAndUpdate(req.movie.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    await Movie.findByIdAndRemove({ _id: req.movie.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const foundWatchlist = await Watchlist.findOne({
      userId: { _id: req.user._id },
    });
    if (!foundWatchlist) {
      await Watchlist.create({ userId: req.user._id, movies: req.movie._id });
    } else if (foundWatchlist) {
      let added = false;
      if (!req.user.isStaff && !req.user._id.equals(foundWatchlist.userId._id))
        return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
      if (foundWatchlist.movies.length > 0) {
        foundWatchlist.movies.forEach((movie) =>
          movie._id.equals(req.movie._id) ? (added = true) : (added = false)
        );
      }

      if (added) {
        await foundWatchlist.updateOne({
          $pull: { movies: req.movie._id },
        });

        return next({
          status: 200,
          message: `movie was succesfully removed from your watchlist`,
        });
      }

      await foundWatchlist.updateOne({
        $push: { movies: req.movie._id },
      });
    }

    res
      .status(201)
      .json({ message: `movie was succesfully added to your watchlist` });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.getWatchlist = async (req, res, next) => {
  try {
    const foundWatchlist = await Watchlist.findOne({
      userId: { _id: req.user._id },
    }).populate("movies", "name");
    if (!foundWatchlist)
      return next({ status: 401, message: "your watchlist is empty" });
    if (!req.user.isStaff && !req.user._id.equals(foundWatchlist.userId._id))
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    res.status(200).json(foundWatchlist);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
