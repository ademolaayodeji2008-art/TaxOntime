const Blog = require('../models/Blog');

// GET /api/blogs — public, returns only published posts
const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, search } = req.query;
    const query = { published: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/:slug — public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/admin/all — admin only, returns all posts
const getAllBlogsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    res.json({ blogs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/admin/:id — admin only
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/blogs — admin only
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, published, coverImage, author } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: 'Title, excerpt, and content are required' });
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      published: published || false,
      coverImage: coverImage || '',
      author: author || 'Zarat Ranti L.',
    });

    res.status(201).json({ message: 'Blog post created', blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A post with this title already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/blogs/:id — admin only
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post updated', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/blogs/:id — admin only
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/blogs/:id/publish — toggle publish
const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    blog.published = !blog.published;
    await blog.save();

    res.json({ message: `Post ${blog.published ? 'published' : 'unpublished'}`, blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
};
