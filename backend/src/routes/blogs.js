const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/post/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, getAllBlogsAdmin);
router.get('/admin/:id', protect, getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.patch('/:id/publish', protect, togglePublish);

module.exports = router;
