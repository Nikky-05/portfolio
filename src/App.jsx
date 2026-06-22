import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Building from './components/Building';
import WhyChooseUs from './components/WhyChooseUs';
import Chatbot from './components/Chatbot';
import Contact from './components/Contact';
import Footer from './components/Footer';

function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <motion.div
      className="loader-screen"
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#030014',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #8b5cf6, #22d3ee, #f472b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '4px',
        }}
      >
        &lt;NB/&gt;
      </motion.div>
      <motion.div
        style={{
          width: '200px',
          height: '3px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #8b5cf6, #22d3ee, #f472b6)',
            borderRadius: '2px',
            boxShadow: '0 0 15px #8b5cf6',
          }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          color: '#64748b',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}
      >
        Initializing...
      </motion.p>
    </motion.div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(139,92,246,0.5)' }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        border: 'none',
        borderRadius: '14px',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        boxShadow: '0 0 20px rgba(139,92,246,0.3)',
      }}
    >
      ↑
    </motion.button>
  );
}

export default function App() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <ParticleField />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <TechStack />
      <Projects />
      <Building />
      <WhyChooseUs />
      <Chatbot />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  );
}
