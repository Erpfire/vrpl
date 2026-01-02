const express = require('express');
const Blog = require('../models/blog');
const Category = require('../models/category');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await Blog.findAll(limit, offset);
    const total = await Blog.getTotalCount();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

router.get('/posts/:slug', async (req, res) => {
  try {
    const post = await Blog.findBySlug(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    if (!post.published) {
      return res.status(403).json({
        success: false,
        error: 'Post is not published'
      });
    }

    await Blog.incrementViewCount(post.id);

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

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

router.get('/categories/:slug', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await Blog.findByCategory(req.params.slug, limit, offset);

    res.json({
      success: true,
      data: {
        category: req.params.slug,
        posts,
        pagination: {
          page,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get category posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category posts'
    });
  }
});

router.get('/tags/:tag', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await Blog.findByTag(req.params.tag, limit, offset);

    res.json({
      success: true,
      data: {
        tag: req.params.tag,
        posts,
        pagination: {
          page,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Get tag posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tag posts'
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await Blog.search(query, limit, offset);

    res.json({
      success: true,
      data: {
        query,
        posts,
        pagination: {
          page,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const post = await Blog.getFeatured();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'No featured post found'
      });
    }

    res.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Get featured post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured post'
    });
  }
});

module.exports = router;
