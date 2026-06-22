import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiPython, SiFastapi, SiSqlite, SiPostgresql, SiGit, SiGithub,
  SiDocker, SiOpencv, SiReact, SiNextdotjs, SiFlask, SiNodedotjs,
  SiRedis, SiNginx, SiGithubactions
} from 'react-icons/si';
import { FaServer, FaCogs, FaBrain, FaTools, FaUsers, FaCode, FaDatabase, FaRobot, FaCloud } from 'react-icons/fa';
import { techStack } from '../data/portfolio';
import './TechStack.css';

const categoryConfig = {
  backend: { label: 'Backend', icon: <FaServer />, color: '#8b5cf6' },
  frontend: { label: 'Frontend', icon: <FaCode />, color: '#3b82f6' },
  databases: { label: 'Databases', icon: <FaDatabase />, color: '#22d3ee' },
  aiMl: { label: 'AI / ML', icon: <FaBrain />, color: '#f472b6' },
  cloud: { label: 'Cloud & DevOps', icon: <FaCloud />, color: '#60a5fa' },
  tools: { label: 'Tools', icon: <FaTools />, color: '#fbbf24' },
  softSkills: { label: 'Soft Skills', icon: <FaUsers />, color: '#34d399' },
};

const techIcons = {
  Python: <SiPython />,
  FastAPI: <SiFastapi />,
  SQLite: <SiSqlite />,
  PostgreSQL: <SiPostgresql />,
  Git: <SiGit />,
  GitHub: <SiGithub />,
  Docker: <SiDocker />,
  OpenCV: <SiOpencv />,
  "React.js": <SiReact />,
  "Next.js": <SiNextdotjs />,
  Flask: <SiFlask />,
  "Node.js": <SiNodedotjs />,
  Redis: <SiRedis />,
  Nginx: <SiNginx />,
  "GitHub Actions": <SiGithubactions />,
};

function TechCategory({ catKey, items, config, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="tech-category glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="cat-header">
        <span className="cat-icon" style={{ color: config.color }}>{config.icon}</span>
        <h3 className="cat-title" style={{ color: config.color }}>{config.label}</h3>
      </div>
      <div className="tech-tags">
        {items.map((tech, i) => (
          <motion.span
            key={tech}
            className="tech-tag"
            style={{ '--tag-color': config.color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.05 * i }}
            whileHover={{ scale: 1.08, y: -2 }}
          >
            {techIcons[tech] && <span className="tag-icon">{techIcons[tech]}</span>}
            {tech}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Marquee items
  const allTech = Object.values(techStack).flat();

  return (
    <section id="tech" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        Tech Stack
      </motion.h2>

      <div className="tech-grid">
        {Object.entries(techStack).map(([key, items], i) => (
          <TechCategory
            key={key}
            catKey={key}
            items={items}
            config={categoryConfig[key]}
            delay={0.1 + i * 0.1}
          />
        ))}
      </div>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[...allTech, ...allTech].map((tech, i) => (
            <span key={i} className="marquee-item">
              {techIcons[tech] && <span className="marquee-icon">{techIcons[tech]}</span>}
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
