"use client";

import { decorationPaths, groundPaths, housePaths, presentPaths } from "@/lib/resorcePath";
import { Image, Button, Center, Group, Modal, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react";
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

export default function Home() {
    const [url, setUrl] = useState('dQw4w9WgXcQ')
    const { data: session, status } = useSession();
    const [opened, { open, close }] = useDisclosure(false);
    const [isPlaying, { toggle: playToggle, open: playOpen, close: playClose }] = useDisclosure(false);
    const [house, setHouse] = useState<HouseInfo>();
    const [presentIndex, setPresentIndex] = useState(0);
    
    const playerRef = useRef<YouTubePlayer>(null);
      
    useEffect(() => {
        if (status == "authenticated") {
            fetch(`/api/house?userId=${session.user?.userId}`)
            .then(async (res) => {
                const fetchRes = await res.json();
                if ("error" in fetchRes) {
                    console.log("error" + fetchRes.error);
                } else {
                    setHouse(fetchRes);
                    if (house?.presents.length != 0) {
                        setMusicIndex(0);
                    }
                }
            });
        }
    }, [status]);

    const backMusicList = () => {
        if (presentIndex == 0) {
            setPresentIndex(house?.presents.length! - 1)
        } else {
            setPresentIndex(presentIndex - 1)
        }
        setMusicIndex(presentIndex);
    }

    const nextMusicList = () => {
        if (presentIndex == house?.presents.length! - 1) {
            setPresentIndex(0)
        } else {
            setPresentIndex(presentIndex + 1)
        }
        setMusicIndex(presentIndex);
    }

    const setMusicIndex = (index: number) => {
        const youtubeId = house?.presents[index].song
        setUrl(youtubeId!);
        playOpen();
    }

    const openPresent = (presentId: string) => {
        const index = house?.presents.findIndex((value) => value.id == presentId);
        setPresentIndex(index!);
        open();
    }

    const onPlayerReady: YouTubeProps["onReady"] = (event) => {
        // YouTube player 객체 저장
        playerRef.current = event.target;
    };

    const playVideo = () => {
        if (!playerRef.current) return;

        playToggle();
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const opts: YouTubeProps['opts'] = {
        width: "80%",
        height: "auto",
        playerVars: {
            autoplay: 1,
        },
    };

    if (house) {
        return (
            <div
              className="container"
            >

            <Image
              w="100%"
              h="auto"
              fit="contain"
              src={groundPaths[house.backgroundColor]}
              alt="background"
              className="positionAbsolute"
            />

            <Image 
              w="50%"
              h="auto"
              fit="contain"
              src={housePaths[house.houseColor]}
              alt="house"
              className="positionAbsolute"
              style={{
                left: "40%",
                top: "45%"
              }}
            />

            {house.decorations.map((item, i) => (
                <Image
                  h="25%"
                  w="auto"
                  fit="contain"
                  src={decorationPaths[item.color]}
                  alt="decoration"
                  key={item.id}
                  className="positionAbsolute"
                  style={{
                      left: `${item.locationX}%`,
                      top: `${item.locationY}%`,
                  }}
                />
            ))}

            {house.presents.map((item) => (
                <Image
                  w="20%"
                  h="auto"
                  fit="contain"
                  src={presentPaths[item.color]}
                  alt="present"
                  key={item.id}
                  onClick={() => openPresent(item.id)}
                  className="positionAbsolute"
                  style={{
                      left: `${item.locationX}%`,
                      top: `${item.locationY}%`,
                  }}
                />
            ))}

            <Modal
              opened={opened} 
              onClose={close} 
              title={house.presents[presentIndex].authorEmail}
              centered
              fullScreen
            >
                
            {house.presents[presentIndex].letter}

            <Button onClick={() => {
                setMusicIndex(presentIndex)
                close();
            }}>추천한 노래듣기</Button>

            </Modal>

            <div 
              className="positionAbsolute"
              style={{
                  top: "400px"
              }}>

                <Center>
                <Group>
                    <UnstyledButton onClick={backMusicList}>
                        <IconPlayerSkipBack />
                    </UnstyledButton>
                    <UnstyledButton onClick={playVideo}>
                        {isPlaying && <IconPlayerPause />}
                        {!isPlaying && <IconPlayerPlay />}
                    </UnstyledButton>
                    <UnstyledButton onClick={nextMusicList}>
                        <IconPlayerSkipForward />
                    </UnstyledButton>
                </Group>
                </Center>

                <YouTube 
                  videoId={url}
                  opts={opts}
                  onReady={onPlayerReady}
                  onPlay={playOpen}
                  onPause={playClose}
                  onEnd={nextMusicList}
                  
                />
            </div>
            </div>
        )
    }
}