/* Journey - snaking SVG route between chapters. The path is rebuilt from the
   real DOM layout, draws itself via stroke-dashoffset, a lime dot rides it,
   and each chapter only reveals once the route reaches its checkpoint. */
import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "../data.js";

export default function Journey() {
  const tlRef = useRef(null);
  const ghostRef = useRef(null);
  const drawRef = useRef(null);
  const dotRef = useRef(null);
  const itemRefs = useRef([]);
  const [revealed, setRevealed] = useState(() => CHAPTERS.map(() => false));
  const [passed, setPassed] = useState(() => CHAPTERS.map(() => false));
  const [endOn, setEndOn] = useState(false);
  const geo = useRef({ len: 0, nodesY: [], endX: 0, endY: 0 });
  const anim = useRef({ cur: 0, target: 0, raf: false });

  useEffect(() => {
    const tl = tlRef.current, ghost = ghostRef.current, draw = drawRef.current, dot = dotRef.current;

    const build = () => {
      const w = tl.clientWidth, h = tl.clientHeight;
      if (!w || !h) return;
      const mobile = window.innerWidth <= 760;
      const cx = mobile ? 14 : w / 2;
      const A = mobile ? 9 : Math.min(78, w * 0.08); /* stays inside the center corridor */
      const pts = [[cx, 0]];
      geo.current.nodesY = [];
      itemRefs.current.forEach((it, i) => {
        if (!it) return;
        const y = it.offsetTop + it.offsetHeight / 2;
        pts.push([cx + (i % 2 === 0 ? -A : A), y]);
        geo.current.nodesY.push(y);
        const node = it.querySelector("[data-node]");
        if (node) node.style.left = `${cx + (i % 2 === 0 ? -A : A)}px`;
      });
      pts.push([cx, h]);
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const midY = (pts[i - 1][1] + pts[i][1]) / 2;
        d += ` C${pts[i - 1][0]},${midY} ${pts[i][0]},${midY} ${pts[i][0]},${pts[i][1]}`;
      }
      ghost.setAttribute("d", d);
      draw.setAttribute("d", d);
      geo.current.len = draw.getTotalLength();
      draw.style.strokeDasharray = geo.current.len;
      draw.style.strokeDashoffset = geo.current.len;
      geo.current.endX = pts[pts.length - 1][0];
      geo.current.endY = h;
    };

    const tick = () => {
      const a = anim.current, g = geo.current;
      a.cur += (a.target - a.cur) * 0.12;
      if (Math.abs(a.target - a.cur) < 0.0005) a.cur = a.target;
      const l = g.len * a.cur;
      draw.style.strokeDashoffset = Math.max(0, g.len - l);
      try {
        const pt = draw.getPointAtLength(l);
        dot.style.left = `${pt.x.toFixed(1)}px`;
        dot.style.top = `${pt.y.toFixed(1)}px`;
        setPassed(g.nodesY.map((ny) => pt.y >= ny - 4));
      } catch {}
      if (a.cur !== a.target) requestAnimationFrame(tick);
      else a.raf = false;
    };

    const upd = () => {
      const g = geo.current, a = anim.current;
      const r = tl.getBoundingClientRect();
      if (r.height <= 0 || !g.len) return;
      a.target = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / r.height));
      try {
        const ptT = drawRef.current.getPointAtLength(g.len * a.target);
        setRevealed((prev) => prev.map((v, i) => v || ptT.y >= g.nodesY[i] - 160));
      } catch {}
      if (a.target >= 0.96) setEndOn(true);
      if (!a.raf) { a.raf = true; requestAnimationFrame(tick); }
    };

    build(); upd();
    window.addEventListener("scroll", upd, { passive: true });
    const onResize = () => { build(); upd(); };
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => { build(); upd(); });
    const t = setTimeout(() => { build(); upd(); }, 900);
    return () => {
      window.removeEventListener("scroll", upd);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="journey" className="relative z-[1] max-w-[1080px] mx-auto px-6 pb-32 pt-24">
      <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55">JOURNEY</div>
      <h2 className="mt-3 mb-12 text-center font-normal text-[clamp(36px,4.6vw,64px)] leading-none tracking-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
        Past years, few <em className="italic">chapters</em>.
      </h2>

      <div ref={tlRef} className="relative max-w-[980px] mx-auto pt-4 pb-2">
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <path ref={ghostRef} fill="none" stroke="var(--line)" strokeWidth="1.5" />
          <path ref={drawRef} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <i ref={dotRef} className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[var(--lime)] border-2 border-[var(--ink)] z-[2] shadow-[0_0_0_5px_rgba(227,232,74,0.18)]" />

        {CHAPTERS.map((c, i) => {
          const flip = i % 2 !== 0;
          return (
            <div key={c.title} ref={(el) => (itemRefs.current[i] = el)}
                 className={`relative grid grid-cols-[44px_1fr] md:grid-cols-[1fr_190px_1fr] items-center py-[clamp(30px,5vh,54px)] transition-all duration-700 ${revealed[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span data-node
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full border-[1.5px] border-[var(--ink)] z-[1] transition-all duration-300 ${passed[i] ? "bg-[var(--lime)] shadow-[0_0_0_5px_rgba(227,232,74,0.22)]" : "bg-[var(--paper)]"}`} />
              <div className={`relative z-[1] col-start-2 md:row-start-1 ${flip ? "md:col-start-3 md:text-left md:pl-5" : "md:col-start-1 md:text-right md:pr-5"}`}>
                <div className="italic text-[clamp(30px,3.4vw,48px)] leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {c.num}<em className="text-[var(--lime)]" style={{ WebkitTextStroke: "1px var(--ink)" }}></em>
                </div>
                <h3 className="mt-1.5 mb-2 font-normal text-[clamp(22px,2.6vw,34px)] leading-tight tracking-tight"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{c.href ? <a href={c.href} target="_blank" rel="noopener" className="hover:underline underline-offset-4">{c.title} ↗</a> : c.title}</h3>
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-55 mb-2.5">{c.meta}</div>
                <p className={`text-[13.5px] leading-relaxed opacity-70 max-w-[34ch] ${flip ? "" : "md:ml-auto"}`}>{c.body}</p>
              </div>
              <div className={`relative z-[1] col-start-2 row-start-2 mt-3.5 md:mt-0 md:row-start-1 justify-self-start ${flip ? "md:col-start-1 md:justify-self-end md:pr-5" : "md:col-start-3 md:pl-5"}`}>
                <div className={`bg-[#FBFAF7] p-2 pb-6 shadow-[0_16px_36px_rgba(20,20,18,0.16)] w-[clamp(160px,18vw,240px)] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] ${flip ? "-rotate-3" : "rotate-3"}`}>
                  <img src={c.img} alt={c.title} className="w-full aspect-[1/0.92] object-cover object-[50%_30%] bg-[var(--soft)]" />
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ left: geo.current.endX || "50%", top: geo.current.endY || "100%" }}
             className={`absolute -translate-x-1/2 z-[2] text-center whitespace-nowrap transition-all duration-1000 ${endOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}>
          <span className="text-[12px] font-semibold tracking-[0.14em] uppercase">Still building. Still achieving.</span>
          <em className="block mt-1.5 italic text-[17px] opacity-70" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>The route continues…</em>
        </div>
      </div>
    </section>
  );
}
