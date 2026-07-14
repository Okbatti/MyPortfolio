/* Live GitHub proof-of-work plus resume-backed certifications. */
import { useEffect, useState } from "react";

const LEVELS = ["var(--soft)", "#EAEDBE", "#DFE87E", "var(--lime)", "#A9B32E"];
const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Card = ({ title, href, children }) => (
  <div className="rounded-[20px] p-[clamp(20px,2.6vw,32px)] backdrop-blur-2xl bg-white/50 border border-white/55 shadow-[0_18px_50px_rgba(20,20,18,0.1),inset_0_1px_0_rgba(255,255,255,0.7)]">
    <div className="flex justify-between items-center gap-3 mb-5">
      <span className="text-[clamp(20px,2.2vw,27px)] tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{title}</span>
      {href && <a href={href} target="_blank" rel="noopener" className="px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide bg-white/45 border border-white/60 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors">View Profile ↗</a>}
    </div>
    {children}
  </div>
);

export default function Grind() {
  const [gh, setGh] = useState(null);

  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/Okbatti?y=last")
      .then((r) => r.json()).then(setGh).catch(() => setGh({ error: true }));
  }, []);

  const days = gh?.contributions ?? [];
  const months = [];
  if (days.length) {
    let last = -1;
    for (let i = 0; i < days.length; i += 7) {
      const m = new Date(days[i].date + "T00:00:00").getMonth();
      months.push(m !== last ? MN[m] : "");
      last = m;
    }
  }
  const total = gh?.total?.lastYear ?? days.reduce((a, d) => a + d.count, 0);

  return (
    <section id="grind" className="relative z-[1] max-w-[1180px] mx-auto px-6 pb-32">
      <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55">PROOF OF WORK</div>
      <h2 className="mt-3 mb-11 text-center font-normal text-[clamp(36px,4.6vw,64px)] leading-none tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
        Learning in public. Building for <em className="italic">real</em>.
      </h2>

      <Card title="GitHub Activity" href="https://github.com/Okbatti">
        <div className="overflow-x-auto pb-1">
          <div className="w-fit mx-auto">
            <div className="flex text-[10.5px] font-semibold tracking-wide opacity-55 mb-[7px]">
              {months.map((m, i) => <span key={i} className="shrink-0 w-[15.5px]">{m}</span>)}
            </div>
            <div className="grid grid-flow-col gap-[3.5px]" style={{ gridTemplateRows: "repeat(7,12px)", gridAutoColumns: "12px" }}>
              {days.map((d) => <i key={d.date} title={`${d.date} · ${d.count} contributions`} className="w-3 h-3 rounded-[3px]" style={{ background: LEVELS[d.level] }} />)}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-3 mt-4 text-[12.5px] opacity-70 max-w-[860px] mx-auto">
          <span>{gh?.error ? "Could not load GitHub activity right now." : gh ? `${total} contributions in the last year` : "Loading contributions…"}</span>
          <span className="inline-flex items-center gap-1 text-[11px]">Less {LEVELS.map((c, i) => <i key={i} className="w-3 h-3 rounded-[3px] inline-block" style={{ background: c }} />)} More</span>
        </div>
      </Card>

      <div className="mt-4">
        <Card title="Certifications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { date: "JUL 2025", title: "Neural Networks and Deep Learning", org: "DeepLearning.AI · Andrew Ng" },
              { date: "OCT 2025", title: "Principles of Generative AI", org: "Google Cloud" },
            ].map((cert) => (
              <div key={cert.title} className="border border-[var(--line)] rounded-[14px] p-[clamp(18px,2vw,26px)] bg-white/30">
                <p className="m-0 mb-3 text-[10.5px] font-semibold tracking-[0.14em] uppercase opacity-50">{cert.date}</p>
                <h3 className="m-0 text-[clamp(22px,2.4vw,30px)] leading-tight font-normal" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{cert.title}</h3>
                <p className="mt-2 text-[13px] opacity-65">{cert.org}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
