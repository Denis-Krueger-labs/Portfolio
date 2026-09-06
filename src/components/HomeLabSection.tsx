import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultHomeLabLog,
  documentedLabPhase,
  homeLabNodes,
  homeLabRepositoryUrl,
  homeLabRoadmapUrl,
  type LabLog,
  type LabNode,
} from "../data/homeLab";
import SectionFrame from "./SectionFrame";
import "./HomeLabSection.css";

type HeartbeatState =
  | "documented"
  | "checking"
  | "online"
  | "offline"
  | "unreachable";

type LabHeartbeatPayload = {
  online?: boolean;
  phase?: string;
  lastSeen?: string;
  latestLog?: {
    title?: string;
    date?: string;
    url?: string;
  };
};

const statusUrl = (
  import.meta.env.VITE_MORI_LAB_STATUS_URL as string | undefined
)?.trim();

function normalizeLog(
  candidate: LabHeartbeatPayload["latestLog"],
): LabLog | null {
  if (!candidate?.title || !candidate?.url) {
    return null;
  }

  return {
    title: candidate.title,
    date: candidate.date ?? "live",
    url: candidate.url,
  };
}

function nodeStateLabel(node: LabNode) {
  switch (node.state) {
    case "operational":
      return "operational";
    case "ready":
      return "template ready";
    case "active-development":
      return "active development";
  }
}

