/* StackGrid - resume tech stack: filter tabs + rounded grid; each cell
   flips on hover from the tool name to its brand icon + a one-line tagline. */
import { useState } from "react";
import { TOOLS, TABS } from "../data.js";

const SqlIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[clamp(16px,1.5vw,20px)]"><path fill="#6B7FD7" d="M12 2c-4.4 0-8 1.3-8 3v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5c0-1.7-3.6-3-8-3zm0 2c3.9 0 6 1 6 1s-2.1 1-6 1-6-1-6-1 2.1-1 6-1zm6 15c0 .4-2.1 1.4-6 1.4S6 19.4 6 19V8.6C7.5 9.4 9.6 9.8 12 9.8s4.5-.4 6-1.2V19z" /></svg>
);
const RagIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[clamp(16px,1.5vw,20px)]"><path fill="#C98A1B" d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6zM5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" /></svg>
);

export default function StackGrid() {
  const [tab, setTab] = useState("all");

  return (
    <section id="stack" className="relative z-[1] border-y border-[var(--line)] px-6 py-16">
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55"> STACK · TOOLS I SHIP WITH</div>
        <h2 className="mt-3 text-center font-normal text-[clamp(40px,5.4vw,78px)] leading-none tracking-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          {/* A full toolbox, zero <em className="italic">excuses</em>. */}
        </h2>

        {/* filter tabs */}
        <div className="flex justify-center flex-wrap gap-1 w-fit mx-auto mt-7 p-[5px] rounded-full backdrop-blur-2xl bg-white/50 border border-white/55 shadow-[0_10px_30px_rgba(20,20,18,0.1),inset_0_1px_0_rgba(255,255,255,0.7)]">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-[18px] py-[9px] rounded-full text-[12.5px] font-semibold cursor-pointer transition-colors ${tab === t.id ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--ink)] opacity-60 hover:opacity-90"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* rounded grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 max-w-[980px] mx-auto mt-6 rounded-2xl overflow-hidden border-t border-l border-[var(--line)]">
          {TOOLS.filter((t) => tab === "all" || t.cat === tab).map((t) => (
            <div key={t.n} className="group relative min-h-[clamp(54px,4.6vw,68px)] flex items-center justify-center overflow-hidden border-r border-b border-[var(--line)] hover:bg-white/40 transition-colors">
              <sup className="absolute top-[7px] left-[10px] text-[9px] font-semibold opacity-45 z-[2]">{t.n}</sup>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-3">
                <span className="text-[clamp(13.5px,1.25vw,17px)] font-semibold opacity-85 px-2.5 text-center">{t.name}</span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {t.icon ? (
                  <img src={`https://cdn.simpleicons.org/${t.icon}`} alt={t.name} loading="lazy"
                       className="w-[clamp(16px,1.5vw,20px)]" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : t.name === "SQL" ? <SqlIcon /> : <RagIcon />}
                <em className="italic text-[clamp(11.5px,1.05vw,14px)] opacity-75 text-center px-2.5 leading-tight"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{t.tag}</em>
              </div>
            </div>
          ))}
          <div className="col-span-full min-h-[46px] flex items-center justify-center gap-4 border-r border-b border-[var(--line)] px-6">
            <i className="h-px flex-1 max-w-[240px] bg-[var(--ink)]/40 opacity-60" />
            <em className="italic text-[clamp(15px,1.5vw,20px)] opacity-75 whitespace-nowrap"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>The stack continues further…</em>
            <i className="h-px flex-1 max-w-[240px] bg-[var(--ink)]/40 opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
