import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import ContactSection from "./components/ContactSection";
import FocusSection from "./components/FocusSection";
import Hero from "./components/Hero";
import ProjectGrid from "./components/ProjectGrid";
import StackSection from "./components/StackSection";

const navItems = [
  { href: "#focus", label: "~/focus" },
  { href: "#projects", label: "~/projects" },
  { href: "#stack", label: "~/stack" },
  { href: "#contact", label: "~/contact" },
];

const timelineItems = [
  { href: "#top", label: "root", index: "01" },
  { href: "#focus", label: "focus", index: "02" },
  { href: "#projects", label: "projects", index: "03" },
  { href: "#stack", label: "stack", index: "04" },
  { href: "#contact", label: "contact", index: "05" },
];

const sectionBridges = {
  focus: {
    index: "01",
    path: "~/portfolio",
    command: "cd ./focus && ls",
    result: "current directory indexed",
  },
  projects: {
    index: "02",
    path: "~/portfolio/focus",
    command: "grep -r \"evidence\" ../projects",
    result: "opening project archive",
  },
  stack: {
    index: "03",
    path: "~/portfolio/projects",
    command: "load ./stack/tool-deck",
    result: "tool deck loaded",
  },
  contact: {
    index: "04",
    path: "~/portfolio/stack",
    command: "spool ./contact/wanted_notice.print",
    result: "contact channel queued",
  },
};

type SectionBridgeData = {
  index: string;
  path: string;
  command: string;
  result: string;
};

type SectionBridgeProps = SectionBridgeData & {
  isVisible: boolean;
  commandDurationMs: number;
};

function SectionBridge({
  index,
  path,
  command,
  result,
  isVisible,
  commandDurationMs,
}: SectionBridgeProps) {
  return (
    <div
      className={["section-bridge", isVisible && "is-visible"]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${result}: ${command}`}
      style={
        {
          "--section-bridge-command-width": `${command.length}ch`,
          "--section-bridge-command-steps": command.length,
          "--section-bridge-command-duration": `${commandDurationMs}ms`,
          "--section-bridge-result-delay": `${commandDurationMs + 260}ms`,
        } as CSSProperties & {
          "--section-bridge-command-width": string;
          "--section-bridge-command-steps": number;
          "--section-bridge-command-duration": string;
          "--section-bridge-result-delay": string;
        }
      }
    >
      <span className="section-bridge__index" aria-hidden="true">
        {index}
      </span>
      <span className="section-bridge__prompt">jessy@portfolio:{path}$</span>
      <code className="section-bridge__command">{command}</code>
      <span className="section-bridge__result">{result}</span>
    </div>
  );
}

type SectionSequenceProps = {
  bridge: SectionBridgeData;
  children: ReactNode;
};

function SectionSequence({ bridge, children }: SectionSequenceProps) {
  const sequenceRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const commandDurationMs = Math.min(2200, Math.max(1150, bridge.command.length * 54));

  useEffect(() => {
    const sequence = sequenceRef.current;

    if (!sequence) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      setIsLoaded(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -16%", threshold: 0.08 },
    );

    observer.observe(sequence);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isLoaded) {
      return undefined;
    }

    const revealDelayMs = commandDurationMs + 920;
    const timeout = window.setTimeout(() => {
      setIsLoaded(true);
    }, revealDelayMs);

    return () => window.clearTimeout(timeout);
  }, [commandDurationMs, isLoaded, isVisible]);

  return (
    <div
      ref={sequenceRef}
      className={[
        "section-sequence",
        isVisible && "is-visible",
        isLoaded && "is-loaded",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionBridge
        {...bridge}
        isVisible={isVisible}
        commandDurationMs={commandDurationMs}
      />
      <div className="section-sequence__content">{children}</div>
    </div>
  );
}

function SectionTimeline() {
  return (
    <nav className="section-timeline" aria-label="Section timeline">
      <span className="section-timeline__rail" aria-hidden="true" />
      {timelineItems.map((item) => (
        <a key={item.href} href={item.href} className="section-timeline__link">
          <span className="section-timeline__index">{item.index}</span>
          <span className="section-timeline__label">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function App() {
  return (
    <div className="app-shell">
      <SectionTimeline />

      <header className="site-header">
        <a
          className="brand-mark brand-mark--moth"
          href="#top"
          aria-label="Moth companion, back to top"
          title="back to top"
        >
          <span aria-hidden="true">࿔‧ ֶָ֢˚˖𐦍˖˚ֶָ֢ ‧࿔</span>
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
        <SectionSequence bridge={sectionBridges.focus}>
          <FocusSection />
        </SectionSequence>
        <SectionSequence bridge={sectionBridges.projects}>
          <ProjectGrid />
        </SectionSequence>
        <SectionSequence bridge={sectionBridges.stack}>
          <StackSection />
        </SectionSequence>
        <SectionSequence bridge={sectionBridges.contact}>
          <ContactSection />
        </SectionSequence>
      </main>
    </div>
  );
}

export default App;
