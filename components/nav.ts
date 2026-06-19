import type { ComponentType, SVGProps } from "react";
import {
  IconDashboard,
  IconMap,
  IconLearn,
  IconBuild,
  IconDiagnostics,
  IconCase,
  IconProjects,
  IconResearch,
  IconProgress,
  IconTutor,
} from "./icons";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  section: "command" | "ops";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: IconDashboard, section: "command" },
  { label: "Curriculum", href: "/curriculum", icon: IconMap, section: "command" },
  { label: "Learn", href: "/learn", icon: IconLearn, section: "command" },
  { label: "Build", href: "/build", icon: IconBuild, section: "command" },
  { label: "Diagnostics", href: "/diagnostics", icon: IconDiagnostics, section: "ops" },
  { label: "Troubleshooting", href: "/troubleshooting", icon: IconCase, section: "ops" },
  { label: "Projects", href: "/projects", icon: IconProjects, section: "ops" },
  { label: "Research", href: "/research", icon: IconResearch, section: "ops" },
  { label: "Progress", href: "/progress", icon: IconProgress, section: "ops" },
  { label: "AI Tutor", href: "/ai-tutor", icon: IconTutor, section: "ops" },
];
