import { focusAreas } from "../data/focusAreas";
import SectionFrame from "./SectionFrame";

const focusIcons: Record<string, string> = {
  "Web Application Security": new URL(
    "../assets/icons/web.svg",
    import.meta.url,
  ).href,
  "Linux & Windows Privilege Escalation": new URL(
    "../assets/icons/linux.svg",
    import.meta.url,
  ).href,
  "Network & Traffic Security": new URL(
    "../assets/icons/Anetwork.svg",
    import.meta.url,
  ).href,
  "Vulnerability Analysis": new URL(
    "../assets/icons/vuln.svg",
    import.meta.url,
  ).href,
  "Secure Software Engineering": new URL(
    "../assets/icons/software.svg",
    import.meta.url,
  ).href,
  "LLM Security": new URL("../assets/icons/llm.svg", import.meta.url).href,
  "Embedded & IoT Security": new URL(
    "../assets/icons/iot.svg",
    import.meta.url,
  ).href,
  "Active Directory": new URL(
    "../assets/icons/Windows.svg",
    import.meta.url,
  ).href,
};

const focusDescriptions: Record<string, string> = {
  "Web Application Security":
    "HTTP, auth, input handling, and application logic.",
  "Linux & Windows Privilege Escalation":
    "Misconfigurations, permissions, and local attack paths.",
  "Network & Traffic Security":
    "Recon, segmentation, protocols, and packet analysis.",
  "Vulnerability Analysis": "Root cause, exploitability, impact, and fixes.",
  "Secure Software Engineering":
    "Safer design, testing, validation, and threat thinking.",
  "LLM Security": "Prompt injection, tool risks, and defence-in-depth.",
  "Embedded & IoT Security":
    "Firmware, interfaces, and device attack surfaces.",
  "Active Directory": "On the roadmap, not current experience.",
};

function FocusSection() {
  return (
    <SectionFrame
      id="focus"
      className="focus-section"
      label="FOCUS -- CURRENT MAP"
      title="FOCUS"
    >
      <div className="focus-hud">
        <div className="focus-map">
          <div className="focus-map__header">
            <span>Areas I work in &amp; explore</span>
          </div>
          <ul className="focus-grid" aria-label="Focus areas">
            {focusAreas.map((area, index) => {
              const descriptionId = `focus-${index + 1}-description`;

              return (
                <li
                  key={area.title}
                  className={
                    area.status === "planned" ? "is-planned" : undefined
                  }
                  aria-describedby={descriptionId}
                >
                  <span className="focus-card__icon" aria-hidden="true">
                    <img src={focusIcons[area.title]} alt="" loading="lazy" />
                  </span>
                  <div className="focus-card__body">
                    <div className="focus-card__meta">
                      <span className="focus-card__node">
                        NODE {String(index + 1).padStart(2, "0")}
                      </span>
                      {area.status === "planned" ? (
                        <span className="status-pill">planned</span>
                      ) : null}
                    </div>
                    <h3>{area.title}</h3>
                    <p id={descriptionId} className="focus-card__description">
                      {focusDescriptions[area.title]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}

export default FocusSection;
