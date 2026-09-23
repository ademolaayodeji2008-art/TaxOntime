import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag, ArrowLeft, Calendar, User, Share2, BookOpen } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import NewsletterForm from '../components/ui/NewsletterForm';
import api from '../utils/api';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/blogs/post/${slug}`);
        setBlog(res.data);
      } catch {
        navigate('/blog', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return null;

  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-green transition-colors mb-6 text-sm"
            >
              <ArrowLeft size={15} /> Back to Blog
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                {blog.category}
              </span>
              {blog.tags?.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <h1 className="text-white font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-brand-green" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-green" />
                {new Date(blog.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-brand-green" />
                {blog.readTime} min read
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-brand-green transition-colors ml-auto"
              >
                <Share2 size={13} />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="container-site -mt-6 relative z-10">
          <motion.img
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={blog.coverImage}
            alt={blog.title}
            className="w-full aspect-video object-cover rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Content */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              {/* Excerpt */}
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 pb-8 border-b border-gray-100">
                {blog.excerpt}
              </p>

              {/* Main Content */}
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </AnimatedSection>

            {/* Author Card */}
            <AnimatedSection className="mt-12">
              <div className="bg-black rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src="/tnt.png"
                  alt="Zarat Ranti L."
                  className="w-16 h-16 rounded-xl object-contain flex-shrink-0"
                />
                <div>
                  <p className="text-brand-green text-xs font-semibold uppercase tracking-widest mb-1">Written by</p>
                  <h3 className="text-white font-heading font-bold text-xl">{blog.author}</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    Chartered Accountant and Certified Tax Specialist with 10+ years helping
                    individuals and SMEs navigate Nigeria's tax landscape.
                  </p>
                  <Link to="/about" className="text-brand-green text-sm font-medium hover:underline mt-2 inline-block">
                    Learn more →
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Share */}
            <AnimatedSection className="mt-8 flex items-center justify-between">
              <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors text-sm">
                <ArrowLeft size={14} /> All Articles
              </Link>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green transition-colors"
              >
                <Share2 size={14} />
                {copied ? 'Link copied!' : 'Share this article'}
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-gray-50">
        <div className="container-site max-w-lg mx-auto text-center">
          <AnimatedSection>
            <BookOpen size={40} className="text-brand-green mx-auto mb-4" />
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-2">
              Enjoyed this article?
            </h3>
            <p className="text-gray-500 mb-6">
              Subscribe to get more tax tips and compliance guides delivered to your inbox.
            </p>
            <NewsletterForm />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
