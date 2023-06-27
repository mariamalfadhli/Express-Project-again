const Genre = require("../../models/Genre");
const Movie = require("../../models/Movie");

// Everything with the word genre is a placeholder that you'll change in accordance with your project

exports.fetchGenre = async (genreId, next) => {
  try {
    const genre1 = await Genre.findById(genreId);
    return genre1;
  } catch (error) {
    return next(error);
  }
};

exports.getGenre = async (req, res, next) => {
  try {
    const genres = await Genre.find().select("-__v").populate("movies", "name");
    return res.status(200).json(genres);
  } catch (error) {
    return next(error);
  }
};

exports.createGenre = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const newGenre = await Genre.create(req.body);
    res.status(201).json(newGenre);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.updateGenre = async (req, res, next) => {
  try {
    await req.genre.updateOne(req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteGenre = async (req, res, next) => {
  try {
    await req.genre.deleteOne();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addGenreToMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const { movieId } = req.params;
    const foundMovie = await Movie.findById({ _id: movieId });
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    await foundMovie.updateOne({ $push: { genres: req.genre._id } });
    await req.genre.updateOne({ $push: { movies: foundMovie._id } });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};
