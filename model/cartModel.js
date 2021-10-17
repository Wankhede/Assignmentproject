const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//cart schema
const cart1Schema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    prod: {
        type: Schema.Types.ObjectId,
        ref: "Book",
    },
});

//exporting module
module.exports = mongoose.model("Cart", cart1Schema);