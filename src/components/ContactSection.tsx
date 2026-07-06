import SectionFrame from "./SectionFrame";

const contactLinks = [
  {
    label: "GitHub",
    value: "Denis-Krueger-labs",
    href: "https://github.com/Denis-Krueger-labs",
    ariaLabel: "Visit Denis Krüger on GitHub",
  },
  {
    label: "LinkedIn",
    value: "denis-krueger-80521b31b",
    href: "https://linkedin.com/in/denis-krueger-80521b31b",
    ariaLabel: "Visit Denis Krüger on LinkedIn",
  },
  {
    label: "Email",
    value: "denis.krueger@thws-student.de",
    href: "mailto:denis.krueger@thws-student.de",
    ariaLabel: "Email Denis Krüger",
  },
  {
    label: "Location",
    value: "Würzburg, Germany",
    href: "https://www.openstreetmap.org/search?query=W%C3%BCrzburg%2C%20Germany",
    ariaLabel: "View Würzburg, Germany on OpenStreetMap",
  },
];

function ContactSection() {
  return (
    <>
      <SectionFrame
        id="contact"
        label="contact --open-channel"
        title="Contact"
        intro="Open to internships, security research, collaboration, and good conversations about systems and security."
      >
        <div className="contact-panel">
          <div>
            <p className="terminal-label">status</p>
            <p className="contact-panel__status">
              available for thoughtful security work and practical learning
            </p>
          </div>
          <ul className="contact-list" aria-label="Contact links">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <span>{link.label}</span>
                <a href={link.href} aria-label={link.ariaLabel}>
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionFrame>

      <footer className="site-footer">
        <p>Security is a process, not a product. Keep learning. Keep building.</p>
      </footer>
    </>
  );
}

export default ContactSection;
