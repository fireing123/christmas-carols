'use client';

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface PlayerState {
  videoId: string | null;  // 현재 재생 중인 비디오 ID
  isPlaying: boolean;      // 현재 재생 상태
}

interface YouTubePlayerContextType {
  playerRef: React.MutableRefObject<any>;
  playerState: PlayerState;
  play: (videoId: string) => void; // 비디오 재생
  pause: () => void;               // 재생 중지
  resume: () => void;              // 재생 재개
  setIsPlaying: (isPlaying: boolean) => void; // 재생 상태 업데이트
}

const YouTubePlayerContext = createContext<YouTubePlayerContextType | undefined>(undefined);

export const YouTubePlayerProvider = ({ children }: { children: ReactNode }) => {
    const playerRef = useRef<any>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    videoId: null,
    isPlaying: false
  });

  const play = (videoId: string) => {
    setPlayerState({ ...playerState, videoId, isPlaying: true });
    playerRef.current.playVideo();
  };

  const pause = () => playerRef.current.pauseVideo();

  const resume = () => playerRef.current.playVideo();

  const setIsPlaying = (isPlaying: boolean) =>
    setPlayerState({ ...playerState, isPlaying });

  return (
    <YouTubePlayerContext.Provider
      value={{ playerRef, playerState, play, pause, resume, setIsPlaying }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  );
};

export const useYouTubePlayer = (): YouTubePlayerContextType => {
  const context = useContext(YouTubePlayerContext);
  if (!context) {
    throw new Error('useYouTubePlayer must be used within a YouTubePlayerProvider');
  }
  return context;
};
