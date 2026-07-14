/* AboutModal - a mission dossier set inside a moving celestial observatory. */
import { useEffect } from "react";

export default function AboutModal({ open, onClose }) {
  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
         className={`about-cosmos fixed inset-0 z-[10006] overflow-auto text-[#EDEAE3] transition-opacity duration-500 ${open ? "opacity-100 is-open" : "opacity-0 pointer-events-none"}`}>
      <div aria-hidden className="about-starcloth" />
      <div aria-hidden className="about-aurora about-aurora-a" />
      <div aria-hidden className="about-aurora about-aurora-b" />
      <div aria-hidden className="about-constellation"><i /><i /><i /><i /><i /></div>
      <button onClick={onClose}
              className="about-close fixed top-6 right-6 z-[4] px-5 py-[11px] rounded-full border border-[#EDEAE3]/30 bg-[#0a1024]/50 backdrop-blur-xl text-[12px] font-semibold tracking-[0.14em] hover:bg-[#EDEAE3] hover:text-[#141412] transition-colors cursor-pointer">
        CLOSE · ESC
      </button>
      <div className="about-layout relative max-w-[1180px] mx-auto px-6 py-24 min-h-screen grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-[clamp(42px,7vw,96px)] items-center box-border">
        <div className="about-copy relative z-[2]">
          <div className="about-kicker"><i /> MISSION DOSSIER · 01</div>
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[var(--lime)]">About the developer</span>
          <h3 className="mt-4 mb-5 text-[clamp(44px,5.2vw,76px)] leading-[0.92] font-bold tracking-[-0.045em]">Hey, I’m<br /><span className="about-name">Owais.</span></h3>
          <p className="mb-4 text-[15.5px] leading-[1.8] opacity-80 max-w-[56ch]">
            I’m a Computer Science student drawn to AI, machine learning and emerging technology. I like turning ambitious ideas into things people can actually run, test and use.
          </p>
          <p className="mb-4 text-[15.5px] leading-[1.8] opacity-80 max-w-[56ch]">
            My work ranges from a multi-agent system running on a Raspberry Pi to browser intelligence, medical-report analysis and game development. Long term, I want to build and scale technology products that create real-world impact.
          </p>
          <div className="about-facts grid grid-cols-2 gap-2.5 mt-7 max-w-[590px]">
            {[
              ["CURRENT ORBIT", "Bengaluru, India"],
              ["FLIGHT PLAN", "B.E. Computer Science · 2027"],
              ["CORE SYSTEM", "AI · ML · Software"],
              ["MISSION", "Build useful technology"],
            ].map(([label, value]) => (
              <div key={label}><span>{label}</span><b>{value}</b></div>
            ))}
          </div>
        </div>
        <div className="about-portrait-wrap relative z-[2]">
          <div className="about-orbit about-orbit-a"><i /></div>
          <div className="about-orbit about-orbit-b"><i /></div>
          <div className="about-planet-label"><span>SUBJECT</span><b>OWAIS ALI</b></div>
          <div className="about-photo-shell">
            <img src="/assets/owais-profile.png" alt="Owais Ali Khadim Batti" />
            <div className="about-scanline" />
            <span className="about-photo-code">OA-27 / HUMAN · BUILDER</span>
          </div>
          <div className="about-moon"><i /></div>
        </div>
      </div>
      <div className="about-quote fixed left-6 md:left-10 bottom-5 z-[3] flex items-baseline gap-3.5 opacity-75">
        <span className="italic text-[clamp(15px,1.6vw,20px)] text-[var(--lime)]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          “Build what matters. Learn from everything.”
        </span>
        <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase opacity-60">- Owais Ali Khadim Batti</span>
      </div>
    </div>
  );
}
