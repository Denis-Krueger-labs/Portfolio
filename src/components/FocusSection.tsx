import { focusAreas } from "../data/focusAreas";
import SectionFrame from "./SectionFrame";

function FocusSection() {
  return (
    <SectionFrame
      id="focus"
      label="focus --current-map"
      title="Focus"
      intro="Security topics I am studying, building around, and returning to through practical labs."
    >
      <ul className="focus-grid" aria-label="Focus areas">
        {focusAreas.map((area) => (
          <li
            key={area.title}
            className={area.status === "planned" ? "is-planned" : undefined}
          >
            <span className="focus-grid__index" aria-hidden="true" />
            <span>{area.title}</span>
            {area.status === "planned" ? (
              <span className="status-pill">planned</span>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}

export default FocusSection;
