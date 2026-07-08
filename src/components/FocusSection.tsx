import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { focusAreas } from "../data/focusAreas";
import SectionFrame from "./SectionFrame";

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

type FocusFile = {
  title: string;
  filename: string;
  aliases: string[];
  ascii: string;
  description: string;
  tags: string[];
  status: "active" | "planned";
};

type TerminalLine =
  | { id: number; kind: "system"; content: string }
  | { id: number; kind: "command"; content: string }
  | { id: number; kind: "pre"; content: string; variant?: "file" };

const focusFileDetails: Record<
  string,
  {
    filename: string;
    aliases: string[];
    ascii: string;
    tags: string[];
  }
> = {
  "Web Application Security": {
    filename: "web-application-security.txt",
    aliases: ["web", "web-security", "web-app", "web-app-security"],
    ascii: String.raw`GET /login
    |
+---v---+      +-------+
|  APP  | ---> | AUTH  |
+---+---+      +-------+
    |
+---v---+      +-------+
| INPUT | ---> | LOGIC |
+-------+      +-------+`,
    tags: ["HTTP", "AUTH", "INPUT"],
  },
  "Linux & Windows Privilege Escalation": {
    filename: "linux-windows-privesc.txt",
    aliases: ["linux", "windows", "privesc", "privilege-escalation"],
    ascii: String.raw`[user]
  |
  v
[local shell]
  |
  +-- perms / config --> [admin]
  |
  +-- services / paths -> [system]`,
    tags: ["PERMS", "MISCONFIG", "LOCAL"],
  },
  "Network & Traffic Security": {
    filename: "network-traffic-security.txt",
    aliases: ["network", "traffic", "packets", "network-security"],
    ascii: String.raw`[client] ---- packets ---- [server]
    \          |          /
     \      [switch]     /
      \        |        /
       +---- traffic ----+
          recon / protocol`,
    tags: ["RECON", "PACKETS", "SEGMENT"],
  },
  "Vulnerability Analysis": {
    filename: "vulnerability-analysis.txt",
    aliases: ["vuln", "vulnerability", "analysis", "cve"],
    ascii: String.raw`[input] ---> [bug]
               |
               v
[proof] <--- [impact]
   |
   v
[fix] ----> [verify]`,
    tags: ["IMPACT", "ROOT CAUSE", "FIXES"],
  },
  "Secure Software Engineering": {
    filename: "secure-software-engineering.txt",
    aliases: ["secure-software", "software", "engineering", "sse"],
    ascii: String.raw`[threat model]
      |
      v
[design] -> [validate] -> [tests]
      \                      |
       +------ safer code ----+`,
    tags: ["DESIGN", "TESTS", "VALIDATE"],
  },
  "LLM Security": {
    filename: "llm-security.txt",
    aliases: ["llm", "ai", "prompt-injection", "prompt"],
    ascii: String.raw`[user prompt] ---> [LLM] ---> [tool]
      |             ^
      v             |
[injection] --- guardrails ---+
      |
      v
[blocked / logged]`,
    tags: ["PROMPTS", "TOOLS", "DEFENCE"],
  },
  "Embedded & IoT Security": {
    filename: "embedded-iot-security.txt",
    aliases: ["embedded", "iot", "devices", "firmware"],
    ascii: String.raw`[sensor] -- bus --> [firmware]
    |                 |
    v                 v
  [pins]          [device]
    \               /
     +-- attack surface --+`,
    tags: ["DEVICES", "FIRMWARE", "SURFACE"],
  },
  "Active Directory": {
    filename: "active-directory.txt",
    aliases: ["ad", "active-directory", "directory", "windows-domain"],
    ascii: String.raw`[user] ---> [group] ---> [share]
   \          |
    \         v
     +------> [DC]
               |
          roadmap only`,
    tags: ["ROADMAP", "IDENTITY", "PLANNED"],
  },
};

const initialTerminalLines: TerminalLine[] = [
  {
    id: 1,
    kind: "system",
    content: "Denis@portfolio:/focus mounted read-only.",
  },
  {
    id: 2,
    kind: "system",
    content: "Type `ls`, `help`, or `cat web-application-security.txt`.",
  },
  {
    id: 3,
    kind: "system",
    content: "Aliases work too: `cat web`, `cat llm`, `cat privesc`, `cat ad`.",
  },
];

