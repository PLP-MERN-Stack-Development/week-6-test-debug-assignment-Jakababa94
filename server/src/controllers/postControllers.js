const Post = require('../models/Post');

// Utility: generate slug
const generateSlug = (title) =>
  title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');


// POST: Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        error: 'Title, content, and category are required',
      });
    }

    const slug = generateSlug(title);

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user.id, // Set via auth middleware
      slug,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};


// GET: Get all posts for a single user (author)
exports.getAllPostsForUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// GET: Get all posts (with optional filtering)
exports.getAllPosts = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};


// GET: Get a specific post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};


// PUT: Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const slug = title ? generateSlug(title) : undefined;

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(slug && { slug }),
    };

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Not authorized to update this post',
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};


// DELETE: Remove a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Not authorized to delete this post',
      });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedPost);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
