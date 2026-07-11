import { useEffect, useRef, useState } from "react";
import SectionFrame from "./SectionFrame";
import wantedPoster from "../assets/contact/wanted-contact-poster.png";

const contactLinks = [
  {
    key: "github",
    label: "GitHub",
    value: "Denis-Krueger-labs",
    href: "https://github.com/Denis-Krueger-labs",
    ariaLabel: "Open GitHub profile for Denis-Krueger-labs",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "Denis-Krüger",
    href: "https://www.linkedin.com/in/denis-kr%C3%BCger-882520354",
    ariaLabel: "Open LinkedIn profile for Denis Krüger",
  },
  {
    key: "email",
    label: "Email",
    value: "denis.krueger@study.thws.de",
    href: "mailto:denis.krueger@study.thws.de",
    ariaLabel: "Send an email to Denis Krüger",
  },
  {
    key: "location",
    label: "Location",
    value: "Würzburg, Germany",
    href: "https://www.openstreetmap.org/search?query=W%C3%BCrzburg%2C%20Germany",
    ariaLabel: "View Würzburg, Germany on OpenStreetMap",
  },
];

const footerCatMessages = [
  "i ate your kernel.",
  "your C pointers look crunchy.",
  "grep won\'t save you.",
  "segmentation fault. skill issue.",
  "the compiler cried.",
];

const patchNotesText = String.raw`<!-- appended near end-of-page -->

PORTFOLIO_PATCH_NOTES.md

v0.9.7-nightly

+ indexed security labs
+ archived frontend experiments
+ added interactive terminal gremlin
+ fixed several cursed UI decisions
- removed sad default footer

status: still learning // still building
branch: main
session: end-of-file`;

const patchNotesLineCount = patchNotesText.split("\n").length + 1;

function ContactSection() {
  const printerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [isPrinted, setIsPrinted] = useState(false);
  const [hasFooterStarted, setHasFooterStarted] = useState(false);
  const [patchNotesOutput, setPatchNotesOutput] = useState("");
  const [footerCatMessage, setFooterCatMessage] = useState(
    footerCatMessages[0],
  );

  useEffect(() => {
    const printerElement = printerRef.current;

    if (!printerElement) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      setIsPrinted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPrinted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.26,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(printerElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const footerElement = footerRef.current;

    if (!footerElement) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      setHasFooterStarted(true);
      setPatchNotesOutput(patchNotesText);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasFooterStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.42,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, []);


  useEffect(() => {
    if (
      !hasFooterStarted ||
      patchNotesOutput.length < patchNotesText.length
    ) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      return;
    }

    let cancelled = false;
    let timer: number | null = null;

    const scheduleMessage = () => {
      timer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        setFooterCatMessage((currentMessage) => {
          const availableMessages = footerCatMessages.filter(
            (message) => message !== currentMessage,
          );

          return availableMessages[
            Math.floor(Math.random() * availableMessages.length)
          ];
        });

        scheduleMessage();
      }, 18000 + Math.random() * 26000);
    };

    scheduleMessage();

    return () => {
      cancelled = true;

      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, [hasFooterStarted, patchNotesOutput.length]);

  useEffect(() => {
    if (!hasFooterStarted || patchNotesOutput.length >= patchNotesText.length) {
      return;
    }

    const typeSpeedMs = 28;
    const charactersPerTick = 1;

    const typingTimer = window.setInterval(() => {
      setPatchNotesOutput((currentOutput) => {
        if (currentOutput.length >= patchNotesText.length) {
          window.clearInterval(typingTimer);
          return currentOutput;
        }

        return patchNotesText.slice(
          0,
          Math.min(currentOutput.length + charactersPerTick, patchNotesText.length),
        );
      });
    }, typeSpeedMs);

    return () => {
      window.clearInterval(typingTimer);
    };
  }, [hasFooterStarted, patchNotesOutput.length]);

  return (
    <>
      <SectionFrame
        id="contact"
        className="contact-section contact-section--printer"
        label="contact -- open-channel"
        title="Contact"
        intro="Open to internships, security research, collaboration, and good conversations about systems and security."
      >
        <div
          className={`contact-printer${isPrinted ? " is-printed" : ""}`}
          ref={printerRef}
        >
          <div className="contact-printer__head" aria-hidden="true">
            <p className="contact-printer__kicker">classified output queue</p>
            <div className="contact-printer__slot">
              <span>printing wanted notice</span>
            </div>
          </div>

          <div className="contact-printer__paper-stage">
            <figure className="contact-poster">
              <img
                src={wantedPoster}
                alt="Wanted contact dossier for a security student available for practical field work. The poster contains routes for GitHub, LinkedIn, email, and location."
              />

              {contactLinks.map((link) => (
                <a
                  className={`contact-hotspot contact-hotspot--${link.key}`}
                  href={link.href}
                  key={link.key}
                  aria-label={link.ariaLabel}
                  data-label={`Open ${link.label}`}
                >
                  <span>{`${link.label}: ${link.value}`}</span>
                </a>
              ))}
            </figure>
          </div>
        </div>
      </SectionFrame>

      <footer
        className={`site-footer site-footer--page-edit${hasFooterStarted ? " is-editing" : ""}`}
        ref={footerRef}
        aria-label="Portfolio patch notes footer"
      >
        <div className="site-footer__edit-meta" aria-hidden="true">
          <span>editing: /portfolio/end.md</span>
          <span>autosave: armed</span>
        </div>
        <div className="site-footer__edit-sheet">
          <ol className="site-footer__edit-lines" aria-hidden="true">
            {Array.from({ length: patchNotesLineCount }, (_, index) => (
              <li key={index}>{String(index + 1).padStart(2, "0")}</li>
            ))}
          </ol>
          <pre className="site-footer__edit-buffer" aria-label="Portfolio patch notes">{patchNotesOutput}{patchNotesOutput.length < patchNotesText.length ? (
            <span className="site-footer__cursor" aria-hidden="true" />
          ) : null}</pre>
        </div>
        <p
          className={[
            "site-footer__cat-process",
            patchNotesOutput.length >= patchNotesText.length && "is-online",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
        >
          <span aria-hidden="true">/•᷅‎‎•᷄\੭</span> {footerCatMessage}
        </p>
      </footer>
    </>
  );
}

export default ContactSection;
