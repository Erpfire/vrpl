const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/blog');
const authMiddleware = require('../middleware/auth');
const { uploadSingle, handleMulterError } = require('../middleware/upload');
const { sanitizeHtmlContent } = require('../utils/sanitize');

const router = express.Router();

router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Blog.findAllAdmin();
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

router.get('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post'
    });
  }
});

router.post('/posts', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional(),
  body('category_id').optional().isInt().withMessage('Invalid category'),
  body('tags').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, excerpt, content, category_id, tags, featured, published } = req.body;

    let slug = Blog.generateSlug(title);

    const existingPost = await Blog.findBySlug(slug);
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }


    const sanitizedContent = sanitizeHtmlContent(content);

    const postData = {
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content: sanitizedContent,
      category_id: category_id || null,
      tags: tags || [],
      featured: featured || false,
      published: published || false,
      author_id: req.admin.id
    };

    const newPost = await Blog.create(postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

router.put('/posts/:id', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional(),
  body('category_id').optional().isInt().withMessage('Invalid category'),
  body('tags').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const { title, excerpt, content, category_id, tags, featured, published, cover_image } = req.body;

    let slug = Blog.generateSlug(title);

    if (post.slug !== slug) {
      const existingPost = await Blog.findBySlug(slug);
      if (existingPost && existingPost.id !== parseInt(req.params.id)) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const sanitizedContent = sanitizeHtmlContent(content);

    const postData = {
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content: sanitizedContent,
      cover_image,
      category_id: category_id || null,
      tags: tags || [],
      featured: featured || false,
      published: published || false
    };

    const updatedPost = await Blog.update(req.params.id, postData);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update post'
    });
  }
});

router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    await Blog.delete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post'
    });
  }
});

router.patch('/posts/:id/publish', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const { published } = req.body;

    await Blog.update(req.params.id, {
      ...post,
      published
    });

    res.json({
      success: true,
      message: `Post ${published ? 'published' : 'unpublished'} successfully`,
      data: { published }
    });

  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update publish status'
    });
  }
});

router.patch('/posts/:id/feature', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const { featured } = req.body;

    await Blog.update(req.params.id, {
      ...post,
      featured
    });

    res.json({
      success: true,
      message: `Post ${featured ? 'featured' : 'unfeatured'} successfully`,
      data: { featured }
    });

  } catch (error) {
    console.error('Feature post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update featured status'
    });
  }
});

router.post('/upload', authMiddleware, uploadSingle, handleMulterError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/blog/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

module.exports = router;
