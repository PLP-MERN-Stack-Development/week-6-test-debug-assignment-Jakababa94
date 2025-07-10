const mongoose = require ('mongoose');

const PostSchema = new mongoose.Schema({
    tittle: { type: String, required: [true, 'Please provide a title']},
    content: { type: String, required: [true, 'Please provide content']},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    category: { type: mongoose.Types.ObjectId(), required: true },
    slug: { type: String, unique: true, },
})