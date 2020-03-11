const express = require('express');
const mongoose = reuire('mangoos');
const db = require('/models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    console.log(res);
    res.json({});
})

app.listen(process.env.PORT || 3000, () => {
    console.log('app listening at http://localhost:3000');
})