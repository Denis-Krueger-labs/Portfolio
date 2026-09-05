export type Credential = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  status: "verified";
  summary: string;
  coursework: string[];
  verificationUrl: string;
};

export const credentials: Credential[] = [
  {
    id: "cs50-cybersecurity",
    title: "CS50's Introduction to Cybersecurity",
    issuer: "CS50 / Harvard University",
    year: "2026",
    status: "verified",
    summary:
      "Course-completion credential covering CS50's Introduction to Cybersecurity.",
    coursework: ["5 assignments", "1 final project"],
    verificationUrl:
      "https://certificates.cs50.io/ad555f51-c2f0-42fd-9aeb-49a67a0e8203.pdf?size=letter",
  },
];
