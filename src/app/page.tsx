"use client";

import { useYouTubePlayer } from "@/component/Layout/YoutubeContext";
import YoutubeBox from "@/component/YoutubeBox";
import { decorationPaths, groundPaths, housePaths, presentPaths } from "@/lib/resorcePath";
import { Image, Button, Center, Group, Modal, UnstyledButton, Stack, Text, Title, CopyButton, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

export default function Home() {
    const router = useRouter();
    const { playerRef, playerState, pause, resume, play } = useYouTubePlayer();
    const { data: session, status } = useSession();
    const [opened, { open, close }] = useDisclosure(false);
    const [house, setHouse] = useState<HouseInfo>();
    const [presentIndex, setPresentIndex] = useState(0);

    useEffect(() => {
        if (status == "authenticated") {
            fetch(`/api/house?userId=${session.user?.id}`)
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

            <Button
              className="positionAbsolute"
              onClick={() => router.push("/make")}
            >집 꾸미기</Button>

            <CopyButton value={`https://christmas-carols.vercel.app/h/${session?.user?.id}`}>
            {({ copied, copy }) => (
               <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                 {copied ? 'Copied url' : 'Copy url'}
               </Button>
            )}
            </CopyButton>

            <Modal
              opened={opened} 
              onClose={close}
              centered
              fullScreen
            >
             
             <Stack>
                   
                <Center>
                    <Title order={2}>{house.presents[presentIndex].authorName}님의 선물상자</Title>

                </Center>

                <Center>
                    {house.presents[presentIndex].song == playerState.videoId ? (
                        <YoutubeBox />
                    ): (
                        <Button>노래 듣기</Button>
                    )}
                    
                </Center>
                

                <Space />

                <Center>
                    <Text>{house.presents[presentIndex].letter}</Text>
                </Center>
                


             </Stack>

            </Modal>
            </div>
        )
    }
}