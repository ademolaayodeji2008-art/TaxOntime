import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern pointer-events-none" />
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-brand-green font-heading font-bold text-[10rem] leading-none opacity-20 select-none">404</h1>
          <div className="-mt-16 mb-6">
            <h2 className="text-white font-heading font-bold text-3xl md:text-4xl mb-3">Page Not Found</h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              Looks like this page filed for an extension and never came back. Let's get you home.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn-primary">
              <Home size={16} /> Go Home
            </Link>
            <button onClick={() => history.back()} className="btn-secondary">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
