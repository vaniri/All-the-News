const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const mongoose = require('mongoose');
const db = require('./models');
let Parser = require('rss-parser');
let parser = new Parser();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/news', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

//render main html page
app.get("/", async (req, res) => {
    res.render("index", {});
});


//app routes
app.route('/news')
    .get(async (req, res) => {
        try {
            let result = await db.News.find().lean();
            res.render("news", { news: result });
        } catch (err) {
            console.log("Error find news", err);
            res.json({ message: "FAIL", reason: err });
        }
    })

app.route('/user')
    .get(async (req, res) => {
        try {
            let result = await db.User.find();
            res.json({ result });
        } catch (err) {
            console.log("Error find user", err);
            res.json({ message: "FAIL", reason: err });
        }
    })
    .post(async (req, res) => {
        try {
            let result = await db.User.create(req.body);
            res.json({ result });
        } catch (err) {
            console.log("Error creating new user", err);
            res.json({ message: "FAIL", reason: err });
        }
    });

app.route('/comments')
    .get(async (req, res) => {
        try {
            let result = await db.Comment.find();
            res.json({ result });
        } catch (err) {
            console.log("Error find comments", err);
            res.json({ message: "FAIL", reason: err });
        }
    })
    .post(async (req, res) => {
        try {
            let result = await db.Comment.create(req.body);
            res.json({ result });
        } catch (err) {
            console.log("Error creating comments", err);
            res.json({ message: "FAIL", reason: err });
        }
    });

app.route('/comments/:id')
    .get(async (req, res) => {
        try {
            let result = await db.Comment.find({ newsItem: req.params.id });
            res.json({ result });
        } catch (err) {
            console.log("Error find comments", err);
            res.json({ message: "FAIL", reason: err });
        }
    })

async function getNews() {
    try {
        let news = await parser.parseURL('http://feeds.foxnews.com/foxnews/latest');
        news.items.forEach(async (item) => {
            try {
                await db.News.create({ "headline": item.title, "author": item.creator, "pubDate": item.pubDate, "summary": item.contentSnippet, "url": item.link });
                console.log(item);
            } catch (err) {
                if (err.code !== 11000) { //11000 is the duplicate key error code
                    throw err;
                }
            }
        });
    } catch (err) {
        console.log("Error find comments", err);
        res.json({ message: "FAIL", reason: err });
    }
}

getNews();

app.listen(process.env.PORT || 3000, () => {
    console.log('app listening at http://localhost:3000');
});

