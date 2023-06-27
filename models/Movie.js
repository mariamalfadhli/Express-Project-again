const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const MovieSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    averageRate: { type: Number, default: 0 },
    releaseDate: { type: Date, required: true },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    actors: [
      {
        role: { type: String, default: "cast member" },
        actor: { type: Schema.Types.ObjectId, ref: "Actor" },
      },
    ],
    genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],

    // create relations in here and in the other model
  },
  { timestamps: true }
);

module.exports = model("Movie", MovieSchema);
