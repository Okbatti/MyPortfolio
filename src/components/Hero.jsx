/* Hero - chrome-gradient serif wordmark, floating polaroids, statement
   headline, CTAs, and a live IST clock. */
import { useEffect, useState } from "react";

export default function Hero() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      try { setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false })); }
      catch { setTime(new Date().toLocaleTimeString("en-GB", { hour12: false })); }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative z-[1] pt-28 px-6 min-h-[92vh] flex flex-col overflow-hidden">
      <div className="hero-orbit" aria-hidden><i /><i /></div>
      <div className="mx-auto mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent)] backdrop-blur-xl">
        <i className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)] animate-pulse" />
        AI builder · exploring the next frontier
      </div>
      <div className="relative">
        <h1 className="m-0 flex justify-center items-center gap-[0.12em] select-none whitespace-nowrap font-normal text-[clamp(54px,10.4vw,164px)] leading-[0.9] tracking-[-0.045em] text-transparent bg-clip-text"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              backgroundImage: "linear-gradient(178deg,#FFFFFF 4%,#BCEBFF 21%,#6688B9 40%,#F3FBFF 53%,#879AC7 70%,#D9F5FF 88%,#7782A8 99%)",
              backgroundSize: "200% 200%",
            }}>
          <span>owais</span><span>ali</span>
        </h1>
        {/* floating polaroids */}
        <div className="absolute right-[9%] top-[34%] w-[clamp(92px,10vw,156px)] z-[2] hidden sm:block">
          <div className="bg-[#FBFAF7] p-2 pb-6 shadow-[0_18px_40px_rgba(20,20,18,0.28)] animate-[floaty_7s_ease-in-out_infinite]">
            <img src="/assets/owais-profile.png" alt="Owais Ali Khadim Batti" className="w-full aspect-[0.92/1] object-cover object-[50%_25%]" />
          </div>
        </div>
        <div className="absolute left-[4.5%] -top-4 w-[clamp(80px,8.6vw,132px)] hidden sm:block">
          <div className="bg-[#FBFAF7] p-2 pb-6 shadow-[0_18px_40px_rgba(20,20,18,0.28)] -rotate-6">
            <img src="/assets/openclaw.jpg" alt="AI hardware and orchestration" className="w-full aspect-[0.92/1] object-cover" />
          </div>
        </div>
      </div>

      <h2 className="mx-auto mt-14 max-w-[820px] text-center font-normal text-[clamp(38px,4.9vw,74px)] leading-[1.04] tracking-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
        I turn ambitious AI ideas into <em className="italic text-[var(--accent)]">working products</em>.
      </h2>
      <p className="mx-auto mt-6 max-w-[380px] text-center text-[14.5px] leading-relaxed opacity-75">
        Computer Science student focused on AI, machine learning and emerging technology.<br />Building useful systems at the edge of what’s possible.
      </p>

      <div className="flex justify-center gap-3 mt-9">
        <a href="#work" className="bg-[var(--ink)] text-[var(--paper)] px-5 py-3 rounded-md text-[13.5px] font-medium hover:opacity-80 transition-opacity">See the work</a>
        <a href="mailto:okbatti@gmail.com"
           className="inline-flex items-center gap-2.5 bg-[var(--lime)] text-[#141412] px-5 py-3 rounded-md text-[13.5px] font-semibold hover:brightness-105 transition">
          Hire me
          <span className="bg-[#141412] text-[var(--lime)] w-[18px] h-[18px] rounded flex items-center justify-center text-[11px]">→</span>
        </a>
      </div>

      <div className="flex justify-center gap-8 mt-16 text-[11px] font-semibold tracking-[0.1em] opacity-55 uppercase">
        <span>{time} IST</span><span>Bengaluru, India</span><span>B.E. CSE ’27</span>
      </div>
      <div className="text-center mt-auto pb-8 pt-10 text-[15px] opacity-70">Scroll to explore</div>
    </section>
  );
}
