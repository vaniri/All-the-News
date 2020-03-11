const mangoose = require('mangoose');
const { Shema } = mangoose;

const CommentShema = new Shema ({
    nickname: {
        type: String,
        trim: true,
        unique: true,
        reqquire: 'Username is required'
    },
    message: {
        type: String
    }
});

const Comment = mangoose.model('Coment', CommentShema);

module.export = Comment;