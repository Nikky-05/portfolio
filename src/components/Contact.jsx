import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiGithub, FiLinkedin, FiSend, FiCheck, FiMapPin } from 'react-icons/fi';
import { personalInfo } from '../data/portfolio';
import './Contact.css';

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open mailto with form data
    const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(form.subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.open(mailtoLink, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactLinks = [
    { icon: <FiMail />, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: '#1d4ed8' },
    { icon: <FiGithub />, label: 'GitHub', value: 'Nikky-05', href: personalInfo.github, color: '#0a2540' },
    { icon: <FiLinkedin />, label: 'LinkedIn', value: 'Nikky Bisen', href: personalInfo.linkedin, color: '#3b82f6' },
    { icon: <FiMapPin />, label: 'Location', value: 'India', href: '#', color: '#0ea5e9' },
  ];

  return (
    <section id="contact" className="section">
      <motion.h2
        ref={ref}
        className="section-title gradient-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        Get In Touch
      </motion.h2>

      <div className="contact-grid">
        {/* Contact Links */}
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h3 className="contact-subtitle">Let's Connect</h3>
          <p className="contact-desc">
            I'm always open to new opportunities, collaborations, and interesting projects.
            Feel free to reach out!
          </p>

          <div className="contact-links">
            {contactLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-link-card glass-card"
                whileHover={{ x: 8, scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="contact-link-icon" style={{ color: link.color }}>{link.icon}</span>
                <div>
                  <span className="contact-link-label">{link.label}</span>
                  <span className="contact-link-value">{link.value}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="contact-form glass-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                minLength={2}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="What's this about?"
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              required
              minLength={10}
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me about your project..."
            />
          </div>

          <motion.button
            type="submit"
            className={`form-submit ${submitted ? 'submitted' : ''}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitted}
          >
            {submitted ? (
              <><FiCheck /> Message Sent!</>
            ) : (
              <><FiSend /> Send Message</>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
