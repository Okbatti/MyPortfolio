/* Goku - oneko-style cursor companion. Chases the pointer with easing,
   flips to face travel direction, swaps to the standing sprite when idle,
   and chroma-keys solid sprite backgrounds at runtime. */
import { useEffect, useRef } from "react";

/* Drop your sprites in public/assets: goku.png (running) + goku-idle.png (standing).
   Solid backgrounds are keyed out automatically at runtime. */
export default function Goku({ hidden }) {
  const elRef = useRef(null);
  const runImg = useRef(null);
  const idleImg = useRef(null);

  useEffect(() => {
    if (!window.matchMedia?.("(pointer: fine)").matches) return;
    const el = elRef.current;
    const keyBg = (img) => {
      try {
        if (/\.gif(\?|$)/i.test(img.src)) return;
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height);
        const p = d.data;
        if (p[3] > 200) {
          const [r0, g0, b0] = p;
          for (let i = 0; i < p.length; i += 4)
            if (Math.abs(p[i] - r0) < 48 && Math.abs(p[i+1] - g0) < 48 && Math.abs(p[i+2] - b0) < 48) p[i+3] = 0;
          x.putImageData(d, 0, 0);
          img.src = c.toDataURL("image/png");
        }
      } catch {}
    };
    [runImg, idleImg].forEach((r) => {
      const img = r.current;
      if (!img) return;
      const on = () => { if (img.naturalWidth > 0 && !img.src.startsWith("data:")) keyBg(img); };
      img.addEventListener("load", on);
      if (img.complete) on();
    });

    let x = innerWidth - 90, y = innerHeight - 140, tx = x, ty = y;
    let face = 1, last = 0, lastMove = performance.now(), raf;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; lastMove = performance.now(); };
    window.addEventListener("pointermove", onMove, { passive: true });
    const loop = (ts) => {
      if (!last) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      const dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
      const moving = dist > 30 && performance.now() - lastMove < 2600;
      if (moving) {
        const sp = Math.min(60 + dist * 1.1, 180);
        x += (dx / dist) * sp * dt;
        y += (dy / dist) * sp * dt;
        if (Math.abs(dx) > 4) face = dx > 0 ? 1 : -1;
      }
      if (runImg.current && idleImg.current) {
        runImg.current.style.display = moving ? "block" : "none";
        idleImg.current.style.display = moving ? "none" : "block";
        const fx = `scaleX(${face})`;
        runImg.current.style.transform = fx;
        idleImg.current.style.transform = fx;
        runImg.current.style.animation = moving ? "bob 0.3s ease-in-out infinite alternate" : "none";
      }
      el.style.transform = `translate(${(x - el.offsetWidth / 2).toFixed(1)}px,${(y - el.offsetHeight + 2).toFixed(1)}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div ref={elRef} aria-hidden
         className={`fixed left-0 top-0 h-[54px] w-auto z-[10005] pointer-events-none will-change-transform drop-shadow-[0_4px_6px_rgba(20,20,18,0.3)] transition-opacity duration-500 max-[768px]:hidden ${hidden ? "opacity-0" : "opacity-100"}`}>
      <img ref={runImg} src="/assets/goku.png" alt="" className="h-[54px] w-auto [image-rendering:pixelated]"
           onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
      <img ref={idleImg} src="/assets/goku-idle.png" alt="" className="h-[54px] w-auto hidden [image-rendering:pixelated]"
           onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
    </div>
  );
}
