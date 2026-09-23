import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs/admin/all?limit=100');
      setBlogs(res.data.blogs);
    } catch { toast.error('Failed to load blog posts.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Post deleted.');
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch { toast.error('Failed to delete post.'); }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.patch(`/blogs/${id}/publish`);
      toast.success(res.data.message);
      setBlogs((prev) => prev.map((b) => b._id === id ? { ...b, published: res.data.blog.published } : b));
    } catch { toast.error('Failed to update post.'); }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm">{blogs.length} total posts</p>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 py-2 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400">No posts found.</p>
          <Link to="/admin/blogs/new" className="btn-primary mt-4 inline-flex text-sm">
            <Plus size={15} /> Create First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{blog.title}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{blog.category}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleTogglePublish(blog._id)}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                        className={`p-2 rounded-lg transition-colors ${
                          blog.published
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {blog.published ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
