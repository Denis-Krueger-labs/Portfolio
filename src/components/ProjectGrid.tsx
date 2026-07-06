import { featuredProjects, moreProjects } from "../data/projects";
import type { Project } from "../data/projects";
import SectionFrame from "./SectionFrame";

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
};

function ProjectCard({ project, compact }: ProjectCardProps) {
  return (
    <article className={["project-card", compact && "project-card--compact"].filter(Boolean).join(" ")}>
      <div className="project-card__header">
        <p className="terminal-label">{project.featured ? "featured" : "archive"}</p>
        <h3>{project.title}</h3>
      </div>
      <p>{project.description}</p>
      <ul className="tag-list" aria-label={`${project.title} tags`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}

function ProjectGrid() {
  return (
    <SectionFrame
      id="projects"
      label="projects --selected-output"
      title="Projects"
      intro="A compact project map for security labs, software builds, research, and learning notes."
    >
      <div className="project-group" aria-label="Featured projects">
        <div className="project-group__heading">
          <h3>Featured projects</h3>
          <span>priority queue</span>
        </div>
        <div className="project-grid project-grid--featured">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>

      <div className="project-group" aria-label="More projects">
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