const normalizeToken = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^(\.\/|\/)?focus\//, "")
    .replace(/^\.\//, "")
    .replace(/\.txt$/i, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makePreLine = (
  id: number,
  content: string,
  variant?: "file",
): TerminalLine => ({
  id,
  kind: "pre",
  content,
  variant,
});

function buildFocusFiles(): FocusFile[] {
  return focusAreas.map((area) => {
    const details = focusFileDetails[area.title];

    return {
      title: area.title,
      filename: details.filename,
      aliases: details.aliases,
      ascii: details.ascii,
      description: focusDescriptions[area.title],
      tags: details.tags,
      status: area.status === "planned" ? "planned" : "active",
    };
  });
}

function findFocusFile(files: FocusFile[], requestedFile: string) {
  const requestedToken = normalizeToken(requestedFile);

  return files.find((file) => {
    const searchableTokens = [
      file.filename,
      file.filename.replace(/\.txt$/i, ""),
      file.title,
      ...file.aliases,
    ];

    return searchableTokens.some(
      (searchableToken) => normalizeToken(searchableToken) === requestedToken,
    );
  });
}

function wrapTerminalText(text: string, width: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (!currentLine) {
      currentLine = word;
      return;
    }

    if (`${currentLine} ${word}`.length <= width) {
      currentLine = `${currentLine} ${word}`;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}

function drawAsciiBox(lines: string[], width = 72) {
  const innerWidth = width - 4;
  const border = `+${"-".repeat(width - 2)}+`;
  const emptyLine = `| ${" ".repeat(innerWidth)} |`;
  const boxedLines = lines.flatMap((line) => {
    if (line === "") {
      return [emptyLine];
    }

    if (line === "---") {
      return [`+${"-".repeat(width - 2)}+`];
    }

    if (line.length <= innerWidth) {
      return [`| ${line.padEnd(innerWidth, " ")} |`];
    }

    return wrapTerminalText(line, innerWidth).map(
      (wrappedLine) => `| ${wrappedLine.padEnd(innerWidth, " ")} |`,
    );
  });

  return [border, ...boxedLines, border].join("\n");
}

function buildLsOutput(files: FocusFile[]) {
  const columnWidth = 38;
  const rows: string[] = [];

  for (let index = 0; index < files.length; index += 2) {
    const firstFile = files[index];
    const secondFile = files[index + 1];
    const firstLabel = `${firstFile.filename}${
      firstFile.status === "planned" ? " [planned]" : ""
    }`;
    const secondLabel = secondFile
      ? `${secondFile.filename}${
          secondFile.status === "planned" ? " [planned]" : ""
        }`
      : "";

    rows.push(`${firstLabel.padEnd(columnWidth, " ")}${secondLabel}`.trimEnd());
  }

  return rows.join("\n");
}

function buildFocusFileOutput(file: FocusFile) {
  const asciiLines = file.ascii.split("\n");
  const tagLine = `tags: ${file.tags.join(" / ")}`;
  const fileStatus = `status: ${file.status.toUpperCase()}`;
  const aliases = `aliases: ${file.aliases.slice(0, 4).join(" / ")}`;

  return drawAsciiBox([
    `file: ${file.filename}`,
    fileStatus,
    "---",
    ...asciiLines,
    "---",
    file.title.toUpperCase(),
    file.description,
    tagLine,
    aliases,
  ]);
}

function renderTerminalLine(line: TerminalLine) {
  if (line.kind === "command") {
    return (
      <p
        className="focus-command-terminal__line focus-command-terminal__line--command"
        key={line.id}
      >
        <span>$</span> {line.content}
      </p>
    );
  }

  if (line.kind === "system") {
    return (
      <p
        className="focus-command-terminal__line focus-command-terminal__line--system"
        key={line.id}
      >
        <span>#</span> {line.content}
      </p>
    );
  }

  return (
    <pre
      className={[
        "focus-command-terminal__pre",
        line.variant === "file" ? "focus-command-terminal__pre--file" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      key={line.id}
    >
      {line.content}
    </pre>
  );
}

function FocusSection() {
  const files = useMemo(() => buildFocusFiles(), []);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>(initialTerminalLines);
  const lineIdRef = useRef(initialTerminalLines.length + 1);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const screen = screenRef.current;

    if (!screen) {
      return;
    }

    screen.scrollTo({ top: screen.scrollHeight, behavior: "smooth" });
  }, [history]);

  const nextId = () => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    return id;
  };

  const runCommand = (rawCommand: string) => {
    const trimmedCommand = rawCommand.trim();

    if (!trimmedCommand) {
      return;
    }

    if (trimmedCommand.toLowerCase() === "clear") {
      setHistory(initialTerminalLines);
      lineIdRef.current = initialTerminalLines.length + 1;
      return;
    }

    const [commandName, ...commandArgs] = trimmedCommand.split(/\s+/);
    const normalizedCommandName = commandName.toLowerCase();
    const outputLines: TerminalLine[] = [
      { id: nextId(), kind: "command", content: trimmedCommand },
    ];

    if (normalizedCommandName === "help") {
      outputLines.push(
        makePreLine(
          nextId(),
          [
            "available commands:",
            "  ls                         list focus files",
            "  cat <file-or-alias>         print one focus file",
            "  pwd                        show current path",
            "  whoami                     show portfolio context",
            "  clear                      reset terminal output",
            "",
            "examples:",
            "  cat web",
            "  cat llm-security.txt",
            "  cat active-directory.txt",
          ].join("\n"),
        ),
      );
    } else if (normalizedCommandName === "ls") {
      outputLines.push(makePreLine(nextId(), buildLsOutput(files)));
    } else if (normalizedCommandName === "pwd") {
      outputLines.push(makePreLine(nextId(), "/home/denis/portfolio/focus"));
    } else if (normalizedCommandName === "whoami") {
      outputLines.push(
        makePreLine(
          nextId(),
          "InfoSec student building practical security experience through labs, code, documentation, and projects.",
        ),
      );
    } else if (normalizedCommandName === "cat") {
      const requestedFile = commandArgs.join(" ");
      const file = requestedFile ? findFocusFile(files, requestedFile) : undefined;

      if (file) {
        outputLines.push(makePreLine(nextId(), buildFocusFileOutput(file), "file"));
      } else if (!requestedFile) {
        outputLines.push(
          makePreLine(nextId(), "usage: cat <file>  // try `cat llm` or `cat web`"),
        );
      } else {
        outputLines.push(
          makePreLine(
            nextId(),
            `cat: ${requestedFile}: no such focus file\nrun \`ls\` to list available files`,
          ),
        );
      }
    } else {
      outputLines.push(
        makePreLine(
          nextId(),
          `${commandName}: command not found\ntry \`help\`, \`ls\`, or \`cat web\``,
        ),
      );
    }

    setHistory((currentHistory) => [...currentHistory, ...outputLines]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
    setCommand("");
  };

  return (
    <SectionFrame
      id="focus"
      className="focus-section"
      label="FOCUS -- /CURRENT-DIR"
      title="FOCUS"
    >
      <div
        className="focus-command-terminal"
        aria-label="Focus terminal"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="focus-command-terminal__chrome" aria-hidden="true">
          <div className="focus-command-terminal__dots">
            <span />
            <span />
            <span />
          </div>
          <p>denis@portfolio:/focus</p>
          <span>interactive cat viewer</span>
        </div>

        <div
          className="focus-command-terminal__screen"
          ref={screenRef}
          aria-live="polite"
        >
          {history.map(renderTerminalLine)}

          <form className="focus-command-terminal__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="focus-command-input">
              Type a focus terminal command
            </label>
            <span aria-hidden="true">$</span>
            <input
              id="focus-command-input"
              ref={inputRef}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              type="text"
              value={command}
              placeholder="cat web-application-security.txt"
              onChange={(event) => setCommand(event.target.value)}
            />
            <button className="sr-only" type="submit">
              run command
            </button>
          </form>
        </div>
      </div>
    </SectionFrame>
  );
}

export default FocusSection;
