'use client';

import { motion } from 'framer-motion';

export default function SectionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string; 
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 50 }} // Start invisible and 50px down
      whileInView={{ opacity: 1, y: 0 }} // Animate to full opacity and y=0
      viewport={{ once: true }} // Only animate once when it enters view
      transition={{ duration: 0.5, ease: 'easeOut' }} // Smooth animation
    >
      {children}
    </motion.section>
  );
}