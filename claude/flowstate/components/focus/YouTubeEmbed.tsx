"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  duration: string;
  theme: string;
}

export function YouTubeEmbed({ videoId, title, duration, theme }: YouTubeEmbedProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
        {title}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{duration}</span>
        <span>{theme}</span>
      </div>
    </div>
  );
}
