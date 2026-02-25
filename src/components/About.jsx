import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { personalInfo } from '../data/portfolio';
import './About.css';

function StatCounter({ value, suffix, label, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="stat-card glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="stat-value gradient-text">
        {inView ? value : 0}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" className="section">
      <motion.h2
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        ref={ref}
      >
        About Me
      </motion.h2>

      <div className="about-grid">
        <motion.div
          className="about-code glass-card"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="code-header">
            <div className="code-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="code-filename">nikky_bisen.py</span>
          </div>
          <pre className="code-block">
            <code>{personalInfo.about}</code>
          </pre>
        </motion.div>

        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p>
            I'm an <span className="highlight">AI Backend Developer</span> who builds
            intelligent APIs and automation systems. I specialize in <span className="highlight">Python</span>,
            <span className="highlight"> FastAPI</span>, and <span className="highlight">RAG Systems</span>.
          </p>
          <p>
            From OCR document extraction to multi-database AI querying, I love turning complex
            problems into elegant, scalable solutions. Always exploring the cutting edge of
            AI and backend architecture.
          </p>
        </motion.div>
      </div>

      <div className="stats-row">
        {personalInfo.stats.map((stat, i) => (
          <StatCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            delay={0.6 + i * 0.15}
          />
        ))}
      </div>
    </section>
  );
}
