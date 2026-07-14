/* Experience - internship history: one glass card per role with resume
   bullet points, and the project shipped during that role linked below. */
import { EXPERIENCE } from "../data.js";

export default function Experience() {
  return (
    <section id="experience" className="relative z-[1] max-w-[980px] mx-auto px-6 pt-28 pb-8">
      <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55">EXPERIENCE </div>
      <h2 className="mt-3 mb-10 text-center font-normal text-[clamp(34px,4.6vw,64px)] leading-none tracking-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
        Leadership under <em className="italic">pressure</em>.
      </h2>

      {EXPERIENCE.map((e) => (
        <div key={e.role} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-7 md:p-9 shadow-[0_18px_50px_rgba(20,20,18,0.10)]">
          {/* role, dates and company */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[clamp(22px,2.4vw,32px)] tracking-tight font-normal"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{e.role}</h3>
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-55">{e.when}</span>
          </div>
          <div className="mt-1 text-[13px] font-semibold tracking-[0.08em] uppercase opacity-70">{e.org}</div>

          {/* what actually got done */}
          <ul className="mt-5 space-y-3">
            {e.points.map((p, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed opacity-80">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--lime)] shrink-0" />{p}
              </li>
            ))}
          </ul>

          {/* the project that came out of it */}
          {e.project && (
            <a href={e.project.href} target="_blank" rel="noopener"
               className="group mt-6 flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--soft)] px-5 py-4 transition-colors hover:bg-[var(--lime)] hover:text-[#141412]">
              <div>
                <div className="text-[10.5px] font-semibold tracking-[0.12em] uppercase opacity-60">{e.project.label}</div>
                <div className="text-[15px] font-semibold mt-0.5">{e.project.title}</div>
              </div>
              <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          )}
        </div>
      ))}
    </section>
  );
}
