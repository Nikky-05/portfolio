import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';
import { personalInfo } from '../data/portfolio';
import './Footer.css';

const exploreLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'building', label: 'Building' },
];

const serviceLinks = [
  'AI & Automation',
  'Full Stack Development',
  'Website Development',
  'AI & Technical Training',
];

const socials = [
  { icon: <FiGithub />, href: personalInfo.github, label: 'GitHub' },
  { icon: <FiLinkedin />, href: personalInfo.linkedin, label: 'LinkedIn' },
  { icon: <FiMail />, href: `mailto:${personalInfo.email}`, label: 'Email' },
];

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div
              className="footer-logo"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="logo-bracket">&lt;</span>
              <span className="logo-text">NB</span>
              <span className="logo-bracket">/&gt;</span>
            </div>
            <p className="footer-tagline">
              Designing intelligent APIs, automation systems, and AI-powered
              products — engineered to scale.
            </p>
            <div className="footer-socials">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="footer-social-link"
                  whileHover={{ y: -3 }}
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul>
              {exploreLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollTo(l.id)}>{l.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <ul>
              {serviceLinks.map((s) => (
                <li key={s}>
                  <button onClick={() => scrollTo('services')}>{s}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div className="footer-col footer-contact">
            <h4 className="footer-col-title">Let's build together</h4>
            <a className="footer-email" href={`mailto:${personalInfo.email}`}>
              {personalInfo.email}
              <FiArrowUpRight />
            </a>
            <div className="footer-status">
              <span className="footer-status-dot" />
              {personalInfo.status}
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {personalInfo.name}. All rights reserved.
          </p>
          <p className="footer-meta">Crafted with precision in India.</p>
        </div>
      </div>
    </footer>
  );
}
