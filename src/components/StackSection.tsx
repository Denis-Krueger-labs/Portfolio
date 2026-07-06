import { stackGroups } from "../data/stack";
import SectionFrame from "./SectionFrame";

function StackSection() {
  return (
    <SectionFrame
      id="stack"
      label="stack --tools-and-syntax"
      title="Stack"
      intro="Languages, tools, and systems that support the security work."
    >
      <div className="stack-grid">
        {stackGroups.map((group) => (
          <article className="stack-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="chip-list" aria-label={`${group.title} stack`}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export default StackSection;
