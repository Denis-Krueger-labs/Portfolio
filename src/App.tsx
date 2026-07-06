import ContactSection from "./components/ContactSection";
import FocusSection from "./components/FocusSection";
import Hero from "./components/Hero";
import ProjectGrid from "./components/ProjectGrid";
import StackSection from "./components/StackSection";

const navItems = [
  { href: "#focus", label: "Focus" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Denis Krüger home">
          DK
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <Hero />
        <FocusSection />
        <ProjectGrid />
        <StackSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
