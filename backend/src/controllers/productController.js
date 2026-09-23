const Product = require('../models/Product');

// GET /api/products — public, active only
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { active: true };
    if (category && category !== 'All') query.category = category;

    const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id — public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.active)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/admin/all — admin only
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products — admin only
const createProduct = async (req, res) => {
  try {
    const { title, description, price, currency, category, coverImage, selarUrl, isFree, featured } =
      req.body;

    if (!title || !description || !category || !selarUrl) {
      return res.status(400).json({ message: 'Title, description, category, and Selar URL are required' });
    }

    const product = await Product.create({
      title,
      description,
      price: isFree ? 0 : price,
      currency: currency || 'NGN',
      category,
      coverImage: coverImage || '',
      selarUrl,
      isFree: isFree || false,
      featured: featured || false,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id — admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id — admin only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
