import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

// Number kept in code only — never rendered to the DOM.
// Includes India country code (+91) for wa.me link.
const WA_LINK = 'https://wa.me/918007289776?text=Hi%20Nikky%2C%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect.';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <span className="wa-pulse-ring wa-pulse-1" />
      <span className="wa-pulse-ring wa-pulse-2" />
      <span className="wa-fab-inner">
        <FaWhatsapp />
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="wa-tooltip"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            Chat with me
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
