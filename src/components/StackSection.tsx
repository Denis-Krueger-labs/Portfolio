import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  stackCategories,
  stackEvidence,
  stackTechnologies,
  type StackCategoryId,
  type StackEvidence,
  type StackTechnology,
} from "../data/stack";
import SectionFrame from "./SectionFrame";
import "./StackEvidenceMatrix.css";

type Selection =
  | { type: "technology"; id: string }
  | { type: "evidence"; id: string };

type ConnectionLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const defaultCategory: StackCategoryId = "security";
const defaultSelection: Selection = {
  type: "technology",
  id: "ebpf",
};

function getTechnology(id: string): StackTechnology | undefined {
  return stackTechnologies.find((technology) => technology.id === id);
}

function getEvidence(id: string): StackEvidence | undefined {
  return stackEvidence.find((evidence) => evidence.id === id);
}

function StackSection() {
  const [activeCategory, setActiveCategory] =
    useState<StackCategoryId>(defaultCategory);
  const [selection, setSelection] = useState<Selection>(defaultSelection);
  const [hoverSelection, setHoverSelection] = useState<Selection | null>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const technologyRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const evidenceRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const visibleTechnologies = useMemo(
    () =>
      stackTechnologies.filter(
        (technology) => technology.category === activeCategory,
      ),
    [activeCategory],
  );

  const visualSelection = hoverSelection ?? selection;

  const selectedTechnology =
    selection.type === "technology" ? getTechnology(selection.id) : undefined;
  const selectedEvidence =
    selection.type === "evidence" ? getEvidence(selection.id) : undefined;

  const relatedTechnologyIds = useMemo(() => {
    if (visualSelection.type === "technology") {
      return new Set([visualSelection.id]);
    }

    return new Set(
      stackTechnologies
        .filter((technology) =>
          technology.evidence.includes(visualSelection.id),
        )
        .map((technology) => technology.id),
    );
  }, [visualSelection]);

  const relatedEvidenceIds = useMemo(() => {
    if (visualSelection.type === "evidence") {
      return new Set([visualSelection.id]);
    }

    return new Set(getTechnology(visualSelection.id)?.evidence ?? []);
  }, [visualSelection]);

  const updateLines = () => {
    const board = boardRef.current;

    if (!board) {
      setLines([]);
      return;
    }

    const boardRect = board.getBoundingClientRect();
    const nextLines: ConnectionLine[] = [];

    if (visualSelection.type === "technology") {
      const technologyNode = technologyRefs.current[visualSelection.id];

      if (!technologyNode) {
        setLines([]);
        return;
      }

      const sourceRect = technologyNode.getBoundingClientRect();

      for (const evidenceId of relatedEvidenceIds) {
        const evidenceNode = evidenceRefs.current[evidenceId];

        if (!evidenceNode) {
          continue;
        }

        const targetRect = evidenceNode.getBoundingClientRect();

        nextLines.push({
          id: `${visualSelection.id}-${evidenceId}`,
          x1: sourceRect.right - boardRect.left,
          y1: sourceRect.top + sourceRect.height / 2 - boardRect.top,
          x2: targetRect.left - boardRect.left,
          y2: targetRect.top + targetRect.height / 2 - boardRect.top,
        });
      }
    } else {
      const evidenceNode = evidenceRefs.current[visualSelection.id];

      if (!evidenceNode) {
        setLines([]);
        return;
      }

      const targetRect = evidenceNode.getBoundingClientRect();

      for (const technologyId of relatedTechnologyIds) {
        const technologyNode = technologyRefs.current[technologyId];

        if (!technologyNode) {
          continue;
        }

        const sourceRect = technologyNode.getBoundingClientRect();

        nextLines.push({
          id: `${technologyId}-${visualSelection.id}`,
          x1: sourceRect.right - boardRect.left,
          y1: sourceRect.top + sourceRect.height / 2 - boardRect.top,
          x2: targetRect.left - boardRect.left,
          y2: targetRect.top + targetRect.height / 2 - boardRect.top,
        });
      }
    }

    setLines(nextLines);
  };

  useLayoutEffect(() => {
    updateLines();
  }, [activeCategory, visualSelection, visibleTechnologies.length]);

  useEffect(() => {
    const board = boardRef.current;

    if (!board) {
      return undefined;
    }

    const handleResize = () => {
      window.requestAnimationFrame(updateLines);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(board);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [visualSelection, activeCategory]);

  const handleCategorySelect = (categoryId: StackCategoryId) => {
    setActiveCategory(categoryId);
    setHoverSelection(null);

    const firstTechnology = stackTechnologies.find(
      (technology) => technology.category === categoryId,
    );

    if (firstTechnology) {
      setSelection({
        type: "technology",
        id: firstTechnology.id,
      });
    }
  };

  const handleTechnologySelect = (technology: StackTechnology) => {
    setActiveCategory(technology.category);
    setSelection({
      type: "technology",
      id: technology.id,
    });
  };

  const handleEvidenceSelect = (evidence: StackEvidence) => {
    setSelection({
      type: "evidence",
      id: evidence.id,
    });
  };

  const inspectedTechnology =
    selectedTechnology ??
    (selectedEvidence ? undefined : getTechnology(defaultSelection.id));

  return (
    <SectionFrame
      id="stack"
      className="stack-section"
      label="STACK -- EVIDENCE MATRIX"
      title="STACK"
    >
      <div className="evidence-stack">
        <div className="evidence-stack__toolbar">
          <div
            className="evidence-stack__categories"
            role="tablist"
            aria-label="Technology categories"
          >
            {stackCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const count = stackTechnologies.filter(
                (technology) => technology.category === category.id,
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={[
                    "evidence-stack__category",
                    isActive && "is-active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <span>{category.shortLabel}</span>
                  <strong>{category.label}</strong>
                  <small>{String(count).padStart(2, "0")}</small>
                </button>
              );
            })}
          </div>

          <div className="evidence-stack__command" aria-hidden="true">
            <span>0N1S3C@stack:~$</span>
            <code>trace {activeCategory} --evidence</code>
          </div>
        </div>

        <div className="evidence-stack__layout">
          <div
            ref={boardRef}
            className="evidence-stack__board"
            aria-label="Interactive technology evidence map"
          >
            <svg
              className="evidence-stack__wires"
              aria-hidden="true"
              width="100%"
              height="100%"
            >
              {lines.map((line) => {
                const controlOffset = Math.max(
                  46,
                  Math.abs(line.x2 - line.x1) * 0.38,
                );
                const path = [
                  `M ${line.x1} ${line.y1}`,
                  `C ${line.x1 + controlOffset} ${line.y1},`,
                  `${line.x2 - controlOffset} ${line.y2},`,
                  `${line.x2} ${line.y2}`,
                ].join(" ");

                return (
                  <path
                    key={line.id}
                    d={path}
                    className="evidence-stack__wire"
                  />
                );
              })}
            </svg>

            <div className="evidence-stack__tech-pane">
              <div className="evidence-stack__pane-heading">
                <span>toolchain.nodes</span>
                <small>
                  {String(visibleTechnologies.length).padStart(2, "0")} loaded
                </small>
              </div>

              <div
                className="evidence-stack__tech-list"
                role="list"
                aria-label={`${activeCategory} technologies`}
              >
                {visibleTechnologies.map((technology, index) => {
                  const isFocus =
                    visualSelection.type === "technology" &&
                    visualSelection.id === technology.id;
                  const isRelated = relatedTechnologyIds.has(technology.id);
                  const shouldDim =
                    visualSelection.type === "evidence" && !isRelated;

                  return (
                    <button
                      key={technology.id}
                      ref={(node: HTMLButtonElement | null) => {
                        technologyRefs.current[technology.id] = node;
                      }}
                      type="button"
                      role="listitem"
                      className={[
                        "evidence-stack__tech-node",
                        isFocus && "is-focus",
                        isRelated && "is-related",
                        shouldDim && "is-dimmed",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleTechnologySelect(technology)}
                      onMouseEnter={() =>
                        setHoverSelection({
                          type: "technology",
                          id: technology.id,
                        })
                      }
                      onMouseLeave={() => setHoverSelection(null)}
                      onFocus={() =>
                        setHoverSelection({
                          type: "technology",
                          id: technology.id,
                        })
                      }
                      onBlur={() => setHoverSelection(null)}
                    >
                      <span className="evidence-stack__node-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{technology.label}</strong>
                      <small>
                        {technology.evidence.length > 0
                          ? `${technology.evidence.length} linked`
                          : "unlinked"}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="evidence-stack__evidence-pane">
              <div className="evidence-stack__pane-heading">
                <span>evidence.targets</span>
                <small>
                  {String(stackEvidence.length).padStart(2, "0")} indexed
                </small>
              </div>

              <div className="evidence-stack__evidence-list">
                {stackEvidence.map((evidence, index) => {
                  const isFocus =
                    visualSelection.type === "evidence" &&
                    visualSelection.id === evidence.id;
                  const isRelated = relatedEvidenceIds.has(evidence.id);
                  const shouldDim =
                    visualSelection.type === "technology" && !isRelated;

                  return (
                    <button
                      key={evidence.id}
                      ref={(node: HTMLButtonElement | null) => {
                        evidenceRefs.current[evidence.id] = node;
                      }}
                      type="button"
                      className={[
                        "evidence-stack__evidence-node",
                        isFocus && "is-focus",
                        isRelated && "is-related",
                        shouldDim && "is-dimmed",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleEvidenceSelect(evidence)}
                      onMouseEnter={() =>
                        setHoverSelection({
                          type: "evidence",
                          id: evidence.id,
                        })
                      }
                      onMouseLeave={() => setHoverSelection(null)}
                      onFocus={() =>
                        setHoverSelection({
                          type: "evidence",
                          id: evidence.id,
                        })
                      }
                      onBlur={() => setHoverSelection(null)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{evidence.label}</strong>
                        <small>{evidence.kind}</small>
                      </div>
                      <b aria-hidden="true">↗</b>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="evidence-stack__inspector" aria-live="polite">
            {inspectedTechnology ? (
              <>
                <div className="evidence-stack__inspector-path">
                  inspect://technology/{inspectedTechnology.id}
                </div>
                <p className="evidence-stack__inspector-kicker">
                  {
                    stackCategories.find(
                      (category) =>
                        category.id === inspectedTechnology.category,
                    )?.label
                  }
                </p>
                <h3>{inspectedTechnology.label}</h3>
                <p className="evidence-stack__inspector-summary">
                  {inspectedTechnology.summary}
                </p>

                <div className="evidence-stack__inspector-block">
                  <span>observed work</span>
                  <ul>
                    {inspectedTechnology.work.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="evidence-stack__inspector-block">
                  <span>used in</span>
                  {inspectedTechnology.evidence.length > 0 ? (
                    <div className="evidence-stack__inspector-evidence">
                      {inspectedTechnology.evidence.map((evidenceId) => {
                        const evidence = getEvidence(evidenceId);

                        if (!evidence) {
                          return null;
                        }

                        return (
                          <button
                            key={evidence.id}
                            type="button"
                            onClick={() => handleEvidenceSelect(evidence)}
                          >
                            <strong>{evidence.label}</strong>
                            <small>{evidence.kind}</small>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="evidence-stack__unlinked">
                      No public flagship artifact linked. Kept visible as
                      documented coursework / prior experience.
                    </p>
                  )}
                </div>
              </>
            ) : null}

            {selectedEvidence ? (
              <>
                <div className="evidence-stack__inspector-path">
                  inspect://evidence/{selectedEvidence.id}
                </div>
                <p className="evidence-stack__inspector-kicker">
                  {selectedEvidence.kind}
                </p>
                <h3>{selectedEvidence.label}</h3>
                <p className="evidence-stack__inspector-summary">
                  {selectedEvidence.summary}
                </p>

                <div className="evidence-stack__inspector-block">
                  <span>linked technologies</span>
                  <div className="evidence-stack__technology-links">
                    {stackTechnologies
                      .filter((technology) =>
                        technology.evidence.includes(selectedEvidence.id),
                      )
                      .map((technology) => (
                        <button
                          key={technology.id}
                          type="button"
                          onClick={() => handleTechnologySelect(technology)}
                        >
                          {technology.label}
                        </button>
                      ))}
                  </div>
                </div>

                <a
                  className="evidence-stack__open-evidence"
                  href={selectedEvidence.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open evidence ↗
                </a>
              </>
            ) : null}

            <div className="evidence-stack__inspector-footer" aria-hidden="true">
              <span>evidence over percentages</span>
              <span>no proficiency bars detected</span>
            </div>
          </aside>
        </div>
      </div>
    </SectionFrame>
  );
}

export default StackSection;
