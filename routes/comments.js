const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/posts/:slug/comments', async (req, res) => {
  try {
    const post = await Blog.findBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const comments = await Comment.findByPostId(post.id, true);

    res.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
});

router.post('/posts/:slug/comments', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 10, max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const post = await Blog.findBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const { name, email, comment } = req.body;

    const newComment = await Comment.create({
      post_id: post.id,
      name,
      email,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully and is awaiting approval',
      data: newComment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit comment'
    });
  }
});

router.get('/admin/comments', authMiddleware, async (req, res) => {
  try {
    const pending = await Comment.findAllPending();
    const approved = await Comment.findAllApproved();

    res.json({
      success: true,
      data: {
        pending,
        approved
      }
    });

  } catch (error) {
    console.error('Get admin comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
});

router.patch('/admin/comments/:id/approve', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.approve(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment approved successfully',
      data: comment
    });

  } catch (error) {
    console.error('Approve comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve comment'
    });
  }
});

router.delete('/admin/comments/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.delete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment'
    });
  }
});

module.exports = router;
