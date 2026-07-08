import { useEffect, useRef, useState } from "react";
import { stackGroups } from "../data/stack";
import SectionFrame from "./SectionFrame";


import pythonCard from "../assets/stack/cards/Python.png";
import cCard from "../assets/stack/cards/C.png";
import cSharpCard from "../assets/stack/cards/C-Sharp.png";
import bashCard from "../assets/stack/cards/Bash.png";
import javaCard from "../assets/stack/cards/Java.png";
import sqlCard from "../assets/stack/cards/SQL.png";
import typeScriptCard from "../assets/stack/cards/TypeScript.png";

import kaliCard from "../assets/stack/cards/Kali.png";
import burpSuiteCard from "../assets/stack/cards/BurpSuite.png";
import nmapCard from "../assets/stack/cards/Nmap.png";
import gobusterCard from "../assets/stack/cards/Gobuster.png";
import ffufCard from "../assets/stack/cards/ffuf.png";
import sqlMapCard from "../assets/stack/cards/SQL-Map.png";
import metasploitCard from "../assets/stack/cards/Metasploit.png";
import wiresharkCard from "../assets/stack/cards/Wire-Shark.png";
import owaspZapCard from "../assets/stack/cards/OWASP-Zap.png";
import yaraCard from "../assets/stack/cards/Yara.png";

import linuxCard from "../assets/stack/cards/Linux.png";
import windowsCard from "../assets/stack/cards/Windows.png";
import gitCard from "../assets/stack/cards/git.png";
import dockerCard from "../assets/stack/cards/docker.png";
import dotNetCard from "../assets/stack/cards/DotNet.png";
import aspNetCoreCard from "../assets/stack/cards/Dot-Net-ASP.png";
import ciCdCard from "../assets/stack/cards/CI-CD.png";
import reactCard from "../assets/stack/cards/React.png";
import viteCard from "../assets/stack/cards/Vite.png";

const stackGroupLabels: Record<string, string> = {
  Languages: "Languages",
  "Security tools": "Security Tools",
  "Systems and development": "Systems & Development",
};

const defaultStackGroup = stackGroups[0]?.title ?? "Languages";
const stackTransitionMs = 1000;

type StackDeckPhase = "active" | "incoming" | "outgoing";

const normalizeStackItem = (item: string) =>
  item
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

const stackCardImages: Record<string, string> = {
  python: pythonCard,
  c: cCard,
  csharp: cSharpCard,
  bash: bashCard,
  java: javaCard,
  sql: sqlCard,
  typescript: typeScriptCard,

  kali: kaliCard,
  kalilinux: kaliCard,
  burpsuite: burpSuiteCard,
  nmap: nmapCard,
  gobuster: gobusterCard,
  ffuf: ffufCard,
  sqlmap: sqlMapCard,
  metasploit: metasploitCard,
  wireshark: wiresharkCard,
  owaspzap: owaspZapCard,
  yara: yaraCard,

  linux: linuxCard,
  windows: windowsCard,
  git: gitCard,
  docker: dockerCard,
  net: dotNetCard,
  dotnet: dotNetCard,
  aspnetcore: aspNetCoreCard,
  gitlabci: ciCdCard,
  cicd: ciCdCard,
  gitlabcicd: ciCdCard,
  react: reactCard,
  vite: viteCard,
};

const getStackCardImage = (item: string) =>
  stackCardImages[normalizeStackItem(item)];

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
    stackGroupLabels[selectedStackGroupData.title] ??
    selectedStackGroupData.title;

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
                  {group.items.map((item) => {
                    const cardImage = getStackCardImage(item);

                    return (
                      <li
                        className="stack-tech-card"
                        key={item}
                        tabIndex={isActiveDeck ? 0 : -1}
                        aria-label={item}
                      >
                        {cardImage ? (
                          <img
                            className="stack-tech-card__image"
                            src={cardImage}
                            alt=""
                            aria-hidden="true"
                          />
                        ) : (
                          <span className="stack-tech-card__fallback">
                            {item}
                          </span>
                        )}
                      </li>
                    );
                  })}
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
