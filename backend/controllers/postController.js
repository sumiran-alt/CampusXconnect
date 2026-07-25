const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

// @desc    Create a post
// @route   POST /api/posts/createPost
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, description, techStack, githubLink } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please provide title and description" });
    }

    const post = await Post.create({
      title,
      description,
      techStack: techStack || [],
      githubLink: githubLink || "",
      author: req.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate("author");

    res.status(201).json({
      success: true,
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts/feed
// @access  Public
exports.getFeed = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author")
      .populate("comments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   POST /api/posts/like/:id
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already liked this post" });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unlike a post
// @route   POST /api/posts/unlike/:id
// @access  Private
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/comment/:id
// @access  Private
exports.commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Please provide comment content" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: req.params.id,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
    );

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/comments/:id
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("author")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const { title, description, techStack, githubLink } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this post" });
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (techStack) post.techStack = techStack;
    if (githubLink) post.githubLink = githubLink;
    post.updatedAt = Date.now();

    await post.save();

    post = await Post.findById(post._id)
      .populate("author")
      .populate("comments");

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
