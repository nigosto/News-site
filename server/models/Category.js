const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    articles: [{
        type: Schema.Types.ObjectId,
        ref: 'Article',
    }]
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category