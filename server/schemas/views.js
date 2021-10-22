const   mongoose = require("mongoose"),
        Schema = mongoose.Schema;

module.exports.viewsSchema = new Schema({
    comicNumber: Number, 
    numberOfViews: Number
})
