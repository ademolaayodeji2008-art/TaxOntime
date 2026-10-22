import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X } from 'lucide-react';

export default function FloatingCalculator() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Tooltip / label */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 bg-white text-gray-800 text-xs font-semibold
                       px-3 py-2 rounded-full shadow-lg border border-gray-100 whitespace-nowrap"
          >
            Free Tax Calculator
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
              aria-label="Dismiss"
            >
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <Link to="/tax-calculator" aria-label="Open free tax calculator">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTooltip(false)}
          className="w-14 h-14 bg-brand-green rounded-full shadow-xl shadow-brand-green/40
                     flex items-center justify-center cursor-pointer relative"
        >
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-brand-green"
          />
          <Calculator size={24} className="text-white relative z-10" />
        </motion.div>
      </Link>
    </div>
  );
}
