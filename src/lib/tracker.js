const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SESSION_KEY = 'nb_session_id';
const VISIT_KEY = 'nb_last_visit_id';
const VISIT_START_KEY = 'nb_visit_start';

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

async function sendTrack() {
  try {
    const utm = readUtm();
    const body = {
      session_id: getSessionId(),
      page: window.location.pathname + window.location.hash,
      referrer: document.referrer || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    };

    const res = await fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.visit_id) {
      sessionStorage.setItem(VISIT_KEY, String(data.visit_id));
      sessionStorage.setItem(VISIT_START_KEY, String(Date.now()));
    }
  } catch {
    // Fire-and-forget; never break the site if tracker fails
  }
}

function sendDuration() {
  const visitId = sessionStorage.getItem(VISIT_KEY);
  const start = sessionStorage.getItem(VISIT_START_KEY);
  if (!visitId || !start) return;

  const seconds = Math.round((Date.now() - Number(start)) / 1000);
  if (seconds < 2) return;

  const payload = JSON.stringify({
    visit_id: Number(visitId),
    duration_seconds: seconds,
  });

  // sendBeacon survives page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${API_URL}/api/track/duration`, blob);
  } else {
    fetch(`${API_URL}/api/track/duration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

let initialized = false;

export function initTracker() {
  if (initialized) return;
  initialized = true;

  // Don't track the admin dashboard itself
  if (window.location.hash === '#viewers') return;

  sendTrack();

  window.addEventListener('pagehide', sendDuration);
  window.addEventListener('beforeunload', sendDuration);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendDuration();
  });
}
