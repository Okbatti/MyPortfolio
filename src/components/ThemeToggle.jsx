/* ThemeToggle - dark/light switch with the circle-sweep reveal (View
   Transitions API). flushSync makes React apply the theme synchronously
   inside the transition so the snapshot captures the NEW theme. */
import { flushSync } from "react-dom";

export default function ThemeToggle({ hidden }) {
  const toggle = (e) => {
    const de = document.documentElement;
    const apply = () => {
      de.classList.toggle("dark");
      try { localStorage.setItem("owais-portfolio-theme", de.classList.contains("dark") ? "dark" : "light"); } catch {}
    };
    if (!document.startViewTransition) {
      de.classList.add("theming");
      apply();
      setTimeout(() => de.classList.remove("theming"), 350);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 24;
    de.style.setProperty("--vt-x", `${cx | 0}px`);
    de.style.setProperty("--vt-y", `${cy | 0}px`);
    de.style.setProperty("--vt-r", `${rad | 0}px`);
    de.classList.add("theming");
    const done = () => de.classList.remove("theming");
    const safety = setTimeout(done, 1400);
    try {
      const vt = document.startViewTransition(() => flushSync(apply));
      vt.finished.finally(() => { clearTimeout(safety); done(); });
    } catch { apply(); clearTimeout(safety); done(); }
  };

  return (
    <button aria-label="Toggle dark mode" onClick={toggle}
            className={`fixed top-5 right-5 z-[10001] w-[53px] h-[53px] rounded-full flex items-center justify-center text-[17px] cursor-pointer active:scale-[0.88] transition-[transform,opacity] duration-500 backdrop-blur-2xl bg-white/45 border border-white/55 shadow-[0_12px_36px_rgba(20,20,18,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      ☾
    </button>
  );
}
