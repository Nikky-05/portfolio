import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from 'react-icons/fi';
import { SiPython, SiFastapi, SiReact, SiDocker } from 'react-icons/si';
import { FaBrain } from 'react-icons/fa';
import { personalInfo } from '../data/portfolio';
import profileImg from '../assets/nikk.jpeg';
import './Hero.css';

// Badges live in the side + bottom arc (90°–270°) so nothing crosses the face.
const floatingBadges = [
  { icon: <SiPython />, label: 'Python', angle: 90 },
  { icon: <SiFastapi />, label: 'FastAPI', angle: 135 },
  { icon: <FaBrain />, label: 'AI', angle: 180 },
  { icon: <SiReact />, label: 'React', angle: 225 },
  { icon: <SiDocker />, label: 'Docker', angle: 270 },
];

export default function Hero() {
  return (
    <section className="hero">
      {/* Orbiting background rings */}
      <div className="hero-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="hero-layout">
        {/* TOP — Profile image with unique design */}
        <motion.div
          className="hero-profile"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
        >
          {/* Rotating conic-gradient border */}
          <div className="profile-ring-rotator">
            <div className="profile-ring-gradient" />
          </div>

          {/* Outer glow rings */}
          <div className="profile-glow-ring profile-glow-1" />
          <div className="profile-glow-ring profile-glow-2" />
          <div className="profile-glow-ring profile-glow-3" />

          {/* Actual image circle */}
          <motion.div
            className="profile-image-wrap"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 220 }}
          >
            <img src={profileImg} alt="Nikky Bisen" className="profile-image" />
            <div className="profile-overlay" />
            <div className="profile-scanline" />
          </motion.div>

          {/* Floating tech badges orbiting the image */}
          <div className="profile-badges">
            {floatingBadges.map((b, i) => (
              <motion.div
                key={b.label}
                className="profile-badge"
                style={{
                  '--angle': `${b.angle}deg`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.15, y: -3 }}
              >
                <span className="badge-icon">{b.icon}</span>
                <span className="badge-label">{b.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Corner accent dots */}
          <span className="profile-corner corner-tl" />
          <span className="profile-corner corner-tr" />
          <span className="profile-corner corner-bl" />
          <span className="profile-corner corner-br" />

          {/* Available badge */}
          <motion.div
            className="profile-available"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <span className="avail-dot" />
            Open to work
          </motion.div>
        </motion.div>

        {/* BOTTOM — Text content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.div
            className="status-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="status-dot" />
            {personalInfo.status}
          </motion.div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="hero-greeting">Hello, I'm</span>
            <span className="hero-name-text gradient-text">{personalInfo.name}</span>
          </motion.h1>

          <motion.div
            className="hero-typewriter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="type-prefix">&gt;_</span>
            <TypeAnimation
              sequence={personalInfo.roles.flatMap(role => [role, 2000])}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="type-text"
            />
          </motion.div>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <motion.a
              href="#projects"
              className="btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(107,142,35,0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
              <span className="btn-glow" />
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {[
              { icon: <FiGithub />, href: personalInfo.github, label: 'GitHub' },
              { icon: <FiLinkedin />, href: personalInfo.linkedin, label: 'LinkedIn' },
              { icon: <FiMail />, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="social-link"
                whileHover={{ y: -4, scale: 1.15 }}
                aria-label={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FiChevronDown />
        </motion.div>
      </motion.div>
    </section>
  );
}
