import { useEffect, useMemo, useState } from "react";
import MoriFace from "./MoriFace";
import "../mori-reactions.css";

const LANYARD_USER_ID = "536248721189371904";
const POLL_INTERVAL_MS = 30_000;

const GENRE_PROXY_URL = (
  import.meta.env.VITE_MORI_GENRE_PROXY_URL as string | undefined
)?.replace(/\/+$/, "");

type SpotifyPresence = {
  song: string;
  artist: string;
  album?: string;
  track_id?: string;

  timestamps: {
    start: number;
    end: number;
  };
};

type LanyardResponse = {
  success: boolean;

  data?: {
    listening_to_spotify?: boolean;
    spotify?: SpotifyPresence | null;
  };
};

type MoriMotion =
  | "headbang"
  | "pogo"
  | "bounce"
  | "nod"
  | "bop"
  | "sway"
  | "float"
  | "idle";

type GenreResponse = {
  requestedArtist: string;
  requestedTrack: string;
  matchedArtist: string;
  matchedTrack: string;

  tagSource:
    | "lastfm-track"
    | "lastfm-artist"
    | "musicbrainz-recording"
    | "musicbrainz-artist"
    | "keyword"
    | "none";

  primaryTag: string | null;

  tags: Array<{
    name: string;
    count: number;
  }>;

  reaction: {
    key: string;
    motion: MoriMotion;
    message: string;
  };
};

type PlayerState =
  | {
      status: "loading";
    }
  | {
      status: "idle";
    }
  | {
      status: "offline";
    }
  | {
      status: "playing";
      spotify: SpotifyPresence;
    };

type GenreState =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "unavailable";
    }
  | {
      status: "ready";
      data: GenreResponse;
    };

