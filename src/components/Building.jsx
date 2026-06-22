import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { building } from '../data/portfolio';
import './Building.css';

function BuildingCard({ item, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className="building-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 2) * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="building-top">
        <span className="building-icon">{item.icon}</span>
        <span className="building-status">
          <span className="status-dot" />
          {item.status}
        </span>
      </div>
      <h3 className="building-title">{item.title}</h3>
      <p className="building-desc">{item.description}</p>
    </motion.div>
  );
}

export default function Building() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="building" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        What We're Building
      </motion.h2>

      <div className="building-grid">
        {building.map((item, i) => (
          <BuildingCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
