import { featuredProjects, moreProjects } from "../data/projects";
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

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
  visualSrc?: string;
};

function ProjectCard({ project, compact, visualSrc }: ProjectCardProps) {
  return (
    <article
      className={[
        "project-card",
        visualSrc && "project-card--featured",
        compact && "project-card--compact",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {visualSrc ? (
        <div className="project-card__visual" aria-hidden="true">
          <img src={visualSrc} alt="" loading="lazy" />
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
    </article>
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
        <div className="project-group__heading">
          <h3>More projects</h3>
          <span>working set</span>
        </div>
        <div className="project-grid project-grid--compact">
          {moreProjects.map((project) => (
            <ProjectCard key={project.title} project={project} compact />
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export default ProjectGrid;