function formatTime(milliseconds: number): string {
  const seconds = Math.max(
    0,
    Math.floor(milliseconds / 1000),
  );

  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${remainder}`;
}

function truncate(
  value: string,
  maxLength = 30,
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function buildProgressBar(
  progress: number,
  cells = 14,
): string {
  const safeProgress = Math.max(
    0,
    Math.min(1, progress),
  );

  const filledCells = Math.round(
    safeProgress * cells,
  );

  return (
    "█".repeat(filledCells) +
    "░".repeat(cells - filledCells)
  );
}

function getMoriMessage(
  playerStatus: PlayerState["status"],
  genreState: GenreState,
): string {
  if (playerStatus === "playing") {
    if (genreState.status === "ready") {
      return genreState.data.reaction.message;
    }

    if (genreState.status === "loading") {
      return "consulting forbidden metadata...";
    }

    return "tail.sh keeping rhythm";
  }

  if (playerStatus === "loading") {
    return "checking audio daemon";
  }

  if (playerStatus === "offline") {
    return "lanyard fell out of the network";
  }

  return "listening to fan noise";
}

function getProcessStatus(
  playerStatus: PlayerState["status"],
): string {
  switch (playerStatus) {
    case "playing":
      return "playing";

    case "loading":
      return "booting";

    case "offline":
      return "offline";

    default:
      return "idle";
  }
}

function NowPlayingFamiliar() {
  const [playerState, setPlayerState] =
    useState<PlayerState>({
      status: "loading",
    });

  const [genreState, setGenreState] =
    useState<GenreState>({
      status: "idle",
    });

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    let pollTimer: number | undefined;
    let activeController: AbortController | null = null;

    const poll = async () => {
      activeController?.abort();
      activeController = new AbortController();

      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`,
          {
            signal: activeController.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Lanyard returned HTTP ${response.status}`,
          );
        }

        const payload =
          (await response.json()) as LanyardResponse;

        if (cancelled) {
          return;
        }

        if (
          payload.success &&
          payload.data?.listening_to_spotify &&
          payload.data.spotify
        ) {
          setPlayerState({
            status: "playing",
            spotify: payload.data.spotify,
          });

          setNow(Date.now());
        } else {
          setPlayerState({
            status: "idle",
          });
        }
      } catch (error) {
        if (
          cancelled ||
          (
            error instanceof DOMException &&
            error.name === "AbortError"
          )
        ) {
          return;
        }

        console.error(
          "Lanyard lookup failed:",
          error,
        );

        setPlayerState({
          status: "offline",
        });
      } finally {
        if (!cancelled) {
          pollTimer = window.setTimeout(
            poll,
            POLL_INTERVAL_MS,
          );
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
      activeController?.abort();

      if (pollTimer !== undefined) {
        window.clearTimeout(pollTimer);
      }
    };
  }, []);

  const activeArtist =
    playerState.status === "playing"
      ? playerState.spotify.artist
      : "";

  const activeTrack =
    playerState.status === "playing"
      ? playerState.spotify.song
      : "";

  useEffect(() => {
    if (!activeArtist || !activeTrack) {
      setGenreState({
        status: "idle",
      });

      return;
    }

    if (!GENRE_PROXY_URL) {
      console.warn(
        "VITE_MORI_GENRE_PROXY_URL is not configured.",
      );

      setGenreState({
        status: "unavailable",
      });

      return;
    }

    const controller = new AbortController();

    const loadGenre = async () => {
      setGenreState({
        status: "loading",
      });

      try {
        const query = new URLSearchParams({
          artist: activeArtist,
          track: activeTrack,
        });

        const response = await fetch(
          `${GENRE_PROXY_URL}/v1/track-tags?${query.toString()}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Mori proxy returned HTTP ${response.status}`,
          );
        }

        const payload =
          (await response.json()) as GenreResponse;

        setGenreState({
          status: "ready",
          data: payload,
        });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Mori genre lookup failed:",
          error,
        );

        setGenreState({
          status: "unavailable",
        });
      }
    };

    void loadGenre();

    return () => {
      controller.abort();
    };
  }, [activeArtist, activeTrack]);

  useEffect(() => {
    if (playerState.status !== "playing") {
      return;
    }

    const progressTimer = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => {
      window.clearInterval(progressTimer);
    };
  }, [playerState.status]);

  const playback = useMemo(() => {
    if (playerState.status !== "playing") {
      return null;
    }

    const { start, end } =
      playerState.spotify.timestamps;

    const duration = Math.max(
      1,
      end - start,
    );

    const elapsed = Math.max(
      0,
      Math.min(
        duration,
        now - start,
      ),
    );

    return {
      duration,
      elapsed,
      progress: elapsed / duration,
    };
  }, [now, playerState]);

  const trackHref =
    playerState.status === "playing" &&
    playerState.spotify.track_id
      ? `https://open.spotify.com/track/${playerState.spotify.track_id}`
      : undefined;

  const motion =
    genreState.status === "ready"
      ? genreState.data.reaction.motion
      : "idle";

  const motionClass =
    playerState.status === "playing"
      ? `now-playing-familiar--motion-${motion}`
      : "";

  const moriMessage = getMoriMessage(
    playerState.status,
    genreState,
  );

  const processStatus = getProcessStatus(
    playerState.status,
  );

  return (
    <section
      className={[
        "terminal-window",
        "now-playing-familiar",
        `now-playing-familiar--${playerState.status}`,
        motionClass,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Mori Spotify now playing terminal"
      aria-live="polite"
    >
      <div className="terminal-window__bar now-playing-familiar__bar">
        <p className="now-playing-familiar__title">
          mori.sh
        </p>

        <div className="now-playing-familiar__bar-right">
          <small className="now-playing-familiar__process-status">
            {processStatus}
          </small>

          <div
            className="now-playing-familiar__window-dots"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="terminal-window__body now-playing-familiar__body">
        <div className="now-playing-familiar__mori">
          <MoriFace />

          <p className="now-playing-familiar__judgement">
            {moriMessage}
          </p>
        </div>

        <div className="now-playing-familiar__details">
          {playerState.status === "playing" && playback ? (
            <>
              <p>
                <span>track</span>

                {trackHref ? (
                  <a
                    href={trackHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncate(
                      playerState.spotify.song,
                    )}
                  </a>
                ) : (
                  <strong>
                    {truncate(
                      playerState.spotify.song,
                    )}
                  </strong>
                )}
              </p>

              <p>
                <span>artist</span>

                <strong>
                  {truncate(
                    playerState.spotify.artist,
                  )}
                </strong>
              </p>

              <p className="now-playing-familiar__progress">
                <span aria-hidden="true">
                  ▶
                </span>

                <code>
                  {buildProgressBar(
                    playback.progress,
                  )}
                </code>

                <small>
                  {formatTime(
                    playback.elapsed,
                  )}
                  {" / "}
                  {formatTime(
                    playback.duration,
                  )}
                </small>
              </p>
            </>
          ) : (
            <p className="now-playing-familiar__state">
              <span>state</span>

              <strong>
                {playerState.status === "loading"
                  ? "querying presence"
                  : playerState.status === "offline"
                    ? "signal unavailable"
                    : "sleeping"}
              </strong>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default NowPlayingFamiliar;