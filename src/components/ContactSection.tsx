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

function ContactSection() {
  const printerRef = useRef<HTMLDivElement | null>(null);
  const [isPrinted, setIsPrinted] = useState(false);

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

      <footer className="site-footer">
        <p>Security is a process, not a product. Keep learning. Keep building.</p>
      </footer>
    </>
  );
}

export default ContactSection;
