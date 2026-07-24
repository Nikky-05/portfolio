import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLock, FiLogOut, FiRefreshCw, FiUsers, FiEye, FiClock, FiCalendar,
  FiMonitor, FiSmartphone, FiTablet, FiGlobe, FiInstagram, FiLinkedin,
  FiSearch, FiExternalLink,
} from 'react-icons/fi';
import { adminLogin, fetchStats, fetchVisitors, getToken, clearToken } from '../lib/api';
import './Viewers.css';

const SOURCE_ICONS = {
  instagram: <FiInstagram />,
  linkedin: <FiLinkedin />,
  google: <FiSearch />,
  direct: <FiExternalLink />,
};

const DEVICE_ICONS = {
  Mobile: <FiSmartphone />,
  Desktop: <FiMonitor />,
  Tablet: <FiTablet />,
};

function formatDuration(seconds) {
  if (!seconds || seconds < 1) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function LoginScreen({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(password);
      onLoggedIn();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="viewers-login-wrap">
      <motion.form
        className="viewers-login glass-card"
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-icon"><FiLock /></div>
        <h2>Admin Access</h2>
        <p>Enter password to view visitor analytics.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          required
        />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Unlock Dashboard'}
        </button>
      </motion.form>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <motion.div
      className="v-stat-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ '--v-accent': accent }}
    >
      <div className="v-stat-icon">{icon}</div>
      <div>
        <div className="v-stat-value">{value}</div>
        <div className="v-stat-label">{label}</div>
      </div>
    </motion.div>
  );
}

function BreakdownList({ title, rows, keyField, labelField, valueField, iconMap, total }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="v-breakdown glass-card">
        <h3>{title}</h3>
        <p className="v-empty">No data yet.</p>
      </div>
    );
  }

  return (
    <div className="v-breakdown glass-card">
      <h3>{title}</h3>
      <ul>
        {rows.map((r) => {
          const label = r[labelField] || 'Unknown';
          const value = r[valueField];
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <li key={r[keyField] || label}>
              <div className="v-row-head">
                <span className="v-row-label">
                  {iconMap && iconMap[label] && <span className="v-row-icon">{iconMap[label]}</span>}
                  {label}
                </span>
                <span className="v-row-value">{value} ({pct}%)</span>
              </div>
              <div className="v-bar">
                <div className="v-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [s, v] = await Promise.all([fetchStats(), fetchVisitors(page, 50)]);
      setStats(s);
      setVisitors(v);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('expired')) onLogout();
    } finally {
      setLoading(false);
    }
  }, [page, onLogout]);

  useEffect(() => { load(); }, [load]);

  if (loading && !stats) {
    return <div className="viewers-loading">Loading analytics...</div>;
  }

  if (error && !stats) {
    return (
      <div className="viewers-loading">
        <p>{error}</p>
        <button onClick={load}>Retry</button>
      </div>
    );
  }

  return (
    <div className="viewers-dash">
      <div className="viewers-header">
        <div>
          <h2 className="gradient-text">Visitor Analytics</h2>
          <p className="v-sub">Real-time insights into who's visiting your portfolio.</p>
        </div>
        <div className="v-actions">
          <button className="v-btn" onClick={load} disabled={loading}>
            <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="v-btn v-btn-danger" onClick={onLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="v-stat-grid">
        <StatCard icon={<FiEye />} label="Total Visits" value={stats.total_visits} accent="#dc2626" />
        <StatCard icon={<FiUsers />} label="Unique Visitors" value={stats.unique_visitors} accent="#ef4444" />
        <StatCard icon={<FiCalendar />} label="Today's Visits" value={stats.visits_today} accent="#b91c1c" />
        <StatCard icon={<FiUsers />} label="Unique Today" value={stats.unique_today} accent="#f87171" />
        <StatCard icon={<FiClock />} label="Avg. Duration" value={formatDuration(Math.round(stats.avg_duration_seconds))} accent="#7f1d1d" />
      </div>

      <div className="v-breakdown-grid">
        <BreakdownList
          title="Traffic Sources"
          rows={stats.sources}
          keyField="source" labelField="source" valueField="count"
          iconMap={SOURCE_ICONS}
          total={stats.total_visits}
        />
        <BreakdownList
          title="Top Countries"
          rows={stats.countries}
          keyField="country" labelField="country" valueField="count"
          total={stats.total_visits}
        />
        <BreakdownList
          title="Devices"
          rows={stats.devices}
          keyField="device" labelField="device" valueField="count"
          iconMap={DEVICE_ICONS}
          total={stats.total_visits}
        />
        <BreakdownList
          title="Top Pages"
          rows={stats.top_pages}
          keyField="page" labelField="page" valueField="count"
          total={stats.total_visits}
        />
      </div>

      <div className="v-visitors-table glass-card">
        <div className="v-table-head">
          <h3>Recent Visitors</h3>
          <div className="v-pager">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={visitors.length < 50}>Next</button>
          </div>
        </div>
        <div className="v-table-scroll">
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Location</th>
                <th>Source</th>
                <th>Device</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Page</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 && (
                <tr><td colSpan={8} className="v-empty">No visitors on this page.</td></tr>
              )}
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td>{formatDate(v.created_at)}</td>
                  <td>
                    <FiGlobe style={{ marginRight: 6, opacity: 0.6 }} />
                    {[v.city, v.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td>
                    <span className={`v-source-tag src-${v.referrer_source || 'unknown'}`}>
                      {SOURCE_ICONS[v.referrer_source] && (
                        <span className="v-row-icon">{SOURCE_ICONS[v.referrer_source]}</span>
                      )}
                      {v.referrer_source || 'unknown'}
                    </span>
                  </td>
                  <td>
                    {DEVICE_ICONS[v.device] && (
                      <span className="v-row-icon">{DEVICE_ICONS[v.device]}</span>
                    )}
                    {v.device || '—'}
                  </td>
                  <td>{v.browser || '—'}</td>
                  <td>{v.os || '—'}</td>
                  <td className="v-page-cell" title={v.page}>{v.page || '/'}</td>
                  <td>{formatDuration(v.duration_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Viewers() {
  const [visible, setVisible] = useState(window.location.hash === '#viewers');
  const [authed, setAuthed] = useState(Boolean(getToken()));

  useEffect(() => {
    const onHash = () => setVisible(window.location.hash === '#viewers');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const close = () => {
    window.location.hash = '';
  };

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="viewers-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="viewers-close" onClick={close} aria-label="Close">×</button>
          <div className="viewers-inner">
            {authed ? (
              <Dashboard onLogout={logout} />
            ) : (
              <LoginScreen onLoggedIn={() => setAuthed(true)} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
