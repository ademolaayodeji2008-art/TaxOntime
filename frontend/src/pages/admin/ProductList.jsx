import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/admin/all');
      setProducts(res.data);
    } catch { toast.error('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted.');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { toast.error('Failed to delete product.'); }
  };

  const formatPrice = (price, currency, isFree) => {
    if (isFree || price === 0) return 'FREE';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency || 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> New Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400">No products yet.</p>
          <Link to="/admin/products/new" className="btn-primary mt-4 inline-flex text-sm">
            <Plus size={15} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Cover */}
              <div className="aspect-video bg-gray-900 relative">
                {product.coverImage ? (
                  <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">No Image</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.featured && (
                    <span className="flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      <Star size={9} fill="currentColor" /> Featured
                    </span>
                  )}
                  {!product.active && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">{product.title}</p>
                <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                <p className="text-brand-green font-bold text-lg mb-3">
                  {formatPrice(product.price, product.currency, product.isFree)}
                </p>

                <div className="flex items-center gap-2">
                  <a
                    href={product.selarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-colors"
                    title="View on Selar"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.title)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
