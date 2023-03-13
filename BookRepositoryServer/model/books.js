const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
    bookId: { type: String, unique: true },
    title: { type: String, default: null },
    author: { type: String, default: null } 
});

module.exports = mongoose.model("books", booksSchema);
