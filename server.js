const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const mongoose = require('mongoose');
const db = require('./models');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
let Parser = require('rss-parser');
let parser = new Parser();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/news', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            console.log(req.body);
            req.body.password = await argon2.hash(req.body.password);
            let result = await db.User.create(req.body);
            let UserId = result.id;
            res.json({ message: "OK", result, userId: UserId, token: makeToken(UserId) });
        } catch (err) {
            console.log("Error creating new user", err);
            res.json({ message: "FAIL", reason: err });
        }
    });


const jwtSecret = "yo dawg i herd you like authorization";

function makeToken(userId) {
    return jwt.sign({ userId }, jwtSecret);
}

app.post('/login',
    async (req, res) => {
        try {
            let user = await db.User.findOne({ username: req.body.username });
            console.log(user);
            if (!user) {
                console.log("No user found!");
                res.json({ message: "FAIL", reason: "No user found" });
                return;
            }

            let passwordMatches = await argon2.verify(user.password, req.body.password);
            if (!passwordMatches) {
                console.log("Wrong password!");
                res.json({ message: "FAIL", reason: "Wrong password!" });
                return;
            }

            console.log("Login Successful!");
            res.json({ message: "OK", userId: user.id, token: makeToken(user.id) });
        } catch (err) {
            console.log("Error logging in:", err);
            res.json({ message: "FAIL", reason: err });
        }
    })

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
    .post(
        expressJwt({ secret: jwtSecret }),
        async (req, res) => {
            try {
                let result = await db.Comment.create({ ...req.body, author: req.user.userId });
                res.json({ message: "OK", result });
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

