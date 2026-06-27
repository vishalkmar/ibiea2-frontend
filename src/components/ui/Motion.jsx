import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Premium scroll-reveal wrapper (framer-motion). Drop-in replacement for the old CSS reveal.
export function Reveal({ children, delay = 0, y = 28, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container — children reveal in sequence. Use with <Stagger.Item>.
export function Stagger({ children, className = '', gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

Stagger.Item = function StaggerItem({ children, className = '', y = 26 }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
    >
      {children}
    </motion.div>
  );
};

// Subtle hover-lift wrapper for premium cards.
export function HoverLift({ children, className = '' }) {
  return (
    <motion.div className={className} whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
      {children}
    </motion.div>
  );
}

export { motion };
