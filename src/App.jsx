/* App - composition root + shared state: intro visibility, menu, about modal,
   and "weatherOn" (whether the sky has been released into the background). */
import { useEffect, useState } from "react";
import BlobIntro from "./components/BlobIntro.jsx";
import Nav from "./components/Nav.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Hero from "./components/Hero.jsx";
import StackGrid from "./components/StackGrid.jsx";
import WorkDeck from "./components/WorkDeck.jsx";
import Experience from "./components/Experience.jsx";
import Journey from "./components/Journey.jsx";
import Grind from "./components/Grind.jsx";
import Contact from "./components/Contact.jsx";
import SkyStrip from "./components/SkyStrip.jsx";
import Goku from "./components/Goku.jsx";
import AboutModal from "./components/AboutModal.jsx";
import { NOISE_URI } from "./data.js";

export default function App() {
  const [introUp, setIntroUp] = useState(true);       // intro overlay currently shown
  const [loading, setLoading] = useState(true);       // % counter still running
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [weatherOn, setWeatherOn] = useState(false);  // cloud background: gray (false) or live blue (true)

  useEffect(() => {
    document.body.style.overflow = introUp || menuOpen || aboutOpen ? "hidden" : "";
  }, [introUp, menuOpen, aboutOpen]);

  useEffect(() => {
    try {
      if (localStorage.getItem("owais-portfolio-theme") === "dark") document.documentElement.classList.add("dark");
    } catch {}
  }, []);

  return (
    <>
      {/* ambient layers */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-multiply"
           style={{ backgroundImage: NOISE_URI }} />

      <BlobIntro shown={introUp} setShown={setIntroUp} loading={loading} setLoading={setLoading} />
      <Nav hidden={loading} menuOpen={menuOpen} setMenuOpen={setMenuOpen} openAbout={() => setAboutOpen(true)} />
      <ThemeToggle hidden={loading} />

      <main className="relative z-[1]">
        <Hero />
        <StackGrid />
        <WorkDeck />
        <Experience />
        <Journey />
        <Grind />
        <Contact weatherOn={weatherOn} setWeatherOn={setWeatherOn} />
        <SkyStrip weatherOn={weatherOn} setWeatherOn={setWeatherOn} />
      </main>

      <Goku hidden={loading || menuOpen} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
