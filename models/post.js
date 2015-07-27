var Mongoose = require("mongoose");

var postSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    md: {
        type: String,
        required: true
    },
    html: {
        type: String
    },
    tags: [String],
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    images: [{
        type: String, trim: true
    }]
});

module.exports = Mongoose.model("post", postSchema);
