"use client";

import { SetStateAction, useState } from "react";


export default function Home() {
    const [url, setUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')

    const playVideo = () => {
        if (url.includes('youtube.com')) {
            setUrl(url + (url.includes('?') ? '&' : '?') + 'autoplay=1');
        } else {
            alert('Play functionality is only supported for YouTube videos.');
        }
    };

    const pauseVideo = () => {
        if (url.includes('autoplay=1')) {
            setUrl(url.replace('&autoplay=1', '').replace('?autoplay=1', ''));
        } else {
            alert('The video is not currently playing.');
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <h1>iFrame Controller</h1>
            <iframe 
                src={`${url}&controls=0`}
                allow="autoplay"
            ></iframe>

            <div>
                <label htmlFor="urlInput">New Video URL:</label>
                <input
                    type="text"
                    id="urlInput"
                    placeholder="Enter YouTube embed URL"
                    style={{ width: '300px', padding: '5px', fontSize: '16px', margin: '5px 0' }}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <div>
                <button onClick={playVideo} style={{ margin: '5px', padding: '10px', fontSize: '16px' }}>
                    Play
                </button>
                <button onClick={pauseVideo} style={{ margin: '5px', padding: '10px', fontSize: '16px' }}>
                    Pause
                </button>
            </div>
        </div>
  );
}