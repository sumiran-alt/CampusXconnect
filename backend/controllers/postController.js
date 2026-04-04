const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

// Helper function to check if user can view post based on privacy
const canViewPost = async (post, userId) => {
  // If public, everyone can view
  if (post.privacy === "public") {
    return true;
  }

  // If private, only author can view
  if (post.privacy === "private") {
    return post.author.toString() === userId;
  }

  // If connections, check if users are connected
  if (post.privacy === "connections") {
    if (post.author.toString() === userId) {
      return true; // Author can always see their own post
    }

    const author = await User.findById(post.author);
    const viewer = await User.findById(userId);

    // Check if they are connected (bidirectional follow or connection)
    const isConnected =
      author.following?.includes(userId) &&
      viewer.following?.includes(post.author.toString());

    return isConnected;
  }

  return false;
};

// @desc    Create a post
// @route   POST /api/posts/createPost
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, privacy } = req.body;

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
      privacy: privacy || "public", // default to public
      author: req.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate("author");

    res.status(201).json({
      success: true,
      post: populatedPost,
      message: `Post created with ${privacy || "public"} privacy`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (Feed) with privacy filtering
// @route   GET /api/posts/feed
// @access  Private
exports.getFeed = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const userId = req.user?.id;

    // Get all posts
    let posts = await Post.find()
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .sort({ createdAt: -1 });

    // Filter posts based on privacy and user
    const visiblePosts = [];

    for (const post of posts) {
      const canView = await canViewPost(post, userId);
      if (canView) {
        visiblePosts.push(post);
      }
    }

    // Apply pagination to filtered results
    const paginatedPosts = visiblePosts.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(visiblePosts.length / limit),
        totalPosts: visiblePosts.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID with privacy check
// @route   GET /api/posts/:id
// @access  Private
exports.getPostById = async (req, res) => {
  try {
    const userId = req.user?.id;
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

    // Check privacy
    const canView = await canViewPost(post, userId);
    if (!canView) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this post" });
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

    // Check privacy
    const canView = await canViewPost(post, req.user.id);
    if (!canView) {
      return res
        .status(403)
        .json({ message: "Not authorized to like this post" });
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

    // Check privacy
    const canView = await canViewPost(post, req.user.id);
    if (!canView) {
      return res
        .status(403)
        .json({ message: "Not authorized to comment on this post" });
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: req.params.id,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author"
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
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check privacy
    const canView = await canViewPost(post, req.user.id);
    if (!canView) {
      return res
        .status(403)
        .json({ message: "Not authorized to view comments on this post" });
    }

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

// @desc    Delete a post (User can delete own, Admin can delete any)
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check authorization: author or admin
    const isAuthor = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Not authorized to delete this post",
        });
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: req.params.id });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      deletedBy: isAdmin && !isAuthor ? "admin" : "author",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a post (User can update own, Admin can update any)
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, privacy } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check authorization: author or admin
    const isAuthor = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Not authorized to update this post",
        });
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (techStack) post.techStack = techStack;
    if (githubLink) post.githubLink = githubLink;
    if (privacy && ["public", "private", "connections"].includes(privacy)) {
      post.privacy = privacy;
    }
    post.updatedAt = Date.now();

    await post.save();

    post = await Post.findById(post._id)
      .populate("author")
      .populate("comments");

    res.status(200).json({
      success: true,
      post,
      updatedBy: isAdmin && !isAuthor ? "admin" : "author",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own posts
// @route   GET /api/posts/my-posts
// @access  Private
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalPosts = await Post.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get posts by a specific user (for profile page)
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPostsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const currentUserId = req.user?.id;

    const posts = await Post.find({ author: userId })
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Filter posts based on privacy settings
    const visiblePosts = [];
    for (const post of posts) {
      const canView = await canViewPost(post, currentUserId);
      if (canView) {
        visiblePosts.push(post);
      }
    }

    const totalPosts = await Post.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      posts: visiblePosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
