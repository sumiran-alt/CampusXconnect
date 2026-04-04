const Community = require("../models/Community");
const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");

// @desc    Create community
// @route   POST /api/communities
// @access  Private
exports.createCommunity = async (req, res) => {
  try {
    const { name, description, category, icon, banner, rules, tags, isPrivate } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const community = await Community.create({
      name,
      description,
      category: category || "other",
      icon,
      banner,
      rules: rules || [],
      tags: tags || [],
      isPrivate: isPrivate || false,
      createdBy: req.user.id,
      moderators: [req.user.id],
      members: [
        {
          userId: req.user.id,
          role: "admin",
        },
      ],
    });

    const populatedCommunity = await community.populate("createdBy", "name profilePicture");

    res.status(201).json({
      success: true,
      message: "Community created successfully",
      community: populatedCommunity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all communities
// @route   GET /api/communities?category=ai_ml&page=1
// @access  Public
exports.getCommunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    const filters = { status: "active" };
    if (category) filters.category = category;

    const communities = await Community.find(filters)
      .sort({ memberCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name profilePicture");

    const total = await Community.countDocuments(filters);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      communities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get community by slug
// @route   GET /api/communities/:slug
// @access  Public
exports.getCommunity = async (req, res) => {
  try {
    const { slug } = req.params;

    const community = await Community.findOne({ slug })
      .populate("createdBy", "name profilePicture")
      .populate("moderators", "name profilePicture");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({
      success: true,
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Join community
// @route   POST /api/communities/:communityId/join
// @access  Private
exports.joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isMember = community.members.some(
      (m) => m.userId.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({ message: "You are already a member" });
    }

    community.members.push({
      userId: req.user.id,
      role: "member",
    });
    community.memberCount = community.members.length;

    await community.save();

    res.status(200).json({
      success: true,
      message: "Joined community successfully",
      memberCount: community.memberCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Leave community
// @route   POST /api/communities/:communityId/leave
// @access  Private
exports.leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.members = community.members.filter(
      (m) => m.userId.toString() !== req.user.id
    );
    community.memberCount = community.members.length;

    await community.save();

    res.status(200).json({
      success: true,
      message: "Left community successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create community post
// @route   POST /api/communities/:communityId/posts
// @access  Private
exports.createCommunityPost = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, content, type, tags, attachments } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Check if user is member
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isMember = community.members.some(
      (m) => m.userId.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(401).json({ message: "You must be a member to post" });
    }

    const post = await CommunityPost.create({
      communityId,
      author: req.user.id,
      title,
      content,
      type: type || "discussion",
      tags: tags || [],
      attachments: attachments || [],
    });

    community.stats.totalPosts += 1;
    await community.save();

    const populatedPost = await post.populate(
      "author",
      "name profilePicture"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get community posts
// @route   GET /api/communities/:communityId/posts?page=1
// @access  Public
exports.getCommunityPosts = async (req, res) => {
  try {
    const { communityId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find({
      communityId,
      status: "published",
    })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name profilePicture");

    const total = await CommunityPost.countDocuments({
      communityId,
      status: "published",
    });

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like community post
// @route   POST /api/communities/posts/:postId/like
// @access  Private
exports.likeCommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const liked = post.likes.includes(req.user.id);

    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likes.push(req.user.id);
      post.likesCount += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: liked ? "Like removed" : "Post liked",
      liked: !liked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/communities/posts/:postId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await CommunityComment.create({
      postId,
      author: req.user.id,
      content,
    });

    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    const populatedComment = await comment.populate(
      "author",
      "name profilePicture"
    );

    res.status(201).json({
      success: true,
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get post comments
// @route   GET /api/communities/posts/:postId/comments
// @access  Public
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await CommunityComment.find({ postId })
      .sort({ isAnswer: -1, likesCount: -1, createdAt: -1 })
      .populate("author", "name profilePicture");

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
