import { useEffect, useRef, useState } from "react";

const ornamentAssets = {
  moon: new URL("../assets/ornaments/moon-dripping-white.png", import.meta.url)
    .href,
  moth: new URL("../assets/ornaments/moth-skull-purple.png", import.meta.url)
    .href,
  profile: new URL("../assets/hero/profile.svg", import.meta.url).href,
};

const terminalLines = [
  "> just enumerating quietly... ᓚ₍⑅^..^₎♡",
  "> break things to understand why they’re exploitable.",
  "> find the root cause, and build better, more secure systems.",
  "> offense to learn. defense to protect.",
];

const ambientTerminalLines = [
  "> cat still judging your code...",
  "> background process: moth_watch.service active",
  "> note: suspicious amount of purple detected",
  "> compiler status: emotionally unavailable",
];

function Hero() {
  const ambientTimerRef = useRef<number | null>(null);
  const [ambientLine, setAmbientLine] = useState<string | null>(null);
  const [ambientVisible, setAmbientVisible] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      return;
    }

    let cancelled = false;

    const scheduleAmbientLine = () => {
      const delay = 14000 + Math.random() * 22000;

      ambientTimerRef.current = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        const nextLine =
          ambientTerminalLines[
            Math.floor(Math.random() * ambientTerminalLines.length)
          ];

        setAmbientLine(nextLine);
        setAmbientVisible(true);

        window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          setAmbientVisible(false);

          window.setTimeout(() => {
            if (!cancelled) {
              setAmbientLine(null);
              scheduleAmbientLine();
            }
          }, 700);
        }, 5200 + Math.random() * 2200);
      }, delay);
    };

    scheduleAmbientLine();

    return () => {
      cancelled = true;

      if (ambientTimerRef.current !== null) {
        window.clearTimeout(ambientTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="terminal-label">root@portfolio:~$ whoami</p>
        <h1 id="hero-title">Denis Krüger</h1>
        <p className="hero__subtitle">InfoSec student at THWS Würzburg</p>
        <p className="hero__signal">
          practical security <span aria-hidden="true">·</span> secure software
          engineering <span aria-hidden="true">·</span> offensive &amp; defensive
          thinking
        </p>

        <div className="hero__actions" aria-label="Primary actions">
          <a className="button button--primary" href="#projects">
            View projects
          </a>
          <a className="button button--ghost" href="#contact">
            Contact
          </a>
        </div>
      </div>

      <div className="hero__terminal" aria-label="Terminal notes">
        <div className="terminal-window__bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="terminal-window__body">
          {terminalLines.map((line) => (
            <p key={line}>
              <span>{line.slice(0, 1)}</span>
              {line.slice(1)}
            </p>
          ))}

          <p
            className={[
              "hero__ambient-line",
              ambientVisible && "is-visible",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!ambientVisible}
          >
            {ambientLine ?? "\u00a0"}
          </p>
        </div>
      </div>

      <aside className="hero__profile-artifact" aria-label="Profile artifact">
        <div className="hero__profile-bar" aria-hidden="true">
          <span className="hero__profile-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="hero__profile-file">profile.svg</span>
        </div>
        <div className="hero__profile-frame">
          <img
            src={ornamentAssets.profile}
            alt="Denis Krüger profile illustration"
            loading="eager"
          />
        </div>
        <p className="hero__profile-caption">subject avatar // verified</p>
      </aside>

      <div className="hero__decor" aria-hidden="true">
        <div className="cyber-mesh" aria-hidden="true">
          <div className="cyber-mesh__grid" />
        </div>
        <img
          className="hero-ornament hero-ornament--moon"
          src={ornamentAssets.moon}
          alt=""
          aria-hidden="true"
        />
        <img
          className="hero-ornament hero-ornament--moth"
          src={ornamentAssets.moth}
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export default Hero;