function HomeLabSection() {
  const [selectedNodeId, setSelectedNodeId] = useState("pve");
  const [heartbeatState, setHeartbeatState] = useState<HeartbeatState>(
    statusUrl ? "checking" : "documented",
  );
  const [livePayload, setLivePayload] = useState<LabHeartbeatPayload | null>(
    null,
  );
  const [moriLine, setMoriLine] = useState(
    statusUrl
      ? "checking whether the lab is awake..."
      : "heartbeat endpoint not armed. reading the last documented state.",
  );

  const selectedNode =
    homeLabNodes.find((node) => node.id === selectedNodeId) ?? homeLabNodes[0];

  const latestLog =
    normalizeLog(livePayload?.latestLog) ?? defaultHomeLabLog;

  const currentPhase = livePayload?.phase ?? documentedLabPhase;

  const queryHeartbeat = useCallback(async () => {
    if (!statusUrl) {
      setHeartbeatState("documented");
      setMoriLine(
        "no live endpoint yet. poke the topology instead; the repository snapshot is still useful.",
      );
      return;
    }

    setHeartbeatState("checking");
    setMoriLine("sending a tiny heartbeat packet through the void...");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);

    try {
      const response = await fetch(statusUrl, {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`heartbeat returned ${response.status}`);
      }

      const payload = (await response.json()) as LabHeartbeatPayload;
      setLivePayload(payload);

      if (payload.online === true) {
        setHeartbeatState("online");
        setMoriLine("lab answered. go read the latest log before somebody reboots it.");
      } else {
        setHeartbeatState("offline");
        setMoriLine("lab did not report online. either sleeping, patching, or plotting.");
      }
    } catch {
      setHeartbeatState("unreachable");
      setMoriLine("heartbeat vanished into the network. documented state preserved.");
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (statusUrl) {
      void queryHeartbeat();
    }
  }, [queryHeartbeat]);

  const heartbeatLabel = useMemo(() => {
    switch (heartbeatState) {
      case "checking":
        return "QUERYING";
      case "online":
        return "ONLINE";
      case "offline":
        return "OFFLINE";
      case "unreachable":
        return "UNREACHABLE";
      case "documented":
        return "DOCUMENTED";
    }
  }, [heartbeatState]);

  return (
    <SectionFrame
      id="lab"
      className="home-lab-section stack-section"
      label="HOME LAB -- LIVE INFRASTRUCTURE"
      title="HOME LAB"
    >
      <div className="home-lab-console">
        <div className="home-lab-console__topline">
          <span>tiny data center // one component at a time</span>
          <a
            href={homeLabRepositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            repository ↗
          </a>
        </div>

        <div className="home-lab-layout">
          <div className="lab-topology" aria-label="Interactive home lab topology">
            <div className="lab-topology__heading">
              <span>architecture.map</span>
              <span>select a node</span>
            </div>

            <div className="lab-topology__tree">
              <button
                type="button"
                className={`lab-node lab-node--root${
                  selectedNodeId === "pve" ? " is-selected" : ""
                }`}
                onClick={() => setSelectedNodeId("pve")}
              >
                <span className="lab-node__id">pve</span>
                <span>Proxmox VE 9.2</span>
              </button>

              <div className="lab-topology__branch">
                <span className="lab-topology__glyph" aria-hidden="true">
                  ├─
                </span>
                <button
                  type="button"
                  className={`lab-node${
                    selectedNodeId === "fw01" ? " is-selected" : ""
                  }`}
                  onClick={() => setSelectedNodeId("fw01")}
                >
                  <span className="lab-node__id">fw01</span>
                  <span>OPNsense boundary</span>
                </button>
              </div>

              <div className="lab-topology__subtree">
                <div className="lab-topology__branch">
                  <span className="lab-topology__glyph" aria-hidden="true">
                    ├─
                  </span>
                  <button
                    type="button"
                    className={`lab-node${
                      selectedNodeId === "dc01" ? " is-selected" : ""
                    }`}
                    onClick={() => setSelectedNodeId("dc01")}
                  >
                    <span className="lab-node__id">dc01</span>
                    <span>AD DS + DNS</span>
                  </button>
                </div>

                <div className="lab-topology__branch">
                  <span className="lab-topology__glyph" aria-hidden="true">
                    └─
                  </span>
                  <button
                    type="button"
                    className={`lab-node${
                      selectedNodeId === "client01" ? " is-selected" : ""
                    }`}
                    onClick={() => setSelectedNodeId("client01")}
                  >
                    <span className="lab-node__id">client01</span>
                    <span>Windows 11 Enterprise</span>
                  </button>
                </div>
              </div>

              <div className="lab-topology__branch">
                <span className="lab-topology__glyph" aria-hidden="true">
                  ├─
                </span>
                <button
                  type="button"
                  className={`lab-node${
                    selectedNodeId === "nix01" ? " is-selected" : ""
                  }`}
                  onClick={() => setSelectedNodeId("nix01")}
                >
                  <span className="lab-node__id">nix01</span>
                  <span>Mori OS</span>
                </button>
              </div>

              <div className="lab-topology__branch">
                <span className="lab-topology__glyph" aria-hidden="true">
                  └─
                </span>
                <button
                  type="button"
                  className={`lab-node${
                    selectedNodeId === "debian-gold" ? " is-selected" : ""
                  }`}
                  onClick={() => setSelectedNodeId("debian-gold")}
                >
                  <span className="lab-node__id">debian-gold</span>
                  <span>Debian 13 template</span>
                </button>
              </div>
            </div>

            <div className="lab-inspector" aria-live="polite">
              <div className="lab-inspector__prompt">
                <span>0N1S3C@lab:~$</span>
                <code> inspect {selectedNode.id}</code>
              </div>

              <div className="lab-inspector__meta">
                <span>{selectedNode.role}</span>
                <span>{nodeStateLabel(selectedNode)}</span>
              </div>

              <p>{selectedNode.detail}</p>

              <ul aria-label={`${selectedNode.label} technologies`}>
                {selectedNode.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside
            className={`lab-heartbeat lab-heartbeat--${heartbeatState}`}
            aria-label="Home lab heartbeat"
          >
            <div className="lab-heartbeat__header">
              <span>/var/run/mori/lab-heartbeat</span>
              <span className="lab-heartbeat__state">{heartbeatLabel}</span>
            </div>

            <div className="lab-heartbeat__mori" aria-hidden="true">
              <pre>{String.raw`      /\_/\
     ( •.• )
      > ^ <`}</pre>
              <div className="lab-heartbeat__rail">
                <span className="lab-heartbeat__signal" />
              </div>
            </div>

            <p className="lab-heartbeat__message">{moriLine}</p>

            <dl className="lab-heartbeat__facts">
              <div>
                <dt>status source</dt>
                <dd>{statusUrl ? "live heartbeat endpoint" : "repository snapshot"}</dd>
              </div>
              <div>
                <dt>remote path</dt>
                <dd>Tailscale verified // WireGuard prepared</dd>
              </div>
              <div>
                <dt>current phase</dt>
                <dd>{currentPhase}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="lab-heartbeat__refresh"
              onClick={() => void queryHeartbeat()}
              disabled={heartbeatState === "checking"}
            >
              {statusUrl ? "refresh heartbeat" : "query documented state"}
            </button>

            <div className="lab-latest-log">
              <p>latest documented log</p>
              <a href={latestLog.url} target="_blank" rel="noopener noreferrer">
                <span>{latestLog.date}</span>
                <strong>{latestLog.title}</strong>
                <small>read log ↗</small>
              </a>
            </div>
          </aside>
        </div>

        <div className="home-lab-console__footer">
          <span>
            not every VM runs continuously // resource allocation follows the
            current experiment
          </span>
          <a href={homeLabRoadmapUrl} target="_blank" rel="noopener noreferrer">
            open roadmap ↗
          </a>
        </div>
      </div>
    </SectionFrame>
  );
}

export default HomeLabSection;
