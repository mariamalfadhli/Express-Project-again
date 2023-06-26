const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MovieSchema = new Schema({
  name: { type: String, unique: true, required: true },
  releaseDate: { type: Date, required: true },
  // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  actors: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],

  // create relations in here and in the other model
});

module.exports = model("Movie", MovieSchema);
