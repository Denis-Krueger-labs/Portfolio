import type { CSSProperties, ReactNode } from "react";
import {
  featuredProjects,
  fixDeskProject,
  moreProjects,
} from "../data/projects";
import type { Project } from "../data/projects";
import SectionFrame from "./SectionFrame";

const projectVisuals: Record<string, string> = {
  Decup: new URL(
    "../assets/projects/project-card-decup.svg",
    import.meta.url,
  ).href,
  "Wing FTP CVE Lab": new URL(
    "../assets/projects/project-card-wingftp.svg",
    import.meta.url,
  ).href,
  "KMU IT/OT Network Security Lab": new URL(
    "../assets/projects/project-card-network.svg",
    import.meta.url,
  ).href,
  "LLM Prompt Injection Research": new URL(
    "../assets/projects/project-card-llm.svg",
    import.meta.url,
  ).href,
};

const moreCardBackground = new URL(
  "../assets/projects/more-card-bg.png",
  import.meta.url,
).href;

const moreProjectIcons: Record<string, string> = {
  writeups: new URL("../assets/projects/more-writeups.svg", import.meta.url)
    .href,
  "Road to CWES": new URL(
    "../assets/projects/more-road-cwes.svg",
    import.meta.url,
  ).href,
  "pwgen-lite": new URL(
    "../assets/projects/more-pwgen-lite.svg",
    import.meta.url,
  ).href,
  mfind: new URL("../assets/projects/more-mfind.svg", import.meta.url).href,
  blue: new URL("../assets/projects/more-blue.svg", import.meta.url).href,
  FixDesk: new URL("../assets/projects/more-fixdesk.svg", import.meta.url)
    .href,
};

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
  visualSrc?: string;
  archiveLayer?: "front" | "behind";
};

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ProjectCard({
  project,
  compact,
  visualSrc,
  archiveLayer,
}: ProjectCardProps) {
  const archiveIcon = compact ? moreProjectIcons[project.title] : null;
  const archiveStyle = compact
    ? ({
        "--archive-card-bg": `url(${moreCardBackground})`,
      } as CSSProperties & { "--archive-card-bg": string })
    : undefined;

  const className = [
    "project-card",
    visualSrc && "project-card--featured",
    compact && "project-card--archive",
    compact && "project-card--compact",
    archiveLayer && `project-card--archive-${archiveLayer}`,
  ]
    .filter(Boolean)
    .join(" ");

  const content: ReactNode = (
    <>
      {visualSrc ? (
        <div className="project-card__visual" aria-hidden="true">
          <img src={visualSrc} alt="" loading="lazy" />
        </div>
      ) : null}
      {archiveIcon ? (
        <div className="project-card__archive-visual" aria-hidden="true">
          <img
            className="project-card__archive-icon"
            src={archiveIcon}
            alt=""
            loading="lazy"
          />
          <span className="project-card__archive-status" />
        </div>
      ) : null}
      <div className="project-card__content">
        <div className="project-card__header">
          {!visualSrc ? (
            <p className="terminal-label">
              {project.featured ? "featured" : "archive"}
            </p>
          ) : null}
          <h3>{project.title}</h3>
        </div>
        <p>{project.description}</p>
        <ul className="tag-list" aria-label={`${project.title} tags`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </>
  );

  if (project.href) {
    const external = isExternalLink(project.href);

    return (
      <a
        style={archiveStyle}
        className={className}
        href={project.href}
        aria-label={`Open ${project.title} project`}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      style={archiveStyle}
      tabIndex={compact ? 0 : undefined}
      className={className}
      aria-label={`${project.title} project card`}
    >
      {content}
    </article>
  );
}

type ArchiveStackProps = {
  frontProject: Project;
  behindProject: Project;
};

function ArchiveStack({ frontProject, behindProject }: ArchiveStackProps) {
  return (
    <div
      className="archive-stack"
      aria-label="Stacked archive cards for FixDesk and blue"
    >
      <ProjectCard project={behindProject} compact archiveLayer="behind" />
      <ProjectCard project={frontProject} compact archiveLayer="front" />
    </div>
  );
}

function ProjectGrid() {
  return (
    <SectionFrame
      id="projects"
      className="projects-section"
      label="PROJECTS -- SELECTED OUTPUT"
      title="Projects"
    >
      <div className="project-showcase" aria-label="Featured projects">
        <div className="project-showcase__ghost" aria-hidden="true">
          PROJECTS
        </div>
        <div className="project-showcase__header">
          <span>_ featured work :</span>
        </div>
        <div className="project-grid project-grid--featured">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              visualSrc={projectVisuals[project.title]}
            />
          ))}
        </div>
        <a className="project-view-all" href="#more-projects">
          VIEW ALL PROJECTS
        </a>
      </div>

      <div
        id="more-projects"
        className="project-group project-group--more"
        aria-label="More projects"
      >
        <div className="project-group__ghost" aria-hidden="true">
          MORE PROJECTS
        </div>
        <div className="project-group__heading">
          <h3>More projects</h3>
          <span>archive set</span>
        </div>
        <div className="project-grid project-grid--compact">
          {moreProjects.map((project) =>
            project.title === "blue" ? (
              <ArchiveStack
                key="fixdesk-blue-stack"
                frontProject={fixDeskProject}
                behindProject={project}
              />
            ) : (
              <ProjectCard key={project.title} project={project} compact />
            ),
          )}
        </div>
      </div>
    </SectionFrame>
  );
}

export default ProjectGrid;
