"use client";

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { groundPaths, housePaths, presentPaths } from "@/lib/resorcePath";
import Image from 'next/image';
import { Button, Group, Stack, Modal, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMusicPause, IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react";

export default function Home() {
    const [url, setUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')
    const { data: session, status } = useSession();
    const [opened, { open, close }] = useDisclosure(false);
    const [isPlaying, { toggle: playToggle, open: playOpen }] = useDisclosure(false);
    const [house, setHouse] = useState<HouseInfo>();
    const [presentIndex, setPresentIndex] = useState(0);

    useEffect(() => {
        if (status == "authenticated") {
            fetch(`/api/house?userId=${session.user?.userId}`)
            .then(async (res) => {
                const fetchRes = await res.json();
                if ("error" in fetchRes) {
                    console.log("error" + fetchRes.error);
                } else {
                    setHouse(fetchRes);
                }
            });
        }
    }, [status]);

    const onPlayerStateChange = () => {

    }

    const playVideo = () => {
        playToggle();
        if (isPlaying) {
            setUrl(url.replace('&autoplay=1', '').replace('?autoplay=1', ''));
        } else
        {
            setUrl(url + (url.includes('?') ? '&' : '?') + 'autoplay=1');
        }
    };

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
        setUrl(`https://www.youtube.com/embed/${youtubeId}?autoplay=1`);
        playOpen();
    }

    const openPresent = (presentId: string) => {
        const index = house?.presents.findIndex((value) => value.id == presentId);
        setPresentIndex(index!);
        open();
    }

    if (house) {
        return (
            <div
              className="container"
            >
            <Image 
              width={1080}
              height={1920}
              src={groundPaths[house.backgroundColor]}
              alt="background"
              className="positionAbsolute"
            />

            <Image 
              width={500 / 2}
              height={500 / 2}
              src={housePaths[house.houseColor]}
              alt="house"
              className="positionAbsolute"
              style={{
                left: "190px",
                top: "150px"
              }}
            />

            {house.presents.map((item) => (
                <Image
                  width={500 / 6}
                  height={500 / 6}
                  src={presentPaths[item.color]}
                  alt="present"
                  key={item.id}
                  onClick={() => openPresent(item.id)}
                  className="positionAbsolute"
                  style={{
                      left: `${item.locationX}px`,
                      top: `${item.locationY}px`,
                  }}
                />
            ))}

            <Modal opened={opened} onClose={close} title={house.presents[presentIndex].authorEmail}>
            {house.presents[presentIndex].letter}

            <Button onClick={() => {
                setMusicIndex(presentIndex)
                close();
            }}>추천한 노래듣기</Button>

            </Modal>

            <Stack
              style={{ 
                fontFamily: 'Arial, sans-serif',
                margin: '20px', 
                left: "0px",
                top: "380px"
            }}
              className="positionAbsolute"
            >
                <iframe 
                    src={`${url}&controls=0`}
                    allow="autoplay"
                />

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
            </Stack>
            </div>
        )
    }
}