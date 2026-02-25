import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from 'react-icons/fi';
import { personalInfo } from '../data/portfolio';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      {/* Orbiting rings */}
      <div className="hero-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Status badge */}
        <motion.div
          className="status-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="status-dot" />
          {personalInfo.status}
        </motion.div>

        {/* Name */}
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="hero-greeting">Hello, I'm</span>
          <span className="hero-name-text gradient-text">{personalInfo.name}</span>
        </motion.h1>

        {/* Typewriter */}
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

        {/* CTA buttons */}
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.a
            href="#projects"
            className="btn-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,92,246,0.5)' }}
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

        {/* Social links */}
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
