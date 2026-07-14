/* BlobIntro - first-load overlay: % counter, then an ink-blob (SVG gooey
   metaballs) blooms and reveals the photo. A scroll GESTURE (not scroll
   distance) dismisses it; returning to the very top brings it back. */
import { useEffect, useRef, useState } from "react";
import { NOISE_URI } from "../data.js";

const MB = [[430, 255, 132], [298, 232, 84], [562, 300, 72], [402, 428, 62], [382, 556, 80], [642, 142, 50], [604, 252, 26]];

export default function BlobIntro({ shown, setShown, loading, setLoading }) {
  const [pct, setPct] = useState(0);
  const [burst, setBurst] = useState(false);
  const gooRef = useRef(null);
  const circles = useRef([]);
  const state = useRef({ shown, burst: false });
  state.current.shown = shown;

  /* count 0 -> 100, then bloom the metaballs */
  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const elastic = (t) => { const c = (2 * Math.PI) / 3; return t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c) + 1; };
    let burstAt = null;
    const frame = (now) => {
      if (burstAt === null) {
        const p = Math.min(1, (now - t0) / 1700);
        setPct(Math.round(easeInOut(p) * 100));
        if (p >= 1) { burstAt = now; setBurst(true); state.current.burst = true; setLoading(false); }
      } else {
        const t = now - burstAt;
        circles.current.forEach((c, i) => {
          if (!c) return;
          const [bx, by, br] = MB[i];
          const d = i * 60, e = (t - d) / 1050;
          const r = e <= 0 ? 0 : e < 1 ? br * elastic(e) : br * (1 + 0.12 * Math.sin(now / 900 + i * 1.7));
          const wob = Math.max(0, Math.min(1, (t - d - 1050) / 600));
          c.setAttribute("r", Math.max(0, r).toFixed(1));
          c.setAttribute("cx", (bx + Math.sin(now / 1100 + i * 2.1) * 26 * wob).toFixed(1));
          c.setAttribute("cy", (by + Math.cos(now / 1300 + i * 1.3) * 22 * wob).toFixed(1));
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [setLoading]);

  /* gesture dismisses; back at very top re-shows; wheel swallowed while up */
  useEffect(() => {
    const wheel = (e) => {
      if (!state.current.shown) return;
      e.preventDefault(); e.stopPropagation();
      if (state.current.burst && e.deltaY > 12) setShown(false);
    };
    let ty = null;
    const ts = (e) => { if (state.current.shown) ty = e.touches[0].clientY; };
    const tm = (e) => {
      if (state.current.shown && ty !== null && ty - e.touches[0].clientY > 24) { setShown(false); ty = null; }
    };
    const key = (e) => {
      if (state.current.shown && state.current.burst && ["ArrowDown", "PageDown", " "].includes(e.key)) setShown(false);
    };
    const scroll = () => { if (state.current.burst && window.scrollY <= 2) setShown(true); };
    window.addEventListener("wheel", wheel, { passive: false, capture: true });
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", wheel, { capture: true });
      window.removeEventListener("touchstart", ts);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
    };
  }, [setShown]);

  /* cursor spray merges into the blob */
  const spray = (e) => {
    if (!shown || !burst || !gooRef.current) return;
    const svg = gooRef.current.ownerSVGElement;
    const r = svg.getBoundingClientRect();
    if (!r.width || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    if (Math.random() < 0.6) return;
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", ((e.clientX - r.left) / r.width) * 900);
    c.setAttribute("cy", ((e.clientY - r.top) / r.height) * 700);
    c.setAttribute("r", "0");
    c.setAttribute("fill", "#fff");
    gooRef.current.appendChild(c);
    const t0 = performance.now();
    const anim = (now) => {
      const a = now - t0;
      let rr;
      if (a < 350) { const q = a / 350; rr = 22 * (1 - (1 - q) * (1 - q)); }
      else if (a < 900) { const q = (a - 350) / 550; rr = 22 * (1 - q * q); }
      else { c.remove(); return; }
      c.setAttribute("r", Math.max(0, rr).toFixed(1));
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  return (
    <div onPointerMove={spray}
      className={`fixed inset-0 z-[9990] bg-[var(--paper)] transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply" style={{ backgroundImage: NOISE_URI }} />
      <span className="absolute top-8 right-6 md:right-12 font-mono text-[13px] font-bold tracking-wide transition-opacity duration-500"
            style={{ opacity: burst ? 0 : 1 }}>{pct}%</span>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${burst ? "opacity-100" : "opacity-0"}`}>
        <svg viewBox="0 0 900 700" className="w-[78vw] max-w-[740px] overflow-visible">
          <defs>
            <filter id="goo" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
              <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12" result="goo" />
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" result="nz" />
              <feDisplacementMap in="goo" in2="nz" scale="7" />
            </filter>
            <mask id="blobMask">
              <g ref={gooRef} filter="url(#goo)" fill="#fff">
                {MB.map((m, i) => (
                  <circle key={i} ref={(el) => (circles.current[i] = el)} cx={m[0]} cy={m[1]} r="0" />
                ))}
              </g>
            </mask>
          </defs>
          <image href="/assets/owais-profile.png" x="130" y="-40" width="640" height="780" preserveAspectRatio="xMidYMid slice" mask="url(#blobMask)" />
        </svg>
      </div>
      <div className={`absolute left-6 bottom-6 font-serif italic text-[clamp(18px,2.4vw,30px)] leading-tight transition-all duration-700 delay-200 ${burst ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
           style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
        Ideas matter most when they become <em>real</em>.
      </div>
      <span className={`absolute right-6 bottom-7 text-[11px] font-semibold tracking-[0.14em] uppercase transition-opacity duration-700 delay-500 ${burst ? "opacity-55" : "opacity-0"}`}>
        Scroll to enter
      </span>
    </div>
  );
}
