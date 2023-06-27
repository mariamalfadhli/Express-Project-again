const User = require("../../models/User");
const passHash = require("../../utils/auth/passhash");
const generateToken = require("../../utils/auth/generateToken");

// Everything with the word user is a placeholder that you'll change in accordance with your project

exports.fetchUser = async (userId, next) => {
  try {
    const user1 = await User.findById(userId);
    return user1;
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (!req.user.isStaff)
      return next({ status: 401, message: "La tsthbl ent mo admin!!!" });
    const users = await User.find().select("-__v");
    return res.status(200).json(users);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    const { password } = req.body;
    req.body.password = await passHash(password);

    req.body.isStaff = false;

    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.signin = async (req, res, next) => {
  try {
    console.log(req.user);
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (error) {
    return next({ status: 401, message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.foundUser.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndRemove({ _id: req.foundUser.id });
    return res.status(204).end();
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
