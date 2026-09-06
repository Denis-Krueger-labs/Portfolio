export type StackCategoryId =
  | "languages"
  | "security"
  | "infrastructure"
  | "development";

export type StackCategory = {
  id: StackCategoryId;
  label: string;
  shortLabel: string;
};

export type StackTechnology = {
  id: string;
  label: string;
  category: StackCategoryId;
  summary: string;
  evidence: string[];
  work: string[];
};

export type StackEvidence = {
  id: string;
  label: string;
  kind: string;
  summary: string;
  href: string;
};

export const stackCategories: StackCategory[] = [
  { id: "languages", label: "Languages", shortLabel: "LANG" },
  { id: "security", label: "Security & Research", shortLabel: "SEC" },
  { id: "infrastructure", label: "Infrastructure & Systems", shortLabel: "INFRA" },
  { id: "development", label: "Development & Delivery", shortLabel: "DEV" },
];

export const stackEvidence: StackEvidence[] = [
  {
    id: "copyfail",
    label: "Copy Fail / MORI",
    kind: "kernel security research",
    summary:
      "Controlled CVE-2026-31431 reproduction, detection engineering, BPF-based compensating controls, regression testing, and vendor-patch validation.",
    href: "https://github.com/Denis-Krueger-labs/copy-fail-lab",
  },
  {
    id: "homelab",
    label: "Home Lab",
    kind: "infrastructure",
    summary:
      "Proxmox-based enterprise-style lab with OPNsense isolation, Windows Server, Active Directory, NixOS experiments, backups, and remote access.",
    href: "https://github.com/Denis-Krueger-labs/home-lab",
  },
  {
    id: "decup",
    label: "Decup",
    kind: "secure software engineering",
    summary:
      "C#/.NET peer-to-peer backup prototype with ASP.NET Core APIs, Docker Compose, xUnit tests, and GitLab CI validation.",
    href: "https://github.com/Denis-Krueger-labs/decup",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    kind: "frontend / delivery",
    summary:
      "React + TypeScript + Vite portfolio deployed to GitHub Pages through a GitHub Actions workflow.",
    href: "https://github.com/Denis-Krueger-labs/Portfolio",
  },
  {
    id: "wingftp",
    label: "Wing FTP CVE Lab",
    kind: "vulnerability analysis",
    summary:
      "Controlled CVE-2025-47812 analysis with validation, detection work, YARA, and mitigation testing.",
    href: "https://github.com/Denis-Krueger-labs/Wing-FTP-CVE",
  },
  {
    id: "writeups",
    label: "Security Writeups",
    kind: "offensive security practice",
    summary:
      "Structured HTB and THM writeups documenting enumeration, exploitation, and post-exploitation workflows.",
    href: "https://github.com/Denis-Krueger-labs/writeups",
  },
  {
    id: "mori-lamp",
    label: "MORI // LAMP",
    kind: "local-first tooling",
    summary:
      "Python pipeline for evidence-grounded job-listing analysis with strict schemas, source grounding, matching logic, and regression tests.",
    href: "https://github.com/Denis-Krueger-labs/MORI-LAMP",
  },
];

