/* WorkDeck - pinned project pile: each card rockets in from alternating sides,
   then lands on the stack. Hover reveals the project details. */
import { useEffect, useRef } from "react";
import { PROJECTS } from "../data.js";

const ROTS = [-1.2, 1.8, -1.4, 1.1, -1.6, 1.3];
const OXS = [0, 7, -6, 5, -5, 6];
const OYS = [0, 4, -3, 5, -4, 3];

export default function WorkDeck() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  /* Cards alternate left/right like arriving spacecraft, then settle into the pile. */
  useEffect(() => {
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
    const easeOutBack = (t) => {
      const c1 = 1.18, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const upd = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const cards = cardRefs.current.filter(Boolean);
      const vh = window.innerHeight;
      const r = stage.getBoundingClientRect();
      let p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
      p = clamp(p * 1.12 - 0.04); /* a short reveal before the first launch */
      const seq = p * (cards.length + 0.18);
      const arrivals = cards.map((_, i) => clamp(seq - i));
      cards.forEach((c, i) => {
        const d = arrivals[i];
        const e = easeOutQuint(d);
        const dock = easeOutBack(d);
        const side = i % 2 === 0 ? -1 : 1; // left, right, left, right
        const travel = Math.max(window.innerWidth * 1.05, c.offsetWidth * 1.38);
        const x = side * travel * (1 - dock) + OXS[i] * e;
        const arc = Math.sin(d * Math.PI) * vh * (0.13 + i * 0.012);
        const y = -arc + Math.sin(d * Math.PI * 2) * side * 18 + OYS[i] * e;
        const bank = side * -13 * (1 - e) + side * Math.sin(d * Math.PI) * 4.5;
        const rot = bank + ROTS[i] * e;
        const depth = arrivals.slice(i + 1).reduce((sum, value) => sum + easeOutQuint(value), 0);
        const sc = (0.82 + 0.18 * e) * (1 - 0.022 * depth);
        const engine = d < 0.84 ? 1 : clamp((1 - d) / 0.16);
        const ignition = clamp(d * 7);
        c.style.setProperty("--flight", (1 - e).toFixed(3));
        c.style.setProperty("--engine", (engine * ignition).toFixed(3));
        c.style.setProperty("--velocity", clamp(1 - d * 0.72).toFixed(3));
        c.style.transform = `translate(-50%,-50%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      });
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { window.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);

  return (
    <section id="work" className="relative z-[1] max-w-[1180px] mx-auto px-6 pt-32">
      <div ref={stageRef} className="h-[650vh] relative -mt-2">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          <div className="pt-24 shrink-0">
            <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55"> WORK </div>
            <h2 className="mt-3 mb-2.5 mx-auto max-w-[700px] text-center font-normal text-[clamp(40px,5.4vw,78px)] leading-none tracking-tight"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Things I’ve <em className="italic">shipped</em>, not just started.
            </h2>
            {/* <p className="text-center text-[13px] font-medium tracking-[0.06em] opacity-50">( HOVER A CARD · CLICK TO OPEN )</p> */}
          </div>

          <div className="relative flex-1 min-h-0">
            {PROJECTS.map((pr, i) => (
              <a key={pr.title} href={pr.href} target="_blank" rel="noopener"
                 ref={(el) => (cardRefs.current[i] = el)}
                 data-flight-side={i % 2 === 0 ? "left" : "right"}
                 style={{ "--flight": 1, "--engine": 0, "--velocity": 1, transform: `translate(-50%,-50%) translateX(${i % 2 === 0 ? "-135vw" : "135vw"})` }}
                 className="rocket-card group absolute left-1/2 top-1/2 w-[min(860px,calc(100vw-44px))] h-[min(54vh,460px)] grid grid-cols-1 md:grid-cols-[1fr_1.15fr] md:grid-rows-[auto_1fr_auto] gap-x-8 p-[22px] bg-[var(--card)] border border-[var(--line)] rounded-lg overflow-visible will-change-transform shadow-[0_30px_70px_rgba(20,20,18,0.22)]">
                <div className="cargo-stamp" aria-hidden><i /> PROJECT CARGO · 0{i + 1}</div>
                <div className="rocket-tug" aria-hidden>
                  <i className="tug-tether" />
                  <span className="tug-body"><i className="tug-window" /><b className="tug-seam" /></span>
                  <i className="tug-fin tug-fin-top" />
                  <i className="tug-fin tug-fin-bottom" />
                  <span className="tug-engine"><i /><b /><em /></span>
                </div>
                <div className="relative min-h-0 md:col-start-2 md:row-span-3 overflow-hidden rounded bg-[var(--soft)]">
                  <img src={pr.img} alt={pr.title}
                       className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="md:col-start-1 md:row-start-2 self-end flex justify-between items-baseline gap-2.5 font-normal text-[clamp(24px,2.8vw,40px)] tracking-tight"
                     style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {pr.title} <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </div>
                <div className="md:col-start-1 md:row-start-3 mt-3 text-[11px] font-semibold tracking-[0.1em] opacity-55">{pr.sub}</div>

                {/* lime shutter wipe */}
                <div className="absolute inset-0 z-[2] overflow-hidden rounded-lg bg-[#F2FF00] text-[#141412] flex flex-col justify-between p-[22px] pointer-events-none origin-center scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-y-100">
                  <span className="text-[10.5px] font-semibold tracking-[0.06em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-300">{pr.tag}</span>
                  <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-300">
                    <b className="block text-[clamp(22px,2vw,30px)] font-extrabold tracking-tight">{pr.metric}</b>
                    <span className="block mt-0.5 text-[11.5px] leading-snug">{pr.metricSub}</span>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed max-w-[32ch]">{pr.body}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <a href="https://github.com/Okbatti" target="_blank" rel="noopener"
           className="border border-[var(--ink)]/40 px-[22px] py-2.5 rounded-md text-[13.5px] font-medium hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors">
          More on GitHub ↗
        </a>
      </div>
    </section>
  );
}
