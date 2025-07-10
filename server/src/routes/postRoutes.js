const express = require('express');
const { createPost, getAllPostsForUser, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postControllers');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/', protect, createPost);
router.get('/user', getAllPostsForUser); 
router.get('/', getAllPosts);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
