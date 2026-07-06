import type { ReactNode } from "react";

type SectionFrameProps = {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
  intro?: string;
};

function SectionFrame({
  id,
  label,
  title,
  children,
  className,
  intro,
}: SectionFrameProps) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      className={["section-frame", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className="section-frame__ghost" aria-hidden="true">
        {title}
      </div>
      <div className="section-frame__header">
        <p className="terminal-label">{label}</p>
        <h2 id={headingId}>{title}</h2>
        {intro ? <p className="section-frame__intro">{intro}</p> : null}
      </div>
      <div className="section-frame__body">{children}</div>
    </section>
  );
}

export default SectionFrame;
