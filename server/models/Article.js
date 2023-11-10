const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  sportType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: { type: Array },
});

module.exports = mongoose.model("Article", ArticleSchema);
