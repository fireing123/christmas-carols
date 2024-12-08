'use client';

import React, { useRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useYouTubePlayer } from './Layout/YoutubeContext';

const GlobalPlayer: React.FC = () => {
    const { playerRef, playerState, setIsPlaying } = useYouTubePlayer();
    
  
    const onPlayerReady = (event: YouTubeEvent) => {
      playerRef.current = event.target;
      console.log(event.target)
      if (playerState.isPlaying && playerState.videoId) {
        playerRef.current.playVideo();
      }
    };
  
    const onPlayerStateChange = (event: YouTubeEvent) => {
        if (event.data === 1) {
            // 재생 중
            setIsPlaying(true);
        } else if (event.data === 2) {
            // 일시 정지
            setIsPlaying(false);
        }
    };

    const playerOptions = {
        height: "0",
        width: "0",
        playerVars: {
            autoplay: 1, // 자동 재생
        },
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            <YouTube
              videoId={playerState.videoId}
              opts={playerOptions}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
            />
        </div>
    );
};

export default GlobalPlayer;
