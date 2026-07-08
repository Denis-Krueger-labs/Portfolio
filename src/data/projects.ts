export type Project = {
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  href?: string;
};

export const featuredProjects: Project[] = [
  {
    title: "Decup",
    description:
      "Secure peer-to-peer backup prototype with signed identities, routed messaging, encrypted backup artifacts, chunked transfer, restore flows, CI, and tests.",
    tags: ["C#", ".NET", "P2P", "Security"],
    featured: true,
    href: "https://github.com/Denis-Krueger-labs/decup",
  },
  {
    title: "Wing FTP CVE Lab",
    description:
      "Controlled vulnerability analysis of CVE-2025-47812 in Wing FTP Server with validation, detection, YARA rule, and mitigation testing.",
    tags: ["CVE", "Exploit Lab", "YARA", "Mitigation"],
    featured: true,
    href: "https://github.com/Denis-Krueger-labs/Wing-FTP-CVE",
  },
  {
    title: "KMU IT/OT Network Security Lab",
    description:
      "STRIDE-based risk analysis and firewall segmentation lab for a small production network.",
    tags: ["Network", "IT/OT", "Firewall", "STRIDE"],
    featured: true,
    href: "https://github.com/Denis-Krueger-labs/KMU-IT-OT-Network-Security-Lab/tree/main",
  },
  {
    title: "LLM Prompt Injection Research",
    description:
      "Research paper about prompt injection, LLM security, instruction/data separation, defence-in-depth, and current mitigation limits.",
    tags: ["LLM", "Research", "Security"],
    featured: true,
    href: "https://github.com/Denis-Krueger-labs/llm-prompt-injection-paper",
  },
];

export const fixDeskProject: Project = {
  title: "FixDesk",
  description:
    "Repair shop management frontend built with React and TypeScript.",
  tags: ["React", "TypeScript"],
  href: "https://github.com/Denis-Krueger-labs/fixdesk",
};

export const moreProjects: Project[] = [
  {
    title: "writeups",
    description: "Structured HTB and THM security writeups.",
    tags: ["HTB", "THM", "Documentation"],
    href: "https://github.com/Denis-Krueger-labs/writeups",
  },
  {
    title: "Road to CWES",
    description: "Public learning journal for web exploitation study.",
    tags: ["Web Security", "Learning Journal"],
    href: "https://github.com/Denis-Krueger-labs/Road-To-CWES",
  },
  {
    title: "pwgen-lite",
    description: "Secure CLI password generator in Python.",
    tags: ["Python", "Crypto", "Testing"],
    href: "https://github.com/Denis-Krueger-labs/pwgen-lite",
  },
  {
    title: "mfind",
    description: "C reimplementation of the Unix find utility.",
    tags: ["C", "Linux", "Systems"],
    href: "https://github.com/Denis-Krueger-labs/mfind",
  },
  {
    title: "blue",
    description: "Concept website for a swimming event platform.",
    tags: ["Frontend", "React", "Design"],
    href: "https://github.com/Denis-Krueger-labs/blue.",
  },
];
