"use client";

import { Center, Group, Paper, UnstyledButton, Text, Stack, Slider } from '@mantine/core';
import { useYouTubePlayer } from './Layout/YoutubeContext';
import { IconPlayerSkipBack, IconPlayerPause, IconPlayerPlay, IconPlayerSkipForward } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function YoutubeBox() {
    const { playerRef, playerState, pause, resume, play } = useYouTubePlayer();
    const { data: session, status } = useSession();
    const [house, setHouse] = useState<HouseInfo>();
    const [currentTime, setCurrentTime] = useState(0); // 현재 시간
    const [duration, setDuration] = useState(0);      // 비디오 총 길이

    const updateTime = () => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration());
        }
      };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000); // 1초마다 시간 업데이트
        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
      }, []);

    useEffect(() => {
        if (status == "authenticated") {
            fetch(`/api/house?userId=${session.user?.id}`)
            .then(async (res) => {
                const fetchRes = await res.json();
                if ("error" in fetchRes) {
                    console.log("error" + fetchRes.error);
                } else {
                    setHouse(fetchRes);
                    if (fetchRes?.presents.length != 0 && !playerState.videoId) {
                        play(fetchRes?.presents[0].song!)
                    }
                }
            });
    }}, [status]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    const getMusicIndex = (songid: string) => {
        return house?.presents.findIndex((v) => v.song == songid)
    }

    const setPlayByIndex = (index: number) => {
        console.log(playerState.videoId, index)
        play(house?.presents[index].song!)
        console.log(playerState.videoId)
    }

    const backMusicList = () => {
        const currentIndex = getMusicIndex(playerState.videoId!)!;

        if (currentIndex == -1) {
            setPlayByIndex(0);
            return;
        }

        if (currentIndex == 0) {
            setPlayByIndex(house?.presents.length! - 1)
        } else {
            setPlayByIndex(currentIndex - 1)
        }
    }

    const nextMusicList = () => {
        const currentIndex = getMusicIndex(playerState.videoId!)!;

        if (currentIndex == -1) {
            setPlayByIndex(0);
            return;
        }

        if (currentIndex == house?.presents.length! - 1) {
            setPlayByIndex(0)
        } else {
            setPlayByIndex(currentIndex + 1)
        }
    }

    return (
            <Paper w="100%" h="100%">
                <Stack
                  align="center"
                  justify="center"
                >
                <Text truncate="end" w="80%">{playerRef.current?.videoTitle}</Text>
                <Text>{formatTime(currentTime)}/{formatTime(duration)}</Text>
                <Group>
                    <UnstyledButton onClick={backMusicList}>
                        <IconPlayerSkipBack />
                    </UnstyledButton>
                    <UnstyledButton onClick={() => {playerState.isPlaying ? pause() : resume()}}>
                        {playerState.isPlaying && <IconPlayerPause />}
                        {!playerState.isPlaying && <IconPlayerPlay />}
                    </UnstyledButton>
                    <UnstyledButton onClick={nextMusicList}>
                        <IconPlayerSkipForward />
                    </UnstyledButton>
                </Group>
                </Stack>
                
            </Paper>
    );
}