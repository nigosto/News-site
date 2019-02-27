const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema(
    {
        title: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        image: {
            type: Schema.Types.String,
            required: true
        },
        bodyText: {
            type: Schema.Types.String,
            required: true
        },
        video: {
            type: Schema.Types.String
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        likes: {
            type: Schema.Types.Number,
            default: 0
        },
        dislikes: {
            type: Schema.Types.Number,
            default: 0
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        isApproved: {
            type: Schema.Types.Boolean,
            default: false,
            required: true
        }
    }
)


const Article = mongoose.model('Article', articleSchema)

module.exports = Article