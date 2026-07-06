export type FocusArea = {
  title: string;
  status?: "planned";
};

export const focusAreas: FocusArea[] = [
  { title: "Web Application Security" },
  { title: "Linux & Windows Privilege Escalation" },
  { title: "Network & Traffic Security" },
  { title: "Vulnerability Analysis" },
  { title: "Secure Software Engineering" },
  { title: "LLM Security" },
  { title: "Embedded & IoT Security" },
  { title: "Active Directory", status: "planned" },
];
