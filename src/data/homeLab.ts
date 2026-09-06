export type LabNode = {
  id: string;
  label: string;
  role: string;
  state: "operational" | "ready" | "active-development";
  detail: string;
  stack: string[];
};

export type LabLog = {
  title: string;
  date: string;
  url: string;
};

export const homeLabNodes: LabNode[] = [
  {
    id: "pve",
    label: "pve",
    role: "Proxmox VE 9.2",
    state: "operational",
    detail:
      "Dell OptiPlex 5070 Micro with 32 GB RAM and 1 TB SSD. Hosts the virtual lab, reusable templates, firewall, domain infrastructure, clients, and Mori OS experiments.",
    stack: ["Proxmox VE", "KVM/QEMU", "Backups"],
  },
  {
    id: "fw01",
    label: "fw01",
    role: "OPNsense firewall",
    state: "operational",
    detail:
      "Virtual firewall and router separating the management network from the isolated lab network on vmbr1.",
    stack: ["OPNsense", "NAT", "Firewall", "WireGuard"],
  },
  {
    id: "dc01",
    label: "dc01",
    role: "AD DS + DNS",
    state: "operational",
    detail:
      "Windows Server 2025 domain controller for lab.test with DNS, organizational units, users, groups, and initial Group Policy baselines.",
    stack: ["Windows Server 2025", "Active Directory", "DNS", "GPO"],
  },
  {
    id: "client01",
    label: "client01",
    role: "Windows 11 Enterprise",
    state: "operational",
    detail:
      "Domain-joined Windows 11 Enterprise workstation used to validate authentication, policy processing, secure-channel health, and client behavior.",
    stack: ["Windows 11", "Domain Join", "Group Policy"],
  },
  {
    id: "nix01",
    label: "nix01",
    role: "Mori OS prototype",
    state: "active-development",
    detail:
      "NixOS + Hyprland development VM for the Mori OS desktop experiment, including Quickshell panels, live system widgets, Spotify metadata, and custom controls.",
    stack: ["NixOS", "Hyprland", "Quickshell", "Waybar"],
  },
  {
    id: "debian-gold",
    label: "debian-gold",
    role: "Debian 13 template",
    state: "ready",
    detail:
      "Reusable Debian 13 server template with UEFI, q35, VirtIO, QEMU Guest Agent, Cloud-Init, SSH, sudo, and common CLI tooling.",
    stack: ["Debian 13", "Cloud-Init", "VirtIO"],
  },
];

export const defaultHomeLabLog: LabLog = {
  title: "Mori OS Live Widgets and Minimized Window Drawer",
  date: "2026-08-02",
  url: "https://github.com/Denis-Krueger-labs/home-lab/blob/main/logbook/2026-08-02-mori-os-live-widgets-and-window-drawer.md",
};

export const homeLabRepositoryUrl =
  "https://github.com/Denis-Krueger-labs/home-lab";

export const homeLabRoadmapUrl =
  "https://github.com/Denis-Krueger-labs/home-lab/blob/main/docs/roadmap.md";

export const documentedLabPhase =
  "Core Windows infrastructure operational; network isolation established; recovery, remote-access hardening, AD development, and centralized monitoring remain in progress.";
