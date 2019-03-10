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
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        isApproved: {
            type: Schema.Types.Boolean,
            default: false,
            required: true
        },
        creationDate: {
            type: Schema.Types.Date,
            default: Date.now(),
            required: true
        }
    }
)


const Article = mongoose.model('Article', articleSchema)

module.exports = Article