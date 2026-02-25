import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import { personalInfo } from '../data/portfolio';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <motion.div
            className="footer-logo"
            whileHover={{ scale: 1.05 }}
          >
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">NB</span>
            <span className="logo-bracket">/&gt;</span>
          </motion.div>

          <div className="footer-socials">
            {[
              { icon: <FiGithub />, href: personalInfo.github },
              { icon: <FiLinkedin />, href: personalInfo.linkedin },
              { icon: <FiMail />, href: `mailto:${personalInfo.email}` },
            ].map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="footer-social-link"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            Built with <FiHeart className="heart-icon" /> by {personalInfo.name}
          </p>
          <p className="footer-tech">React + Vite + Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
