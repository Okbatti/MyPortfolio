/* Nav - glass pill nav (desktop) + burger that morphs into ✕ with a compact
   glass panel. Scrolling with the panel open closes it and scrolls on. */
import { useEffect } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#journey", label: "Journey" },
  { href: "#grind", label: "Grind" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ hidden, menuOpen, setMenuOpen, openAbout }) {
  /* scrolling while the menu is open closes it, then the gesture scrolls */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
    };
  }, [menuOpen, setMenuOpen]);

  const glass = "backdrop-blur-2xl backdrop-saturate-[1.8] bg-white/45 border border-white/55 shadow-[0_12px_36px_rgba(20,20,18,0.14),inset_0_1px_0_rgba(255,255,255,0.75)]";

  return (
    <>
      {/* glass pill nav */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000] hidden md:flex items-center gap-0.5 p-[5px] rounded-full transition-opacity duration-700 ${glass} ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href}
             className="px-4 py-2 rounded-full text-[13px] font-semibold text-[var(--ink)]/85 hover:bg-[var(--ink)]/10 hover:text-[var(--ink)] transition-colors whitespace-nowrap">
            {l.label}
          </a>
        ))}
        <button onClick={openAbout}
                className="px-4 py-2 rounded-full text-[13px] font-semibold text-[var(--ink)]/85 hover:bg-[var(--ink)]/10 hover:text-[var(--ink)] transition-colors cursor-pointer">
          About
        </button>
      </nav>

      {/* burger / close (same spot, morphs) */}
      <button aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`fixed top-5 left-5 z-[10003] w-[53px] h-[53px] rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-500 ${glass} ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        {menuOpen ? (
          <span className="text-[17px] leading-none">✕</span>
        ) : (
          <span className="flex flex-col gap-[5px]">
            <i className="block w-[22px] h-[2px] bg-current" /><i className="block w-[22px] h-[2px] bg-current" /><i className="block w-[22px] h-[2px] bg-current" />
          </span>
        )}
      </button>

      {/* compact glass panel */}
      {menuOpen && (
        <div className="fixed inset-0 z-[10002] pointer-events-none">
          <div className={`pointer-events-auto absolute top-[86px] left-5 w-[min(460px,calc(100vw-40px))] rounded-3xl p-6 ${glass} animate-[panelIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both]`}
               style={{ animationName: "none", opacity: 1 }}>
            <div className="text-[12px] font-semibold tracking-[0.14em] opacity-55 mb-3">● NAVIGATION</div>
            <nav className="flex flex-col">
              {[...LINKS, { href: "#about-open", label: "About" }].map((l) => (
                <a key={l.label} href={l.href === "#about-open" ? "#" : l.href}
                   onClick={(e) => { if (l.href === "#about-open") { e.preventDefault(); openAbout(); } setMenuOpen(false); }}
                   className="flex justify-between items-baseline gap-4 border-t border-[var(--line)] px-3 py-2 text-[clamp(26px,3.2vw,38px)] leading-tight tracking-tight rounded-xl hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
                   style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {l.label} <span className="text-[0.45em]">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
