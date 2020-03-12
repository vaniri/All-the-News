const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsSchema = new Schema ({
    headline: String,
    summary: String,
    author: String,
    url: String,
    img:  String
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;