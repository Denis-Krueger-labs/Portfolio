import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { credentials } from "../data/credentials";
import SectionFrame from "./SectionFrame";
import cs50Certificate from "../assets/credentials/cs50-cybersecurity.webp";
import "./CredentialsSection.css";

const credentialImages: Record<string, string> = {
  "cs50-cybersecurity": cs50Certificate,
};

type ScanState = "idle" | "scanning" | "indexed";

function CredentialsSection() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const scanTimer = useRef<number | null>(null);
  const progressTimer = useRef<number | null>(null);
  const previewRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    return () => {
      if (scanTimer.current !== null) {
        window.clearTimeout(scanTimer.current);
      }

      if (progressTimer.current !== null) {
        window.clearInterval(progressTimer.current);
      }
    };
  }, []);

  const runScan = () => {
    if (scanState === "scanning") {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setScanState("scanning");
    setScanProgress(reduceMotion ? 100 : 4);

    if (reduceMotion) {
      setScanState("indexed");
      return;
    }

    if (progressTimer.current !== null) {
      window.clearInterval(progressTimer.current);
    }

    if (scanTimer.current !== null) {
      window.clearTimeout(scanTimer.current);
    }

    progressTimer.current = window.setInterval(() => {
      setScanProgress((current) => Math.min(current + 4, 96));
    }, 92);

    scanTimer.current = window.setTimeout(() => {
      if (progressTimer.current !== null) {
        window.clearInterval(progressTimer.current);
        progressTimer.current = null;
      }

      setScanProgress(100);
      setScanState("indexed");
      scanTimer.current = null;
    }, 2300);
  };

  const resetScan = () => {
    if (scanState === "scanning") {
      return;
    }

    setScanState("idle");
    setScanProgress(0);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLAnchorElement>,
    credentialId: string,
  ) => {
    const preview = previewRefs.current[credentialId];

    if (!preview || event.pointerType === "touch") {
      return;
    }

    const bounds = preview.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    preview.style.setProperty("--credential-tilt-x", `${(-y * 2.4).toFixed(2)}deg`);
    preview.style.setProperty("--credential-tilt-y", `${(x * 3.2).toFixed(2)}deg`);
    preview.style.setProperty("--credential-glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    preview.style.setProperty("--credential-glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetPointerTilt = (credentialId: string) => {
    const preview = previewRefs.current[credentialId];

    if (!preview) {
      return;
    }

    preview.style.setProperty("--credential-tilt-x", "0deg");
    preview.style.setProperty("--credential-tilt-y", "0deg");
    preview.style.setProperty("--credential-glare-x", "50%");
    preview.style.setProperty("--credential-glare-y", "50%");
  };

  const progressCells = Math.round(scanProgress / 5);
  const progressBar = `${"█".repeat(progressCells)}${"░".repeat(
    Math.max(0, 20 - progressCells),
  )}`;

  return (
    <SectionFrame
      id="credentials"
      className="credentials-section stack-section"
      label="CREDENTIALS -- VERIFIED RECORDS"
      title="CREDENTIALS"
    >
      <div className="credentials-archive">
        {credentials.map((credential, index) => {
          const image = credentialImages[credential.id];

          return (
            <article
              className={[
                "credential-file",
                `credential-file--${scanState}`,
              ].join(" ")}
              key={credential.id}
              aria-labelledby={`${credential.id}-title`}
            >
              <div className="credential-file__tab" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>verified record</span>
              </div>

              <div className="credential-file__document">
                <a
                  ref={(node: HTMLAnchorElement | null) => {
                    previewRefs.current[credential.id] = node;
                  }}
                  className="credential-file__preview"
                  href={credential.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open and verify ${credential.title}`}
                  onPointerMove={(event: ReactPointerEvent<HTMLAnchorElement>) =>
                    handlePointerMove(event, credential.id)
                  }
                  onPointerLeave={() => resetPointerTilt(credential.id)}
                  onBlur={() => resetPointerTilt(credential.id)}
                  style={
                    {
                      "--credential-tilt-x": "0deg",
                      "--credential-tilt-y": "0deg",
                      "--credential-glare-x": "50%",
                      "--credential-glare-y": "50%",
                    } as CSSProperties
                  }
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`${credential.title} certificate issued to Denis Krüger in ${credential.year}`}
                      loading="lazy"
                    />
                  ) : null}

                  <span className="credential-file__glare" aria-hidden="true" />
                  <span className="credential-file__scanner" aria-hidden="true" />

                  <span
                    className="credential-file__corner credential-file__corner--tl"
                    aria-hidden="true"
                  />
                  <span
                    className="credential-file__corner credential-file__corner--tr"
                    aria-hidden="true"
                  />
                  <span
                    className="credential-file__corner credential-file__corner--bl"
                    aria-hidden="true"
                  />
                  <span
                    className="credential-file__corner credential-file__corner--br"
                    aria-hidden="true"
                  />
                </a>

                <div className="credential-file__scanner-controls">
                  <button
                    className="credential-file__scan-button"
                    type="button"
                    onClick={scanState === "indexed" ? resetScan : runScan}
                    disabled={scanState === "scanning"}
                  >
                    {scanState === "idle" && "run local inspection"}
                    {scanState === "scanning" && "inspection running..."}
                    {scanState === "indexed" && "reset inspection"}
                  </button>

                  <span className="credential-file__scan-hint">
                    gimmick only // official record opens separately
                  </span>
                </div>
              </div>

              <div className="credential-file__notes">
                <div className="credential-file__path">
                  /archive/credentials/{credential.id}.record
                </div>

                <p className="credential-file__issuer">{credential.issuer}</p>

                <h3 id={`${credential.id}-title`}>{credential.title}</h3>

                <dl className="credential-file__metadata">
                  <div>
                    <dt>issued</dt>
                    <dd>{credential.year}</dd>
                  </div>

                  <div>
                    <dt>scope</dt>
                    <dd>{credential.coursework.join(" + ")}</dd>
                  </div>

                  <div>
                    <dt>record</dt>
                    <dd>public verification endpoint</dd>
                  </div>
                </dl>

                <div
                  className="credential-file__verification"
                  aria-live="polite"
                >
                  <div className="credential-file__verification-command">
                    <span className="credential-file__prompt">
                      0N1S3C@portfolio:~$
                    </span>
                    <code> inspect {credential.id}</code>
                  </div>

                  {scanState === "idle" ? (
                    <>
                      <p>local inspection idle.</p>
                      <p>touch the scanner control when curiosity wins.</p>
                    </>
                  ) : null}

                  {scanState === "scanning" ? (
                    <>
                      <p>reading displayed credential image...</p>
                      <p className="credential-file__progress">
                        {progressBar} {String(scanProgress).padStart(3, " ")}%
                      </p>
                    </>
                  ) : null}

                  {scanState === "indexed" ? (
                    <>
                      <p>local record indexed.</p>
                      <p>issuer metadata: {credential.issuer}</p>
                      <p>official verification link: available ↗</p>
                    </>
                  ) : null}
                </div>

                <a
                  className="credential-file__link"
                  href={credential.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  open official record <span aria-hidden="true">↗</span>
                </a>

                <div
                  className={[
                    "credential-file__stamp",
                    scanState === "indexed" && "credential-file__stamp--visible",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                >
                  <span>INDEXED</span>
                  <small>{credential.year}</small>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default CredentialsSection;
