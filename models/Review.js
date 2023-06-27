const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const ReviewSchema = new Schema({
  rating: { type: Number },
  text: { type: String, required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },

  // create relations in here and in the other model
},
{ timestamps: true });

module.exports = model("Review", ReviewSchema);
