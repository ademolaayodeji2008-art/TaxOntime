import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ icon: Icon, title, description, href, delay = 0 }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(22,163,74,0.15)' }}
      transition={{ duration: 0.3 }}
      className="card p-6 border border-gray-100 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4 group-hover:bg-brand-green transition-colors duration-300">
        <Icon size={22} className="text-brand-green group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>
      <Link
        to={href}
        className="inline-flex items-center gap-1 text-brand-green text-sm font-medium hover:gap-2 transition-all duration-200"
      >
        Learn more <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
