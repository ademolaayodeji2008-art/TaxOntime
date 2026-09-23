import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import api from '../utils/api';

const categories = ['All', 'Tax Tips', 'Business', 'Compliance', 'News', 'Guides', 'General'];

const CategoryPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-brand-green text-white shadow-md shadow-brand-green/30'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const BlogCard = ({ blog, index }) => (
  <AnimatedSection variant="fadeUp" delay={index * 0.08}>
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card border border-gray-100 overflow-hidden h-full flex flex-col"
    >
      {/* Cover */}
      <div className="aspect-video bg-gradient-to-br from-black to-gray-800 relative overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={40} className="text-brand-green opacity-60" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {blog.readTime} min read
          </span>
          <span>·</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        <h2 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
          {blog.excerpt}
        </p>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 text-brand-green text-sm font-semibold hover:gap-2 transition-all duration-200 mt-auto"
        >
          Read Article <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  </AnimatedSection>
);

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      const res = await api.get(`/blogs?${params}`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    fetchBlogs();
  }, [category, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <>
      <PageHero
        breadcrumb="Blog & Resources"
        title="Tax Tips, Guides &"
        highlight="Business Insights"
        subtitle="Stay informed with practical tax advice, compliance updates, and business growth strategies from our experts."
      />

      <section className="section bg-white">
        <div className="container-site">
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={category === cat}
                  onClick={() => setCategory(cat)}
                />
              ))}
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input pl-9 py-2 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
            </form>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-gray-400 text-sm mb-6">
              {total} article{total !== 1 ? 's' : ''} found
              {search ? ` for "${search}"` : ''}
              {category !== 'All' ? ` in ${category}` : ''}
            </p>
          )}

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-5 bg-gray-100 rounded" />
                    <div className="h-5 bg-gray-100 rounded w-4/5" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-gray-400 font-medium text-lg">No articles found</h3>
              <p className="text-gray-300 text-sm mt-1">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    page === i + 1
                      ? 'bg-brand-green text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
