"use client";

import { YouTubeEmbed } from "./YouTubeEmbed";

const VIDEOS = [
  {
    videoId: "r6zFZQm0hcc",
    title: "Give Me 54 Seconds and I'll Make You Dangerously Motivated",
    duration: "54 seconds",
    theme: "Movement creates motivation",
  },
  {
    videoId: "UwMS0J2eTXE",
    title: "Give Me 58 Seconds and I'll DELETE Your Fear of Rejection",
    duration: "58 seconds",
    theme: "Rejection = redirection",
  },
  {
    videoId: "5fHR_De7FIU",
    title: "Give Me 51 Seconds and UNLOCK Your Full Potential",
    duration: "51 seconds",
    theme: "Destroy your comfort zone",
  },
];

export function VideoGrid() {
  return (
    <div>
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
        2 min 43 sec of pure fire. Reach for this, not Twitter.
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {VIDEOS.map((v) => (
          <YouTubeEmbed key={v.videoId} {...v} />
        ))}
      </div>
    </div>
  );
}
