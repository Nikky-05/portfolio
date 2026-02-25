import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiChevronRight, FiLayers } from 'react-icons/fi';
import { projects } from '../data/portfolio';
import './Projects.css';

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className="project-card glass-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="project-icon">{project.icon}</div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      <div className="project-tech">
        {project.techStack.map(tech => (
          <span key={tech} className="project-tech-tag">{tech}</span>
        ))}
      </div>

      <motion.button
        className="project-expand-btn"
        onClick={() => setExpanded(!expanded)}
        whileTap={{ scale: 0.95 }}
      >
        {expanded ? 'Show Less' : 'View Details'}
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex' }}
        >
          <FiChevronRight />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="project-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="detail-section">
              <h4>Features</h4>
              <ul className="feature-list">
                {project.features.map((f, i) => (
                  <li key={i}><span className="feature-dot" />{f}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h4><FiLayers style={{ marginRight: 6 }} />Architecture</h4>
              <div className="arch-flow">
                {project.architecture.split('→').map((step, i, arr) => (
                  <span key={i} className="arch-step">
                    {step.trim()}
                    {i < arr.length - 1 && <span className="arch-arrow">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        Projects
      </motion.h2>

      <div className="projects-grid">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
