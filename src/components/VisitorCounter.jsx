import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiUsers, FiUnlock } from 'react-icons/fi';
import { fetchPublicCount } from '../lib/api';
import './VisitorCounter.css';

export default function VisitorCounter() {
  const [counts, setCounts] = useState({ total_visits: 0, unique_visitors: 0, visits_today: 0 });
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchPublicCount();
        if (!cancelled) {
          setCounts(data);
          setLoaded(true);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const openViewers = () => {
    window.location.hash = '#viewers';
  };

  return (
    <motion.div
      className="visitor-counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <div className="vc-glow" />
      <div className="vc-header">
        <span className="vc-live-dot" />
        <span className="vc-live-text">LIVE</span>
      </div>

      <div className="vc-stats">
        <div className="vc-stat">
          <FiEye className="vc-icon" />
          <div>
            <div className="vc-value">{failed ? '—' : counts.total_visits}</div>
            <div className="vc-label">Total Views</div>
          </div>
        </div>
        <div className="vc-divider" />
        <div className="vc-stat">
          <FiUsers className="vc-icon" />
          <div>
            <div className="vc-value">{failed ? '—' : counts.unique_visitors}</div>
            <div className="vc-label">Unique</div>
          </div>
        </div>
      </div>

      <div className="vc-today">Today: <strong>{failed ? '—' : counts.visits_today}</strong></div>

      <motion.button
        className="vc-btn"
        onClick={openViewers}
        whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(220,38,38,0.6)' }}
        whileTap={{ scale: 0.97 }}
      >
        <FiUnlock /> View Visitor Details
      </motion.button>

      {failed && (
        <div className="vc-fail" title="Tracker API unreachable">
          tracker offline — start backend to see counts
        </div>
      )}
    </motion.div>
  );
}
