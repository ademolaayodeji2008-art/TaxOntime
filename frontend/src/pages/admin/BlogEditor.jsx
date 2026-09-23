import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const categories = ['Tax Tips', 'Business', 'Compliance', 'News', 'Guides', 'General'];

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    tags: '',
    coverImage: '',
    author: 'Zarat Ranti L.',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/blogs/admin/${id}`);
        const b = res.data;
        setForm({
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          category: b.category,
          tags: b.tags?.join(', ') || '',
          coverImage: b.coverImage || '',
          author: b.author,
          published: b.published,
        });
      } catch { toast.error('Failed to load post.'); navigate('/admin/blogs'); }
      finally { setFetching(false); }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e, publish = null) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      return toast.error('Title, excerpt, and content are required.');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: publish !== null ? publish : form.published,
      };
      if (isEdit) {
        await api.put(`/blogs/${id}`, payload);
        toast.success('Post updated!');
      } else {
        await api.post('/blogs', payload);
        toast.success(payload.published ? 'Post published!' : 'Draft saved!');
      }
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post.');
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
        <Link to="/admin/blogs" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            {isEdit ? 'Edit Post' : 'New Blog Post'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input text-lg font-semibold"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Excerpt / Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="input resize-none"
                  placeholder="A brief summary shown on the blog listing page..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;)
                </p>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={20}
                  className="input resize-y font-mono text-sm"
                  placeholder="Write your full blog post here. You can use HTML for formatting..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-gray-300 transition-colors"
                >
                  <Save size={15} />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="w-full btn-primary justify-center py-2.5 text-sm"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Eye size={15} />
                  )}
                  Publish Now
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900">Post Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input text-sm">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  className="input text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="VAT, compliance, SME"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image URL</label>
                <input
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  className="input text-sm"
                  placeholder="https://..."
                />
                {form.coverImage && (
                  <img src={form.coverImage} alt="Cover preview" className="mt-2 w-full aspect-video object-cover rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
