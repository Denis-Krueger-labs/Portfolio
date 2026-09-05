import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  featuredProjects,
  fixDeskProject,
  moreProjects,
} from "../data/projects";
import type { Project } from "../data/projects";
import SectionFrame from "./SectionFrame";
import "./ProjectGridCarousel.css";

const projectVisuals: Record<string, string> = {
  Decup: new URL(
    "../assets/projects/project-card-decup.png",
    import.meta.url,
  ).href,
  "Wing FTP CVE Lab": new URL(
    "../assets/projects/project-card-wingftp.png",
    import.meta.url,
  ).href,
  "KMU IT/OT Network Security Lab": new URL(
    "../assets/projects/project-card-network.png",
    import.meta.url,
  ).href,
  "LLM Prompt Injection Research": new URL(
    "../assets/projects/project-card-llm.png",
    import.meta.url,
  ).href,
  "Copy Fail / MORI": new URL(
    "../assets/projects/project-card-copyfail.webp",
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
        rel={external ? "noopener noreferrer" : undefined}
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

function FeaturedProjectCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [windowStart, setWindowStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const getCarouselMetrics = () => {
    const track = trackRef.current;

    if (!track) {
      return null;
    }

    const firstCard = track.querySelector<HTMLElement>(".project-card");

    if (!firstCard) {
      return null;
    }

    const trackStyles = window.getComputedStyle(track);
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0");
    const cardWidth = firstCard.getBoundingClientRect().width;
    const step = cardWidth + gap;
    const count = Math.max(
      1,
      Math.min(
        featuredProjects.length,
        Math.round((track.clientWidth + gap) / Math.max(step, 1)),
      ),
    );

    return {
      track,
      step,
      count,
      maxStart: Math.max(0, featuredProjects.length - count),
    };
  };

  const syncCarouselState = () => {
    const metrics = getCarouselMetrics();

    if (!metrics) {
      return;
    }

    const nextStart = Math.max(
      0,
      Math.min(metrics.maxStart, Math.round(metrics.track.scrollLeft / Math.max(metrics.step, 1))),
    );

    setVisibleCount(metrics.count);
    setWindowStart(nextStart);
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    syncCarouselState();

    const handleScroll = () => syncCarouselState();
    const handleResize = () => {
      syncCarouselState();

      window.requestAnimationFrame(() => {
        const metrics = getCarouselMetrics();

        if (!metrics) {
          return;
        }

        const safeStart = Math.min(windowStart, metrics.maxStart);
        metrics.track.scrollTo({
          left: safeStart * metrics.step,
          behavior: "auto",
        });
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [windowStart]);

  const scrollFeatured = (direction: -1 | 1) => {
    const metrics = getCarouselMetrics();

    if (!metrics) {
      return;
    }

    const targetStart = Math.max(
      0,
      Math.min(metrics.maxStart, windowStart + direction),
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    metrics.track.scrollTo({
      left: targetStart * metrics.step,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    setWindowStart(targetStart);
    setVisibleCount(metrics.count);
  };

  const handleCarouselKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollFeatured(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollFeatured(1);
    }
  };

  const lastVisible = Math.min(
    featuredProjects.length,
    windowStart + visibleCount,
  );
  const maxStart = Math.max(0, featuredProjects.length - visibleCount);

  return (
    <div className="project-carousel">
      <div className="project-showcase__header">
        <span>_ featured work :</span>

        <div
          className="project-carousel__status"
          aria-live="polite"
          aria-atomic="true"
        >
          {String(windowStart + 1).padStart(2, "0")}
          <span aria-hidden="true">—</span>
          {String(lastVisible).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          {String(featuredProjects.length).padStart(2, "0")}
        </div>

        <div className="project-carousel__controls" aria-label="Featured project controls">
          <button
            type="button"
            className="project-carousel__button"
            onClick={() => scrollFeatured(-1)}
            disabled={windowStart <= 0}
            aria-label="Show previous featured project"
          >
            ←
          </button>
          <button
            type="button"
            className="project-carousel__button"
            onClick={() => scrollFeatured(1)}
            disabled={windowStart >= maxStart}
            aria-label="Show next featured project"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="project-grid project-grid--featured project-carousel__track"
        tabIndex={0}
        role="region"
        aria-label="Featured projects. Swipe horizontally or use the arrow controls."
        onKeyDown={handleCarouselKeyDown}
      >
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            visualSrc={projectVisuals[project.title]}
          />
        ))}
      </div>

      <p className="project-carousel__hint" aria-hidden="true">
        ← arrows / trackpad / swipe →
      </p>
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

        <FeaturedProjectCarousel />

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
