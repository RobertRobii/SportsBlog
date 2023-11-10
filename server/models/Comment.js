const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  username: String,
  content: String,
});

module.exports = mongoose.model("Comment", CommentSchema);
