/* Contact - glass option cards, react-hook-form (same rules as v1) sending
   through EmailJS (mailto fallback without keys), socials, footer meta. */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
/* GA4 event helper: no-op if gtag is absent (e.g. ad blocker, local dev) */
const track = (name) => window.gtag?.("event", name);

/* Fill with your EmailJS keys (VITE_EMAILJS_* in .env also works) */
const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

const glassCard = "rounded-[20px] backdrop-blur-2xl bg-white/50 border border-white/55 shadow-[0_18px_50px_rgba(20,20,18,0.1),inset_0_1px_0_rgba(255,255,255,0.7)]";
const field = "w-full box-border px-[15px] py-[13px] rounded-xl border bg-white/35 text-[var(--ink)] text-sm placeholder:opacity-35 focus:outline-none focus:bg-white/55 transition-colors";
const pill = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-semibold tracking-wide backdrop-blur-xl bg-white/50 border border-white/55 shadow-[0_8px_24px_rgba(20,20,18,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-[var(--ink)] hover:text-[var(--paper)] hover:-translate-y-0.5 transition-all";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      try { setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false })); } catch {}
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const onSubmit = async (v) => {
    if (EMAILJS.service && EMAILJS.template && EMAILJS.publicKey) {
      try {
        await emailjs.send(EMAILJS.service, EMAILJS.template, v, EMAILJS.publicKey);
        reset(); setSent(true);
      } catch { alert("Failed to send. Try emailing me directly."); }
    } else {
      const body = `Name: ${v.name}%0APhone: ${v.phone || "-"}%0AEmail: ${v.email}%0A%0A${encodeURIComponent(v.message)}`;
      window.location.href = `mailto:okbatti@gmail.com?subject=${encodeURIComponent("Portfolio inquiry from " + v.name)}&body=${body}`;
      reset(); setSent(true);
    }
  };

  const err = (k) => errors[k] && <em className="not-italic text-[11.5px] text-[#C4504A]">{errors[k].message}</em>;

  return (
    <section id="contact" className="relative z-[1] border-t border-[var(--line)] px-6 pt-28 pb-10">
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center text-[12px] font-semibold tracking-[0.14em] opacity-55">GET IN TOUCH</div>
        <h2 className="mt-3 mb-9 mx-auto max-w-[800px] text-center font-normal text-[clamp(40px,5.4vw,78px)] leading-[1.02] tracking-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Let’s build something people <em className="italic">remember</em>.
        </h2>

        {/* two glass option cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[820px] mx-auto mb-11">
          {[
            {
  
  title: "My journey",
  body: "From school-level computer science to AI systems, technical events and products that run in the real world.",
  cta: "Read more →",
  href: "#about"
},
            { label: "", title: "Email me directly", body: "Every message lands in my inbox, not a form void. I reply as soon as I can.", cta: "Write to me →", href: "mailto:okbatti@gmail.com" },
          ].map((c) => (
            <div key={c.title} className={`${glassCard} p-7 flex flex-col items-start gap-2.5 text-left hover:-translate-y-1 transition-transform duration-500`}>
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] opacity-60">
                <i className="w-[7px] h-[7px] rounded-full bg-[var(--lime)] border border-[var(--ink)]/35" />{c.label}
              </span>
              <span className="text-[clamp(24px,2.4vw,30px)] tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{c.title}</span>
              <p className="m-0 mb-2.5 text-[13.5px] leading-relaxed opacity-70">{c.body}</p>
              <a href={c.href} className="mt-auto bg-[var(--ink)] text-[var(--paper)] px-5 py-[11px] rounded-full text-[13px] font-semibold hover:brightness-125 hover:-translate-y-px transition-all">{c.cta}</a>
            </div>
          ))}
        </div>

        {/* form (react-hook-form, same rules as v1) */}
        <div className={`${glassCard} max-w-[820px] mx-auto mb-11 p-[clamp(24px,3vw,40px)]`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full border border-[#5E9E4D]/45 text-[#4E8A3F] text-[10.5px] font-bold tracking-[0.14em]">
            <i className="w-[7px] h-[7px] rounded-full bg-[#5E9E4D] animate-pulse" />OPEN TO AI & SOFTWARE OPPORTUNITIES
          </div>
          <h3 className="mt-4 mb-1.5 font-normal text-[clamp(30px,3.6vw,48px)] leading-none tracking-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Let’s work <em className="italic">together!</em>
          </h3>
          <p className="mb-6 text-[13.5px] opacity-65">Always thrilled to collaborate with passionate minds on impactful projects.</p>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-[62px] h-[62px] mx-auto mb-3.5 rounded-full flex items-center justify-center text-[26px] text-[#4E8A3F] border border-[#5E9E4D]/45 bg-[#5E9E4D]/10">✓</div>
              <h4 className="mb-2 font-normal text-[26px]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Thanks for reaching out!</h4>
              <p className="mb-5 text-[13.5px] opacity-65">Your message landed safely. I’ll get back within 24 hours.</p>
              <button onClick={() => setSent(false)} className={pill}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-60">Name <span className="text-[#5E9E4D]">*</span></label>
                  <input {...register("name", { required: "Name is required" })} placeholder="Full name"
                         className={`${field} ${errors.name ? "border-[#C4504A]" : "border-[var(--line)]"}`} />
                  {err("name")}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-60">Phone</label>
                  <input {...register("phone")} type="tel" placeholder="+91" className={`${field} border-[var(--line)]`} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-60">Email <span className="text-[#5E9E4D]">*</span></label>
                <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })}
                       type="email" placeholder="you@mail.com"
                       className={`${field} ${errors.email ? "border-[#C4504A]" : "border-[var(--line)]"}`} />
                {err("email")}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-[0.12em] uppercase opacity-60">Message <span className="text-[#5E9E4D]">*</span></label>
                <textarea {...register("message", { required: "Message is required" })} rows={5} placeholder="Tell me about your project…"
                          className={`${field} resize-y ${errors.message ? "border-[#C4504A]" : "border-[var(--line)]"}`} />
                {err("message")}
              </div>
              <button type="submit" disabled={isSubmitting}
                      className="self-start mt-1 px-[26px] py-[13px] rounded-full bg-[var(--ink)] text-[var(--paper)] text-[13.5px] font-semibold cursor-pointer hover:brightness-125 hover:-translate-y-px transition-all disabled:opacity-55 disabled:cursor-default">
                {isSubmitting ? "Sending…" : "Send Message →"}
              </button>
            </form>
          )}
        </div>

        <div className="flex justify-center">
          <a href="mailto:okbatti@gmail.com"
             className="text-[clamp(22px,3vw,40px)] tracking-tight border-b-[1.5px] border-[var(--ink)]/40 pb-1.5 hover:border-[var(--ink)] transition-colors"
             style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            okbatti@gmail.com
          </a>
        </div>

        {/* socials: each click is a GA4 event */}
        <div className="flex justify-center flex-wrap gap-2.5 mt-9">
          <a className={pill} href="https://www.linkedin.com/in/owais-ali-khadim-batti-2278831a1/" target="_blank" rel="noopener" onClick={() => track("linkedin_click")}>LINKEDIN ↗</a>
          <a className={pill} href="https://github.com/Okbatti" target="_blank" rel="noopener" onClick={() => track("github_click")}>GITHUB ↗</a>
          <a className={pill} href="/assets/Owais_Ali_Resume.pdf" target="_blank" rel="noopener" onClick={() => track("resume_download")}>
            <i className="w-[7px] h-[7px] rounded-full bg-[var(--lime)] border border-[var(--ink)]/35" />RESUME ↓
          </a>
        </div>

        <div className="flex items-center justify-between gap-3.5 flex-wrap mt-16 border-t border-[var(--line)] pt-4 text-[11px] font-medium tracking-[0.1em] opacity-55">
          <span>India · {time} IST</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-semibold tracking-[0.1em] cursor-pointer hover:underline">BACK TO TOP ↑</button>
          <span>© 2026 OWAIS ALI KHADIM BATTI</span>
        </div>
      </div>
    </section>
  );
}
