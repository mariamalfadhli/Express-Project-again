const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const WatchlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],

  // create relations in here and in the other model
});

module.exports = model("Watchlist", WatchlistSchema);
