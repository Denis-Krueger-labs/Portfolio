export type StackGroup = {
  title: string;
  items: string[];
};

export const stackGroups: StackGroup[] = [
  {
    title: "Languages",
    items: ["Python", "C", "C#", "Bash", "Java", "SQL", "TypeScript"],
  },
  {
    title: "Security tools",
    items: [
      "Kali Linux",
      "Burp Suite",
      "Nmap",
      "Gobuster",
      "ffuf",
      "SQLMap",
      "Metasploit",
      "Wireshark",
      "OWASP ZAP",
      "YARA",
    ],
  },
  {
    title: "Systems and development",
    items: [
      "Linux",
      "Windows",
      "Git",
      "Docker",
      ".NET",
      "ASP.NET Core",
      "GitLab CI",
      "React",
      "Vite",
    ],
  },
];