export const stackTechnologies: StackTechnology[] = [
  {
    id: "c",
    label: "C",
    category: "languages",
    summary:
      "Systems-level work used directly in Linux security research and MORI's BPF-side implementation.",
    evidence: ["copyfail"],
    work: ["BPF-side MORI implementation", "kernel-facing security experiments", "low-level systems work"],
  },
  {
    id: "csharp",
    label: "C#",
    category: "languages",
    summary:
      "Primary language for the Decup secure peer-to-peer backup prototype.",
    evidence: ["decup"],
    work: [".NET 8 application code", "peer and backup logic", "testable security controls"],
  },
  {
    id: "bash",
    label: "Bash",
    category: "languages",
    summary:
      "Used for Linux administration, repeatable lab workflows, research automation, and validation steps.",
    evidence: ["copyfail", "homelab"],
    work: ["lab administration", "research orchestration", "repeatable validation commands"],
  },
  {
    id: "python",
    label: "Python",
    category: "languages",
    summary:
      "Used for local tooling, strict data pipelines, tests, fixtures, and security-lab support.",
    evidence: ["mori-lamp", "copyfail"],
    work: ["MORI // LAMP pipeline", "schema and grounding logic", "research PoCs and test support"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    category: "languages",
    summary:
      "Used for strongly typed React frontend work and the current portfolio codebase.",
    evidence: ["portfolio"],
    work: ["React components", "typed UI state", "interactive portfolio systems"],
  },
  {
    id: "sql",
    label: "SQL",
    category: "languages",
    summary:
      "Used in academic database work; no current public flagship artifact is linked here.",
    evidence: [],
    work: ["relational querying", "schema-oriented coursework", "database exercises"],
  },
  {
    id: "java",
    label: "Java",
    category: "languages",
    summary:
      "Used in prior academic development work; no current public flagship artifact is linked here.",
    evidence: [],
    work: ["object-oriented programming", "academic software exercises", "general application development"],
  },

  {
    id: "burp",
    label: "Burp Suite",
    category: "security",
    summary:
      "Web-security testing and request manipulation in training, labs, and documented offensive-security practice.",
    evidence: ["writeups"],
    work: ["HTTP request inspection", "web application testing", "manual validation"],
  },
  {
    id: "nmap",
    label: "Nmap",
    category: "security",
    summary:
      "Network discovery and service enumeration across controlled lab and training environments.",
    evidence: ["writeups"],
    work: ["host discovery", "service enumeration", "attack-surface mapping"],
  },
  {
    id: "wireshark",
    label: "Wireshark",
    category: "security",
    summary:
      "Packet-level inspection for protocol behavior, troubleshooting, and lab validation.",
    evidence: ["wingftp", "writeups"],
    work: ["traffic inspection", "protocol validation", "network troubleshooting"],
  },
  {
    id: "yara",
    label: "YARA",
    category: "security",
    summary:
      "Signature-based detection work used in vulnerability-lab comparisons and controlled detection exercises.",
    evidence: ["copyfail", "wingftp"],
    work: ["exact-sample detection", "signature comparison", "controlled detection validation"],
  },
  {
    id: "ebpf",
    label: "eBPF",
    category: "security",
    summary:
      "Used to observe and correlate Linux kernel behavior for MORI's selective compensating control.",
    evidence: ["copyfail"],
    work: ["kernel instrumentation", "behavioral correlation", "cross-program BPF state"],
  },
  {
    id: "bpf-lsm",
    label: "BPF LSM",
    category: "security",
    summary:
      "Used for selective enforcement in MORI v2 rather than treating detection as the final security boundary.",
    evidence: ["copyfail"],
    work: ["LSM hook attachment", "selective deny policy", "shadow-to-enforcement lifecycle"],
  },
  {
    id: "btf-core",
    label: "BTF / CO-RE",
    category: "security",
    summary:
      "Used in MORI's portable BPF object and loader workflow for kernel-aware instrumentation.",
    evidence: ["copyfail"],
    work: ["CO-RE BPF object", "BTF-backed portability", "loader integration"],
  },
  {
    id: "fentry",
    label: "fentry",
    category: "security",
    summary:
      "Used as part of MORI's tracing design for behavior correlation and lifecycle observation.",
    evidence: ["copyfail"],
    work: ["function-entry tracing", "lifecycle observation", "behavior correlation"],
  },
  {
    id: "kali",
    label: "Kali Linux",
    category: "security",
    summary:
      "Offensive-security environment used for controlled training and lab work.",
    evidence: ["writeups"],
    work: ["offensive tooling", "training labs", "controlled testing"],
  },
  {
    id: "metasploit",
    label: "Metasploit",
    category: "security",
    summary:
      "Used in controlled training environments for exploitation workflows and validation.",
    evidence: ["writeups"],
    work: ["controlled exploitation", "module-driven testing", "post-exploitation practice"],
  },

  {
    id: "linux",
    label: "Linux",
    category: "infrastructure",
    summary:
      "Primary platform for kernel research, lab infrastructure, server administration, and security experiments.",
    evidence: ["copyfail", "homelab"],
    work: ["kernel research", "server administration", "isolated security environments"],
  },
  {
    id: "proxmox",
    label: "Proxmox VE",
    category: "infrastructure",
    summary:
      "Hypervisor platform for the home lab and isolated Copy Fail research environment.",
    evidence: ["homelab", "copyfail"],
    work: ["VM lifecycle", "templates and snapshots", "backup jobs"],
  },
  {
    id: "opnsense",
    label: "OPNsense",
    category: "infrastructure",
    summary:
      "Firewall and routing boundary used to isolate virtual lab networks from the management network.",
    evidence: ["homelab", "copyfail"],
    work: ["network isolation", "routing and NAT", "firewall boundaries"],
  },
  {
    id: "windows-server",
    label: "Windows Server",
    category: "infrastructure",
    summary:
      "Windows Server 2025 used for reusable templates and Active Directory infrastructure.",
    evidence: ["homelab"],
    work: ["server templating", "domain infrastructure", "guest administration"],
  },
  {
    id: "active-directory",
    label: "Active Directory",
    category: "infrastructure",
    summary:
      "Home-lab domain with AD DS, DNS, OUs, users, groups, domain join, and initial GPO baselines.",
    evidence: ["homelab"],
    work: ["AD DS and DNS", "users and groups", "Group Policy"],
  },
  {
    id: "nixos",
    label: "NixOS",
    category: "infrastructure",
    summary:
      "Declarative Linux experimentation through the Mori OS NixOS + Hyprland workstation prototype.",
    evidence: ["homelab"],
    work: ["declarative configuration", "Hyprland desktop", "Quickshell / Waybar integration"],
  },
  {
    id: "kvm-qemu",
    label: "KVM / QEMU",
    category: "infrastructure",
    summary:
      "Virtualization layer underlying the Proxmox lab and reusable Linux/Windows guest environments.",
    evidence: ["homelab", "copyfail"],
    work: ["virtual machines", "isolated guests", "reproducible research snapshots"],
  },
  {
    id: "docker",
    label: "Docker",
    category: "infrastructure",
    summary:
      "Used for reproducible local application environments and Decup's four-peer demonstration topology.",
    evidence: ["decup"],
    work: ["Docker Compose", "multi-container demo", "repeatable local environments"],
  },
  {
    id: "tailscale",
    label: "Tailscale",
    category: "infrastructure",
    summary:
      "Verified remote-management path to the Proxmox host without exposing the management interface directly to the public internet.",
    evidence: ["homelab"],
    work: ["remote administration", "private connectivity", "management-path validation"],
  },

  {
    id: "git",
    label: "Git",
    category: "development",
    summary:
      "Version control across the public project portfolio, security labs, research artifacts, and application code.",
    evidence: ["copyfail", "homelab", "decup", "portfolio", "mori-lamp"],
    work: ["project history", "research checkpoints", "collaborative development"],
  },
  {
    id: "github-actions",
    label: "GitHub Actions",
    category: "development",
    summary:
      "Used to build and deploy the current portfolio to GitHub Pages.",
    evidence: ["portfolio"],
    work: ["automated build", "Pages deployment", "repository workflow"],
  },
  {
    id: "gitlab-ci",
    label: "GitLab CI",
    category: "development",
    summary:
      "Used for automated validation of the Decup prototype.",
    evidence: ["decup"],
    work: ["build validation", "test execution", "CI pipeline"],
  },
  {
    id: "dotnet",
    label: ".NET",
    category: "development",
    summary:
      ".NET 8 application platform used across the Decup prototype.",
    evidence: ["decup"],
    work: [".NET 8", "application architecture", "testable services"],
  },
  {
    id: "aspnet",
    label: "ASP.NET Core",
    category: "development",
    summary:
      "Minimal APIs used for peer communication and local administration endpoints in Decup.",
    evidence: ["decup"],
    work: ["HTTP APIs", "peer communication", "local admin endpoints"],
  },
  {
    id: "react",
    label: "React",
    category: "development",
    summary:
      "Component architecture for the interactive portfolio and frontend project work.",
    evidence: ["portfolio"],
    work: ["component systems", "interactive UI", "stateful frontend behavior"],
  },
  {
    id: "vite",
    label: "Vite",
    category: "development",
    summary:
      "Build tooling for the current React + TypeScript portfolio.",
    evidence: ["portfolio"],
    work: ["frontend build", "asset pipeline", "GitHub Pages deployment"],
  },
  {
    id: "xunit",
    label: "xUnit",
    category: "development",
    summary:
      "Automated testing framework used in Decup's large regression suite.",
    evidence: ["decup"],
    work: ["unit tests", "security regression coverage", "automated validation"],
  },
];
