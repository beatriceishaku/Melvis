
import React from "react";

interface YouTubeRecommendationProps {
  videos: { title: string; youtubeId: string }[];
}

export const YouTubeRecommendation: React.FC<YouTubeRecommendationProps> = ({ videos }) => (
  <div className="flex gap-4 mt-2">
    {videos.map((vid) => (
      <a
        key={vid.youtubeId}
        href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={vid.title}
        className="bg-blue-200 hover:bg-blue-300 rounded-lg p-2 flex items-center transition hover-scale"
      >
        <svg height="32" width="32" className="text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15.5l6-3.5-6-3.5v7z"/><path d="M21.5 7.5s-.2-1.2-.7-1.8a2.573 2.573 0 0 0-1.9-.8C16.1 5 12 5 12 5s-4.1 0-6.9.1c-.7.1-1.4.4-1.9.8-.5.6-.7 1.8-.7 1.8S2 9.1 2 10.7v2.5c0 1.6.2 3.2.2 3.2s.2 1.2.7 1.8a2.573 2.573 0 0 0 1.9.8C7.9 19 12 19 12 19s4.1 0 6.9-.1c.7-.1 1.4-.4 1.9-.8.5-.6.7-1.8.7-1.8s.2-1.6.2-3.2v-2.5c0-1.6-.2-3.2-.2-3.2z"/></svg>
        <span className="font-medium text-blue-800">{vid.title}</span>
      </a>
    ))}
  </div>
);
