const express = require("express");
const {
  getActor,
  createActor,
  updateActor,
  deleteActor,
  fetchActor,
  addActorToMovie,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");

// Everything with the word actor is a placeholder that you'll change in accordance with your project

router.param("actorId", async (req, res, next, actorId) => {
  try {
    const foundActor = await fetchActor(actorId);
    if (!foundActor) return next({ status: 404, message: "Actor not found" });
    req.actor = foundActor;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getActor);
router.post("/", passport.authenticate("jwt", { session: false }), createActor);
router.put("/:actorId", updateActor);
router.delete("/:actorId", deleteActor);
router.put(
  "/:actorId/:movieId",
  passport.authenticate("jwt", { session: false }),
  addActorToMovie
);

module.exports = router;
