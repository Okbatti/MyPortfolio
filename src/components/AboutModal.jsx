/* AboutModal - frosted glass about panel: bio, lime-accented facts,
   photo, and the Raftaar quote. Esc / outside click / button to close. */
import { useEffect } from "react";

export default function AboutModal({ open, onClose }) {
  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
         className={`fixed inset-0 z-[10006] overflow-auto bg-[#0c0c0b]/55 backdrop-blur-3xl backdrop-saturate-[1.4] text-[#EDEAE3] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <button onClick={onClose}
              className="fixed top-6 right-6 px-5 py-[11px] rounded-full border border-[#EDEAE3]/40 text-[12.5px] font-semibold tracking-wide hover:bg-[#EDEAE3] hover:text-[#141412] transition-colors cursor-pointer">
        CLOSE · ESC
      </button>
      <div className="relative max-w-[1100px] mx-auto px-6 py-28 min-h-screen grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-[clamp(30px,5vw,70px)] items-center box-border">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--lime)]">About the developer</span>
          <h3 className="mt-4 mb-5 text-[clamp(30px,4vw,54px)] font-bold tracking-tight">Hey, I’m <span className="text-[var(--lime)]">Owais.</span></h3>
          <p className="mb-4 text-[15.5px] leading-[1.8] opacity-80 max-w-[56ch]">
            I’m a Computer Science student drawn to AI, machine learning and emerging technology. I like turning ambitious ideas into things people can actually run, test and use.
          </p>
          <p className="mb-4 text-[15.5px] leading-[1.8] opacity-80 max-w-[56ch]">
            My work ranges from a multi-agent system running on a Raspberry Pi to browser intelligence, medical-report analysis and game development. Long term, I want to build and scale technology products that create real-world impact.
          </p>
          <div className="flex gap-6 flex-wrap mt-6 text-[11px] font-semibold tracking-[0.18em] uppercase opacity-75">
            {["Based in Bengaluru, India", "B.E. Computer Science · 2027"].map((f) => (
              <span key={f} className="border-l-2 border-[var(--lime)] pl-2.5">{f}</span>
            ))}
          </div>
        </div>
        <div>
          <img src="/assets/owais-profile.png" alt="Owais Ali Khadim Batti"
               className="w-full max-w-[380px] rounded-[18px] border border-[#EDEAE3]/25 shadow-[0_24px_60px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
      <div className="fixed left-6 bottom-5 flex items-baseline gap-3.5 opacity-75">
        <span className="italic text-[clamp(15px,1.6vw,20px)] text-[var(--lime)]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          “Build what matters. Learn from everything.”
        </span>
        <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase opacity-60">- Owais Ali Khadim Batti</span>
      </div>
    </div>
  );
}
