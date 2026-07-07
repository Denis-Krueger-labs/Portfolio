import { useEffect, useRef, useState } from "react";
import { stackGroups } from "../data/stack";
import SectionFrame from "./SectionFrame";

const stackGroupLabels: Record<string, string> = {
  Languages: "Languages",
  "Security tools": "Security Tools",
  "Systems and development": "Systems & Development",
};

const defaultStackGroup = stackGroups[0]?.title ?? "Languages";
const stackTransitionMs = 420;

type StackDeckPhase = "active" | "incoming" | "outgoing";

function StackSection() {
  const [selectedStackGroup, setSelectedStackGroup] =
    useState(defaultStackGroup);
  const [visibleStackGroup, setVisibleStackGroup] =
    useState(defaultStackGroup);
  const [incomingStackGroup, setIncomingStackGroup] = useState<string | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = useRef(false);
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      prefersReducedMotion.current = motionQuery.matches;
    };

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);

      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const getStackGroup = (groupTitle: string) =>
    stackGroups.find((group) => group.title === groupTitle) ?? stackGroups[0];

  const selectedStackGroupData = getStackGroup(selectedStackGroup);
  const visibleStackGroupData = getStackGroup(visibleStackGroup);
  const incomingStackGroupData = incomingStackGroup
    ? getStackGroup(incomingStackGroup)
    : null;
  const selectedStackGroupLabel =
    stackGroupLabels[selectedStackGroupData.title] ?? selectedStackGroupData.title;

  const renderedStackDecks: Array<{
    group: (typeof stackGroups)[number];
    phase: StackDeckPhase;
  }> = [
    {
      group: visibleStackGroupData,
      phase: isAnimating ? "outgoing" : "active",
    },
  ];

  if (incomingStackGroupData) {
    renderedStackDecks.push({
      group: incomingStackGroupData,
      phase: "incoming",
    });
  }

  const handleStackGroupSelect = (groupTitle: string) => {
    if (isAnimating || groupTitle === selectedStackGroup) {
      return;
    }

    setSelectedStackGroup(groupTitle);

    if (prefersReducedMotion.current) {
      setVisibleStackGroup(groupTitle);
      setIncomingStackGroup(null);
      setIsAnimating(false);
      return;
    }

    setIncomingStackGroup(groupTitle);
    setIsAnimating(true);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    transitionTimer.current = window.setTimeout(() => {
      setVisibleStackGroup(groupTitle);
      setIncomingStackGroup(null);
      setIsAnimating(false);
      transitionTimer.current = null;
    }, stackTransitionMs);
  };

  return (
    <SectionFrame
      id="stack"
      className="stack-section"
      label="STACK -- TOOLS AND SYNTAX"
      title="STACK"
    >
      <div className="stack-loadout">
        <div
          className="stack-selector"
          role="tablist"
          aria-label="Stack categories"
        >
          {stackGroups.map((group) => {
            const groupLabel = stackGroupLabels[group.title] ?? group.title;
            const isSelected = group.title === selectedStackGroup;

            return (
              <button
                className={[
                  "stack-selector__button",
                  isSelected && "stack-selector__button--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                type="button"
                key={group.title}
                role="tab"
                aria-selected={isSelected}
                aria-pressed={isSelected}
                disabled={isAnimating}
                onClick={() => handleStackGroupSelect(group.title)}
              >
                {groupLabel}
              </button>
            );
          })}
        </div>
        <p className="stack-active-label">
          <span>Active deck:</span> {selectedStackGroupLabel}
        </p>
        <div className="stack-grid">
          {renderedStackDecks.map(({ group, phase }) => {
            const groupLabel = stackGroupLabels[group.title] ?? group.title;
            const isActiveDeck = phase === "active";

            return (
              <article
                className={`stack-deck stack-deck--${phase}`}
                key={`${group.title}-${phase}`}
                role="tabpanel"
                aria-hidden={!isActiveDeck}
                aria-label={`${groupLabel} stack`}
              >
                <h3>{groupLabel}</h3>
                <ul
                  className="chip-list stack-deck__cards"
                  aria-label={`${groupLabel} cards`}
                >
                  {group.items.map((item) => (
                    <li
                      className="stack-tech-card"
                      key={item}
                      tabIndex={isActiveDeck ? 0 : -1}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </SectionFrame>
  );
}

export default StackSection;
