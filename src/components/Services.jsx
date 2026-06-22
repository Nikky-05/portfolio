import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCheck } from 'react-icons/fi';
import { services } from '../data/portfolio';
import './Services.css';

function ServiceCard({ service, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className="service-card glass-card"
      style={{ '--svc-color': service.color }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="service-head">
        <span className="service-icon">{service.icon}</span>
        <h3 className="service-title" style={{ color: service.color }}>
          {service.title}
        </h3>
      </div>
      <ul className="service-list">
        {service.items.map((item) => (
          <li key={item}>
            <span className="service-check"><FiCheck /></span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Services() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        Our Services
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        From AI solutions to full-scale software products — end-to-end, built to ship.
      </motion.p>

      <div className="services-grid">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
