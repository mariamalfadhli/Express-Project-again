const Movie = require("../../models/Movie");

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

exports.getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find()
      .select("-__v -reviews -actors -createdAt -updatedAt")
      .populate("genres", "name -_id");
    return res.status(200).json(movies);
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
