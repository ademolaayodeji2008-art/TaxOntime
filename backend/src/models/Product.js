const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    category: {
      type: String,
      enum: ['Freebies & E-Books', 'Organizers & Planners', 'Templates', 'Guides & Checklists'],
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    selarUrl: {
      type: String,
      required: [true, 'Selar product URL is required'],
      trim: true,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
