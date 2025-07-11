const mongoose = require ('mongoose');

const postSchema = new mongoose.Schema({
    tittle: { type: String, required: [true, 'Please provide a title']},
    content: { type: String, required: [true, 'Please provide content']},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    category: { type: String, required: true },
    slug: { type: String, unique: true, },
})

module.exports = mongoose.model('Post', postSchema);