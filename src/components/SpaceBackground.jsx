import { useEffect, useMemo, useRef } from "react";

const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export default function SpaceBackground() {
  const sceneRef = useRef(null);
  const stars = useMemo(() => {
    const random = mulberry32(20260714);
    return Array.from({ length: 112 }, (_, i) => ({
      id: i,
      x: random() * 100,
      y: random() * 100,
      size: random() < 0.84 ? 1 : random() * 2.2 + 1.2,
      alpha: random() * 0.62 + 0.25,
      delay: random() * -7,
    }));
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event) => {
      scene.style.setProperty("--space-x", `${(event.clientX / innerWidth - 0.5) * 18}px`);
      scene.style.setProperty("--space-y", `${(event.clientY / innerHeight - 0.5) * 14}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={sceneRef} aria-hidden className="space-scene">
      <div className="space-nebula space-nebula-one" />
      <div className="space-nebula space-nebula-two" />
      <div className="star-field">
        {stars.map((star) => (
          <i key={star.id} className="star" style={{
            left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size,
            opacity: star.alpha, animationDelay: `${star.delay}s`,
          }} />
        ))}
      </div>

      <div className="orbit orbit-one"><i className="orbit-moon" /></div>
      <div className="orbit orbit-two" />
      <div className="planet planet-violet"><i /></div>
      <div className="planet planet-amber" />

      <div className="spacecraft">
        <i className="craft-panel craft-panel-left" />
        <i className="craft-body" />
        <i className="craft-window" />
        <i className="craft-panel craft-panel-right" />
      </div>
      <i className="shooting-star" />
      <div className="space-vignette" />
    </div>
  );
}
