import { useEffect, useRef } from 'react';

/**
 * SpaceScene — layered animated background:
 *  - deep-space starfield (twinkling)
 *  - drifting nebula haze
 *  - asteroid belt (slow rotating rocks)
 *  - meteors / shooting stars (bright streaks)
 *  - orbiting satellite
 *  - launching rocket with flame trail
 *  - roaming UFO with pulsing tractor beam
 */
export default function SpaceScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = 0;
    let H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // -- STARS --------------------------------------------------------------
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      base: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.002,
    }));

    // -- METEORS ------------------------------------------------------------
    const meteors = [];
    const spawnMeteor = () => {
      const fromLeft = Math.random() < 0.5;
      meteors.push({
        x: fromLeft ? -50 : W + 50,
        y: Math.random() * H * 0.6,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 6 + 6),
        vy: Math.random() * 3 + 2,
        life: 0,
        maxLife: 90 + Math.random() * 30,
        len: 100 + Math.random() * 80,
      });
    };

    // -- ASTEROIDS ----------------------------------------------------------
    const asteroids = Array.from({ length: 8 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 14 + 6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01,
      craters: Array.from({ length: 4 }, () => ({
        a: Math.random() * Math.PI * 2,
        d: Math.random() * 0.6 + 0.2,
        r: Math.random() * 0.25 + 0.1,
      })),
    }));

    // -- SATELLITE (orbits a virtual center) --------------------------------
    const satellite = {
      cx: () => W * 0.75,
      cy: () => H * 0.35,
      radius: () => Math.min(W, H) * 0.28,
      angle: 0,
      speed: 0.0035,
    };

    // -- ROCKET (rises from bottom, loops) ----------------------------------
    const rocket = {
      x: W * 0.15,
      y: H + 80,
      vy: -1.6,
      trail: [],
      reset() {
        this.x = 60 + Math.random() * (W - 120);
        this.y = H + 80;
        this.vy = -(1.2 + Math.random() * 1.2);
        this.trail = [];
      },
    };

    // -- UFO (drifts across, bobs vertically) -------------------------------
    const ufo = {
      x: -120,
      y: H * 0.25,
      vx: 0.9,
      bob: 0,
      beam: 0,
      reset() {
        this.x = -140;
        this.y = 80 + Math.random() * (H * 0.5);
        this.vx = 0.7 + Math.random() * 0.8;
      },
    };

    // ---------------------------------------------------------------------

    const drawStars = (t) => {
      for (const s of stars) {
        const tw = s.base + Math.sin(t * s.speed + s.phase) * 0.35;
        ctx.globalAlpha = Math.max(0, Math.min(1, tw));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawNebula = (t) => {
      const wobble = Math.sin(t * 0.0004) * 40;
      const g1 = ctx.createRadialGradient(W * 0.2 + wobble, H * 0.3, 20, W * 0.2, H * 0.3, 380);
      g1.addColorStop(0, 'rgba(220, 38, 38, 0.18)');
      g1.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      const g2 = ctx.createRadialGradient(W * 0.85, H * 0.7 - wobble, 20, W * 0.85, H * 0.7, 420);
      g2.addColorStop(0, 'rgba(127, 29, 29, 0.22)');
      g2.addColorStop(1, 'rgba(127, 29, 29, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
    };

    const drawMeteor = (m) => {
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.len * 0.1, m.y - m.vy * m.len * 0.1);
      grad.addColorStop(0, 'rgba(255, 240, 220, 1)');
      grad.addColorStop(0.4, 'rgba(255, 120, 90, 0.7)');
      grad.addColorStop(1, 'rgba(255, 120, 90, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * (m.len / 10), m.y - m.vy * (m.len / 10));
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawAsteroid = (a) => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      const grad = ctx.createRadialGradient(-a.r * 0.3, -a.r * 0.3, a.r * 0.1, 0, 0, a.r);
      grad.addColorStop(0, '#5a4d47');
      grad.addColorStop(1, '#1a1310');
      ctx.fillStyle = grad;
      ctx.beginPath();
      // Slightly bumpy silhouette
      for (let i = 0; i <= 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const jag = 1 + Math.sin(ang * 3 + a.rot) * 0.08;
        const px = Math.cos(ang) * a.r * jag;
        const py = Math.sin(ang) * a.r * jag;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Craters
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      for (const c of a.craters) {
        const cx = Math.cos(c.a) * a.r * c.d;
        const cy = Math.sin(c.a) * a.r * c.d;
        ctx.beginPath();
        ctx.arc(cx, cy, a.r * c.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Edge highlight
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, a.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawSatellite = (t) => {
      const cx = satellite.cx();
      const cy = satellite.cy();
      const R = satellite.radius();
      // Faint orbit ring
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const x = cx + Math.cos(satellite.angle) * R;
      const y = cy + Math.sin(satellite.angle) * R * 0.6; // elliptical

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(satellite.angle + Math.PI / 2);

      // Solar panels
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
      ctx.lineWidth = 0.8;
      ctx.fillRect(-16, -3, 12, 6);
      ctx.strokeRect(-16, -3, 12, 6);
      ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-4, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-10, -3); ctx.lineTo(-10, 3); ctx.stroke();
      ctx.fillRect(4, -3, 12, 6);
      ctx.strokeRect(4, -3, 12, 6);
      ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(16, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(10, 3); ctx.stroke();

      // Body
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(-4, -5, 8, 10);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-4, 3, 8, 2);

      // Antenna / dish
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(0, -10);
      ctx.stroke();
      ctx.fillStyle = 'rgba(220,38,38,0.9)';
      ctx.beginPath();
      ctx.arc(0, -11, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Blink light
      const blink = (Math.sin(t * 0.01) + 1) / 2;
      ctx.globalAlpha = blink;
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(0, 6, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawRocket = () => {
      // Trail
      for (let i = 0; i < rocket.trail.length; i++) {
        const p = rocket.trail[i];
        const a = (i / rocket.trail.length) * 0.6;
        ctx.fillStyle = `rgba(255, ${140 + i * 3}, 80, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 - i * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(rocket.x, rocket.y);

      // Rocket body (pointing up)
      ctx.fillStyle = '#f5f5f5';
      ctx.beginPath();
      ctx.moveTo(0, -18);            // nose
      ctx.lineTo(6, -6);
      ctx.lineTo(6, 10);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-6, -6);
      ctx.closePath();
      ctx.fill();

      // Red band
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-6, -3, 12, 3);

      // Window
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(0, 3, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Fins
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-6, 10); ctx.lineTo(-11, 14); ctx.lineTo(-6, 6); ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, 10); ctx.lineTo(11, 14); ctx.lineTo(6, 6); ctx.closePath();
      ctx.fill();

      // Flame
      const flick = Math.random() * 2;
      const flameGrad = ctx.createLinearGradient(0, 10, 0, 26 + flick);
      flameGrad.addColorStop(0, 'rgba(255, 240, 200, 1)');
      flameGrad.addColorStop(0.5, 'rgba(255, 140, 40, 0.9)');
      flameGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-4, 10);
      ctx.lineTo(0, 26 + flick);
      ctx.lineTo(4, 10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawUFO = (t) => {
      const bob = Math.sin(t * 0.004) * 8;
      const y = ufo.y + bob;

      // Tractor beam
      ufo.beam = (Math.sin(t * 0.006) + 1) / 2;
      const beamGrad = ctx.createLinearGradient(ufo.x, y + 6, ufo.x, y + 90);
      beamGrad.addColorStop(0, `rgba(74, 222, 128, ${0.35 * ufo.beam})`);
      beamGrad.addColorStop(1, 'rgba(74, 222, 128, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(ufo.x - 6, y + 6);
      ctx.lineTo(ufo.x + 6, y + 6);
      ctx.lineTo(ufo.x + 22, y + 90);
      ctx.lineTo(ufo.x - 22, y + 90);
      ctx.closePath();
      ctx.fill();

      // Dome
      const domeGrad = ctx.createRadialGradient(ufo.x - 3, y - 6, 1, ufo.x, y - 4, 12);
      domeGrad.addColorStop(0, 'rgba(191, 219, 254, 1)');
      domeGrad.addColorStop(1, 'rgba(59, 130, 246, 0.6)');
      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.arc(ufo.x, y, 10, Math.PI, 0);
      ctx.fill();

      // Disc body
      const bodyGrad = ctx.createLinearGradient(ufo.x - 24, y, ufo.x + 24, y);
      bodyGrad.addColorStop(0, '#3f3f46');
      bodyGrad.addColorStop(0.5, '#a1a1aa');
      bodyGrad.addColorStop(1, '#3f3f46');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(ufo.x, y + 2, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Under lights
      for (let i = -2; i <= 2; i++) {
        const lit = (Math.sin(t * 0.02 + i) + 1) / 2;
        ctx.fillStyle = `rgba(74, 222, 128, ${0.4 + lit * 0.6})`;
        ctx.beginPath();
        ctx.arc(ufo.x + i * 8, y + 7, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ---------------------------------------------------------------------

    let meteorTimer = 0;

    const tick = (t) => {
      ctx.clearRect(0, 0, W, H);

      // Deep space fill
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#02020a');
      bg.addColorStop(1, '#0a0206');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawNebula(t);
      drawStars(t);

      // Asteroids
      for (const a of asteroids) {
        a.x += a.vx;
        a.y += a.vy;
        a.rot += a.spin;
        if (a.x < -30) a.x = W + 30;
        if (a.x > W + 30) a.x = -30;
        if (a.y < -30) a.y = H + 30;
        if (a.y > H + 30) a.y = -30;
        drawAsteroid(a);
      }

      // Meteors
      meteorTimer++;
      if (meteorTimer > 90 && Math.random() < 0.04) {
        spawnMeteor();
        meteorTimer = 0;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        drawMeteor(m);
        if (m.life > m.maxLife || m.x < -100 || m.x > W + 100 || m.y > H + 100) {
          meteors.splice(i, 1);
        }
      }

      // Satellite orbit
      satellite.angle += satellite.speed;
      drawSatellite(t);

      // Rocket
      rocket.trail.unshift({ x: rocket.x + (Math.random() - 0.5) * 2, y: rocket.y + 12 });
      if (rocket.trail.length > 22) rocket.trail.pop();
      rocket.y += rocket.vy;
      rocket.x += Math.sin(t * 0.003) * 0.4;
      if (rocket.y < -60) rocket.reset();
      drawRocket();

      // UFO
      ufo.x += ufo.vx;
      if (ufo.x > W + 140) ufo.reset();
      drawUFO(t);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
