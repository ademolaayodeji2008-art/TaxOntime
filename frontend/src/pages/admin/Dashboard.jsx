import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ShoppingBag, Mail, MessageSquare, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -3 }}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <Link to={to} className="text-gray-400 hover:text-brand-green transition-colors">
        <ArrowRight size={16} />
      </Link>
    </div>
    <p className="text-3xl font-heading font-bold text-gray-900">{value ?? '—'}</p>
    <p className="text-gray-500 text-sm mt-1">{label}</p>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [blogs, products, newsletter, contacts] = await Promise.all([
          api.get('/blogs/admin/all?limit=5'),
          api.get('/products/admin/all'),
          api.get('/newsletter/subscribers'),
          api.get('/contact?limit=5'),
        ]);
        setStats({
          blogs: blogs.data.total,
          products: products.data.length,
          subscribers: newsletter.data.total,
          unread: contacts.data.unreadCount,
          contacts: contacts.data.total,
        });
        setRecentContacts(contacts.data.contacts.slice(0, 5));
        setRecentBlogs(blogs.data.blogs.slice(0, 5));
      } catch {}
    };
    fetchAll();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome to your TaxonTime.Ng admin panel</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/blogs/new" className="btn-primary text-sm py-2 px-4">
            <Plus size={15} /> New Post
          </Link>
          <Link to="/admin/products/new" className="btn-outline text-sm py-2 px-4">
            <Plus size={15} /> New Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Blog Posts" value={stats.blogs} color="bg-blue-500" to="/admin/blogs" delay={0} />
        <StatCard icon={ShoppingBag} label="Products" value={stats.products} color="bg-purple-500" to="/admin/products" delay={0.1} />
        <StatCard icon={Mail} label="Subscribers" value={stats.subscribers} color="bg-brand-green" to="/admin/newsletter" delay={0.2} />
        <StatCard
          icon={MessageSquare}
          label={`Messages${stats.unread > 0 ? ` (${stats.unread} unread)` : ''}`}
          value={stats.contacts}
          color={stats.unread > 0 ? 'bg-red-500' : 'bg-orange-500'}
          to="/admin/contacts"
          delay={0.3}
        />
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-heading font-semibold text-gray-900">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-brand-green text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No messages yet</p>
            ) : recentContacts.map((c) => (
              <div key={c._id} className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!c.read ? 'bg-brand-green/5' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${!c.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {c.name}
                      {!c.read && <span className="ml-2 inline-block w-2 h-2 bg-brand-green rounded-full" />}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{c.service}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {new Date(c.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-heading font-semibold text-gray-900">Recent Blog Posts</h2>
            <Link to="/admin/blogs" className="text-brand-green text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBlogs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No posts yet</p>
            ) : recentBlogs.map((b) => (
              <div key={b._id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.category}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                  b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-black rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between"
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={22} className="text-brand-green" />
          <div>
            <p className="text-white font-semibold">Your site is live</p>
            <p className="text-gray-400 text-sm">Manage all content from this panel</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/newsletter" className="btn-primary text-sm py-2 px-4">
            <Mail size={14} /> Send Newsletter
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
