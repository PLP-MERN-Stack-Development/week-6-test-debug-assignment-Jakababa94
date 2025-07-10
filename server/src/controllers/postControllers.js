const Post = require('../models/Post');

// POST: Create a new post
exports.createPost = async (req, res) => {
  console.log(req.body);
  try {
    const { title, content, category, tags, author } = req.body; 
    const slug = title.toLowerCase().replace(/ /g, '-');
    const featuredImage = req.file ? req.file.filename : 'default-post.jpg';

    const newPost = new Post({
      title,
      content,
      category,
      author: req.user.id, // Assuming req.user is set by auth middleware
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage,
      slug,
      excerpt: content.substring(0, 200),
    });

    await newPost.save();
    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// GET /api/posts: Get all blog posts for a single user

exports.getAllPostsForUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });
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

// GET /api/posts: Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// GET /api/posts/:id: Get a specific blog post
exports.getPostById = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
      res.status(200).json({
        success: true,
        data: post,
      });
    })
    .catch(error => {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    });
};

// PUT /api/posts/:id: Update an existing blog post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-');
    const featuredImage = req.file ? req.file.filename : undefined;

    const updateData = {
      title,
      content,
      slug,
      excerpt: content.substring(0, 200),
    };

    if (featuredImage) {
      updateData.featuredImage = featuredImage;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// DELETE /api/posts/:id: Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }
    res.status(200).json({
      success: true,
      data: deletedPost,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
