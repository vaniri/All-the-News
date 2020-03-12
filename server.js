const express = require('express');
const mongoose = require('mongoose');
const db = require('./models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/news', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.route('/news')
    .get(async (req, res) => {
        try {
            let result = await db.News.find();
            res.json({ result });
        } catch (err) {
            console.log("Error find news", err);
            res.json({ message: "FAIL", reason: err });
        }
    })
    .post(async (req, res) => {
        try {
            let result = await db.News.create(req.body);
            res.json({ result });
        } catch (err) {
            console.log("Error creating news", err);
            res.json({ message: "FAIL", reason: err });
        }
    });

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


app.listen(process.env.PORT || 3000, () => {
    console.log('app listening at http://localhost:3000');
});