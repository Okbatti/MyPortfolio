/* App - composition root + shared state for the intro, menu, and about modal. */
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
import SpaceBackground from "./components/SpaceBackground.jsx";
import Goku from "./components/Goku.jsx";
import AboutModal from "./components/AboutModal.jsx";

export default function App() {
  const [introUp, setIntroUp] = useState(true);       // intro overlay currently shown
  const [loading, setLoading] = useState(true);       // % counter still running
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introUp || menuOpen || aboutOpen ? "hidden" : "";
  }, [introUp, menuOpen, aboutOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("owais-portfolio-theme");
      if (saved !== "light") document.documentElement.classList.add("dark");
    } catch {}
  }, []);

  return (
    <>
      <SpaceBackground />

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
        <Contact />
      </main>

      <Goku hidden={loading || menuOpen} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
