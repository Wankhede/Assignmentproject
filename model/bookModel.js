const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//book schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  }
});

//exporting module
module.exports = mongoose.model("Book", bookSchema);