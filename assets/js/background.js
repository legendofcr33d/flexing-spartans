/* Animated "battlefield" background:
   rising embers, slowly drifting Spartan helmets and occasional arrow volleys. */
(() => {
  const canvas = document.getElementById("battlefield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Same shape as the #helmet SVG symbol (viewBox 200x260)
  const HELMET = new Path2D(
    "M100 0C72 4 56 22 54 58h92C144 22 128 4 100 0ZM100 55C55 55 35 90 35 140v65c0 23 20 41 47 47l2-47c0-15 8-25 16-27 8 2 16 12 16 27l2 47c27-6 47-24 47-47v-65c0-50-20-85-65-85ZM52 118c10-10 32-12 42-4v36c-6-10-24-18-42-16ZM148 118c-10-10-32-12-42-4v36c6-10 24-18 42-16Z"
  );
  const COLORS = ["#ff3b1f", "#e10e0e", "#ff7a1a", "#d9a441"];
  const rand = (a, b) => a + Math.random() * (b - a);

  let w, h, dpr, embers = [], helmets = [], arrows = [], nextVolley = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, (w * h) / 14000));
    embers = Array.from({ length: count }, () => newEmber(true));
    helmets = Array.from({ length: w < 700 ? 2 : 4 }, () => newHelmet(true));
  }

  function newEmber(anywhere) {
    return {
      x: rand(0, w), y: anywhere ? rand(0, h) : h + 10,
      r: rand(0.6, 2.4), vy: rand(0.3, 1.2), sway: rand(0, Math.PI * 2),
      life: rand(0.4, 1), color: COLORS[(Math.random() * COLORS.length) | 0],
    };
  }

  function newHelmet(anywhere) {
    return {
      x: rand(0, w), y: anywhere ? rand(0, h) : h + 200,
      s: rand(0.35, 0.9), vy: rand(0.08, 0.22), rot: rand(-0.4, 0.4), vr: rand(-0.0015, 0.0015),
      a: rand(0.025, 0.06),
    };
  }

  function volley(t) {
    const n = (rand(5, 10)) | 0, fromLeft = Math.random() < 0.5;
    for (let i = 0; i < n; i++) {
      arrows.push({
        x: fromLeft ? rand(-300, -40) : w + rand(40, 300), y: rand(-120, h * 0.35),
        vx: (fromLeft ? 1 : -1) * rand(9, 13), vy: rand(3, 5), len: rand(26, 40), a: rand(0.15, 0.35),
      });
    }
    nextVolley = t + rand(6000, 12000);
  }

  function drawHelmet(o) {
    ctx.save();
    ctx.translate(o.x, o.y); ctx.rotate(o.rot); ctx.scale(o.s, o.s); ctx.translate(-100, -130);
    ctx.fillStyle = `rgba(225,14,14,${o.a})`;
    ctx.fill(HELMET, "evenodd");
    ctx.restore();
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);

    for (const o of helmets) {
      o.y -= o.vy; o.rot += o.vr;
      if (o.y < -220) Object.assign(o, newHelmet(false));
      drawHelmet(o);
    }

    if (t > nextVolley) volley(t);
    ctx.lineCap = "round";
    arrows = arrows.filter((a) => a.x > -400 && a.x < w + 400 && a.y < h + 100);
    for (const a of arrows) {
      a.x += a.vx; a.y += a.vy;
      const ang = Math.atan2(a.vy, a.vx), cx = Math.cos(ang), sy = Math.sin(ang);
      ctx.strokeStyle = `rgba(220,220,225,${a.a})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - cx * a.len, a.y - sy * a.len); ctx.stroke();
      ctx.fillStyle = `rgba(225,14,14,${a.a + 0.2})`;
      ctx.beginPath();
      ctx.moveTo(a.x + cx * 6, a.y + sy * 6);
      ctx.lineTo(a.x - sy * 3, a.y + cx * 3);
      ctx.lineTo(a.x + sy * 3, a.y - cx * 3);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "lighter";
    for (const e of embers) {
      e.y -= e.vy; e.sway += 0.02; e.x += Math.sin(e.sway) * 0.4; e.life -= 0.0015;
      if (e.y < -10 || e.life <= 0) Object.assign(e, newEmber(false));
      const flicker = 0.6 + Math.sin(t * 0.005 + e.sway * 3) * 0.4;
      ctx.globalAlpha = Math.max(0, e.life * flicker);
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";

    if (!reduced) requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", () => {
    clearTimeout(resize.t);
    resize.t = setTimeout(() => { resize(); if (reduced) frame(0); }, 150);
  });
  nextVolley = 1500;
  requestAnimationFrame(frame); // reduced motion: draws one static frame only
})();
