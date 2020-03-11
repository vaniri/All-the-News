const mongoose = require('mangoose');
const { Shema } = mangoose;

const NewsShema = new Shema ({
    headline: String,
    summary: String,
    author: String,
    url: String,
    img:  String 
});

const News = mangoose.model('News', NewsShema);

model.exports = News;