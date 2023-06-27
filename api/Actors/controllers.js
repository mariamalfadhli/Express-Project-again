const Actor = require("../../models/Actor");
const Movie = require("../../models/Movie");

// Everything with the word actor is a placeholder that you'll change in accordance with your project

exports.fetchActor = async (actorId, next) => {
  try {
    const actor1 = await Actor.findById(actorId);
    return actor1;
  } catch (error) {
    return next(error);
  }
};

exports.getActor = async (req, res, next) => {
  try {
    const actors = await Actor.find().select("-__v").populate("movies", "name");
    return res.status(200).json(actors);
  } catch (error) {
    return next(error);
  }
};

exports.createActor = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const newActor = await Actor.create(req.body);

    res.status(201).json(newActor);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.updateActor = async (req, res, next) => {
  try {
    await Actor.findByIdAndUpdate(req.actor.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.deleteActor = async (req, res, next) => {
  try {
    await Actor.findByIdAndRemove({ _id: req.actor.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.addActorToMovie = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const { movieId } = req.params;
    const foundMovie = await Movie.findById({ _id: movieId });
    if (!foundMovie) return next({ status: 404, message: "Movie not found" });
    await foundMovie.updateOne({
      $push: { actors: { actor: req.actor._id, role: req.body.role } },
    });
    await req.actor.updateOne({ $push: { movies: foundMovie._id } });
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};
