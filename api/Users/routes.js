const express = require("express");
const {
  getUser,
  createUser,

  fetchUser,
  signin,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");

const upload = require("../../middlewares/uploader");
const {
  validationRules,
  validateFields,
} = require("../../middlewares/validateFields");

// Everything with the word user is a placeholder that you'll change in accordance with your project

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.foundUser = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getUser);
router.post(
  "/register",
  validationRules(),
  validateFields,
  upload.single("image"),
  createUser
);
router.post(
  "/signin",

  passport.authenticate("local", { session: false }),
  signin
);
// router.put("/:userId", updateUser);
// router.delete("/:userId", deleteUser);

module.exports = router;
