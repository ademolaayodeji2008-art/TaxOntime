import { motion } from 'framer-motion';

export default function PageHero({ title, subtitle, highlight, breadcrumb }) {
  return (
    <section className="bg-black pt-32 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-green to-transparent" />

      <div className="container-site relative z-10 text-center">
        {breadcrumb && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-brand-green text-sm font-medium uppercase tracking-widest mb-3"
          >
            {breadcrumb}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight"
        >
          {title}{' '}
          {highlight && <span className="gradient-text">{highlight}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl mt-4 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
