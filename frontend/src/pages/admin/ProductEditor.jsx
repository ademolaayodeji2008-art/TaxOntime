import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const categories = ['Freebies & E-Books', 'Organizers & Planners', 'Templates', 'Guides & Checklists'];

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'NGN',
    category: 'Freebies & E-Books',
    coverImage: '',
    selarUrl: '',
    isFree: false,
    featured: false,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setForm({
          title: p.title,
          description: p.description,
          price: p.price,
          currency: p.currency,
          category: p.category,
          coverImage: p.coverImage || '',
          selarUrl: p.selarUrl,
          isFree: p.isFree,
          featured: p.featured,
          active: p.active,
        });
      } catch { toast.error('Failed to load product.'); navigate('/admin/products'); }
      finally { setFetching(false); }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.selarUrl) {
      return toast.error('Title, description, category, and Selar URL are required.');
    }
    setLoading(true);
    try {
      const payload = { ...form, price: form.isFree ? 0 : Number(form.price) };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-heading font-bold text-2xl text-gray-900">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="e.g., 2024 Tax Planner for SMEs" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="input resize-none" placeholder="Describe what this product contains and who it's for..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Selar Product URL <span className="text-red-500">*</span>
                </label>
                <input name="selarUrl" value={form.selarUrl} onChange={handleChange} className="input" placeholder="https://selar.co/your-product" required />
                <p className="text-xs text-gray-400 mt-1">Visitors will be redirected to this URL when they click "Buy Now"</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Save</h3>
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <Save size={15} />}
                {isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900">Product Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select name="category" value={form.category} onChange={handleChange} className="input text-sm">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    disabled={form.isFree}
                    className="input text-sm disabled:opacity-50"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                  <select name="currency" value={form.currency} onChange={handleChange} className="input text-sm">
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image URL</label>
                <input name="coverImage" value={form.coverImage} onChange={handleChange} className="input text-sm" placeholder="https://..." />
                {form.coverImage && (
                  <img src={form.coverImage} alt="Preview" className="mt-2 w-full aspect-video object-cover rounded-lg" />
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {[
                  { name: 'isFree', label: 'Free Product', desc: 'Price will be set to 0' },
                  { name: 'featured', label: 'Featured', desc: 'Show prominently on products page' },
                  { name: 'active', label: 'Active / Visible', desc: 'Show on the public website' },
                ].map(({ name, label, desc }) => (
                  <label key={name} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name={name}
                      checked={form[name]}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-brand-green"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
