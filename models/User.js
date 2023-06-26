const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: {
    type: String,
    default: "media/photo-1608848461950-0fe51dfc41cb.jpg",
  },
  isStaff: { type: Boolean, default: false },
  // movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  // create relations in here and in the other model
});

module.exports = model("User", UserSchema);
