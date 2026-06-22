import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { whyChooseUs } from '../data/portfolio';
import './WhyChooseUs.css';

export default function WhyChooseUs() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="why" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        Why Choose Us
      </motion.h2>

      <div className="why-grid">
        {whyChooseUs.map((item, i) => (
          <motion.div
            key={item.text}
            className="why-card glass-card"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <span className="why-icon">{item.icon}</span>
            <span className="why-text">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
