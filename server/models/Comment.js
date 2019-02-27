const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bodyText: {
        type: Schema.Types.String,
        required: true
    },
    dateOfCreation: {
        type: Schema.Types.Date,
        required: true,
        default: Date.now()
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment