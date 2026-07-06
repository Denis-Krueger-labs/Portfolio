const terminalLines = [
  "> just enumerating quietly...",
  "> break things to understand why they’re exploitable.",
  "> find the root cause, and build better, more secure systems.",
  "> offense to learn. defense to protect.",
];

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="terminal-label">root@portfolio:~$ whoami</p>
        <h1 id="hero-title">Denis Krüger</h1>
        <p className="hero__subtitle">InfoSec student at THWS Würzburg</p>
        <p className="hero__signal">
          practical security <span aria-hidden="true">·</span> secure software
          engineering <span aria-hidden="true">·</span> offensive & defensive
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
        </div>
      </div>

      <div className="hero__decor" aria-hidden="true">
        <div className="moon-placeholder" />
        <div className="moth-placeholder">
          <span />
        </div>
      </div>
    </section>
  );
}

export default Hero;
