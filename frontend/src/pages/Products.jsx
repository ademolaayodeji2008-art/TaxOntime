import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Tag, Star, BookOpen, Layout, FileText, List } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import api from '../utils/api';

const categories = ['All', 'Freebies & E-Books', 'Organizers & Planners', 'Templates', 'Guides & Checklists'];

const categoryIcons = {
  'Freebies & E-Books': BookOpen,
  'Organizers & Planners': Layout,
  'Templates': FileText,
  'Guides & Checklists': List,
};

const formatPrice = (price, currency, isFree) => {
  if (isFree || price === 0) return 'FREE';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency || 'NGN', minimumFractionDigits: 0 }).format(price);
};

const ProductCard = ({ product, index }) => {
  const Icon = categoryIcons[product.category] || ShoppingBag;

  return (
    <AnimatedSection variant="fadeUp" delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(22,163,74,0.15)' }}
        transition={{ duration: 0.3 }}
        className="card border border-gray-100 overflow-hidden flex flex-col h-full"
      >
        {/* Cover */}
        <div className="aspect-video bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {product.coverImage ? (
            <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center">
                <Icon size={32} className="text-brand-green" />
              </div>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.featured && (
              <span className="flex items-center gap-1 bg-yellow-400 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            )}
            {product.isFree && (
              <span className="bg-brand-green text-white text-xs font-bold px-2.5 py-1 rounded-full">
                FREE
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-black/60 backdrop-blur-sm text-gray-200 text-xs px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-heading font-bold text-gray-900 text-lg mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-grow mb-5">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className={`text-2xl font-bold font-heading ${product.isFree ? 'text-brand-green' : 'text-gray-900'}`}>
              {formatPrice(product.price, product.currency, product.isFree)}
            </span>
            <motion.a
              href={product.selarUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-brand-green text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors"
            >
              {product.isFree ? 'Get Free' : 'Buy Now'}
              <ExternalLink size={13} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
        const res = await api.get(`/products${params}`);
        setProducts(res.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  const featured = products.filter((p) => p.featured);
  const regular = products.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        breadcrumb="Products & Resources"
        title="Tools to Keep You"
        highlight="Tax-Smart"
        subtitle="E-books, templates, organizers, and guides designed by a Chartered Tax Specialist to help you manage your tax and business affairs with ease."
      />

      <section className="section bg-white">
        <div className="container-site">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    category === cat
                      ? 'bg-brand-green text-white shadow-md shadow-brand-green/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {Icon && <Icon size={13} />}
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-4/5" />
                    <div className="h-4 bg-gray-100 rounded w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-gray-400 font-medium text-lg">No products found</h3>
              <p className="text-gray-300 text-sm mt-1">Check back soon — new resources are added regularly.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured.length > 0 && category === 'All' && (
                <div className="mb-12">
                  <AnimatedSection>
                    <h2 className="font-heading font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                      <Star size={18} className="text-yellow-400" fill="currentColor" /> Featured Products
                    </h2>
                  </AnimatedSection>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                  </div>
                </div>
              )}

              {/* All */}
              {regular.length > 0 && (
                <>
                  {featured.length > 0 && category === 'All' && (
                    <AnimatedSection>
                      <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">All Products</h2>
                    </AnimatedSection>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(category === 'All' ? regular : products).map((p, i) => (
                      <ProductCard key={p._id} product={p} index={i} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Selar Note */}
      <section className="bg-gray-50 py-10">
        <div className="container-site text-center">
          <AnimatedSection>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              All products are hosted on <strong className="text-gray-700">Selar</strong> — Nigeria's
              trusted digital product marketplace. Clicking "Buy Now" takes you directly to a secure checkout.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
