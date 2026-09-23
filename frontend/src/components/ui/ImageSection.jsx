import { motion } from 'framer-motion';

/**
 * Reusable full-bleed section with a background image — same treatment as the hero.
 * Props:
 *  - image: path to image e.g. "/ant-bg3.jpg"
 *  - overlay: tailwind gradient class e.g. "from-black/80 via-black/50 to-black/30"
 *  - direction: "left" | "right" | "center" — which side the overlay fades from
 *  - className: extra classes for the section element
 *  - children: your content
 */
export default function ImageSection({
  image,
  overlay = 'from-black/80 via-black/60 to-black/40',
  direction = 'left',
  className = '',
  children,
}) {
  const dirMap = {
    left: 'bg-gradient-to-r',
    right: 'bg-gradient-to-l',
    center: 'bg-gradient-to-b',
  };

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background image with Ken Burns zoom-in on scroll enter */}
      <motion.div
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="absolute inset-0"
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </motion.div>

      {/* Directional overlay — keeps text readable */}
      <div className={`absolute inset-0 ${dirMap[direction]} ${overlay}`} />

      {/* Shimmer sweep on view enter */}
      <motion.div
        initial={{ x: '-100%', opacity: 0.3 }}
        whileInView={{ x: '250%', opacity: 0 }}
        transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '20%', left: '6%',  size: 3, delay: 0   },
          { top: '70%', left: '10%', size: 2, delay: 0.8 },
          { top: '35%', left: '92%', size: 3, delay: 0.4 },
          { top: '80%', left: '85%', size: 2, delay: 1.2 },
        ].map((p, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            className="absolute rounded-full bg-brand-green"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
