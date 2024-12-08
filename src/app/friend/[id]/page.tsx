"use client";
import { useEffect, useState } from 'react';
import { Image, ActionIcon, Group, TextInput, Drawer, Button, Checkbox, Select, Overlay, AspectRatio, Text, Dialog, ColorPicker, Chip, ColorSwatch, CheckIcon, rem, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconHeart } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { houseColors, housePaths, groundColors, groundPaths, presentColors, presentPaths, decorationPaths } from '@lib/resorcePath';
import { isYouTubeLink } from '@/lib/youtubeLinkChecker';

export default function Friend() {
    const params = useParams<{ id: string }>();
    const { data: session, status } = useSession();
    const [friendHouse, setFriendHouse] = useState<HouseInfo>();
    const [formOpened, { open: formOpen, close: formClose }] = useDisclosure(false);
    const [item, setItem] = useState<PresentData>();
    const [isDragging, setIsDragging] = useState(false);
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState();
    const [presentColor, setPresentColor] = useState(0);
  
    const updateHouse = () => {
        fetch(`/api/house?userId=${params.id}`)
        .then(async (res) => {
            const fetchRes = await res.json();
            if ("error" in fetchRes) {
                console.log("error" + fetchRes.error)
            } else {
                setFriendHouse(fetchRes)
            }
        });

        fetch(`/api/users?id=${params.id}`)
        .then(async (res) => {
            const fetchRes = await res.json();
            if ("error" in fetchRes) {
                console.log("error" + fetchRes.error)
            } else {
                setName(fetchRes.name);
            }
        });
    }

    useEffect(updateHouse, [params.id]);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          youtubeLink: '',
          letter: '',
          color: 0,
        },
        validate: {
            youtubeLink: (value) => isYouTubeLink(value)
        }
    });
    
    const handleSubmitCreateHouseItem = (values: typeof form.values) => {
        CreatePresentData(values.color, values.letter, values.youtubeLink)
        form.reset()
        formClose()
    }

    const CreatePresentData = (color: number, letter: string, song: string) => {
        if (status != "authenticated") return;

        const authorEmail = session.user?.email

        const newItem:  PresentData = {
            id: Math.random().toString(36).substring(2, 16),
            authorEmail: authorEmail!,
            locationX: 100,
            locationY: 100,
            color: color,
            letter: letter,
            song: song
        };
        setItem(newItem);
        setVisible(true);
    };

    // 요소 클릭 시 드래그 시작
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    // 드래그 중 위치 업데이트
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            setItem((prev) => {
                return { ...prev, locationX: event.clientX - 50, locationY: event.clientY - 150} as PresentData
            })
        }
    };

    // 드래그 종료
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const SendPresent = () => {
        updateHouse();
        setVisible(false);
    }

    const CancelSendPresent = () => {
        setVisible(false);
    }

    if (friendHouse) {
        return (
            <div>
                <Drawer 
                  offset={15} 
                  radius="md" 
                  opened={formOpened} 
                  onClose={formClose} 
                  title="노래 추천해주기"
                >
                    <form onSubmit={form.onSubmit(handleSubmitCreateHouseItem)}>
                        <TextInput
                          withAsterisk
                          label="YoutubeLink"
                          placeholder="youtube.com/...."
                          key={form.key('youtubeLink')}
                          {...form.getInputProps('youtubeLink')}
                        />
        
                        <TextInput
                          withAsterisk
                          label="Letter"
                          placeholder="short letter"
                          key={form.key('letter')}
                          {...form.getInputProps('letter')}
                        />

        
                        <Group>
                        {presentColors.map((v, i) => {
                            return (
                                <ColorSwatch key={i} color={v} onClick={() => setPresentColor(i)}>
                                {presentColor === i && <CheckIcon style={{ width: rem(12), height: rem(12) }} />}
                                </ColorSwatch>
                            );
                        })}
                        </Group>

                        <Image
                          h="10%"
                          w="auto"
                          fit="contain"
                          src={presentPaths[presentColor]}
                          alt="present"
                          className="positionAbsolute"
                        />

                        <Group justify="flex-end" mt="md">
                          <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Drawer>
    
                <AspectRatio pos="relative">
                    <div
                        className="container"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        
                        <Image 
                          width="100%"
                          height="auto"
                          src={groundPaths[friendHouse.backgroundColor]}
                          alt="background"
                          className="positionAbsolute"
                        />
    
                        <Image 
                          h="50%"
                          w="auto"
                          fit="contain"
                          src={housePaths[friendHouse.houseColor]}
                          alt="house"
                          className="positionAbsolute"
                          style={{
                            left: "190px",
                            top: "150px"
                          }}
                        />

                        {friendHouse && friendHouse.decorations.map((item) => (
                            <Image
                              h="25%"
                              w="auto"
                              fit="contain"
                              src={decorationPaths[item.color]}
                              alt="decoration"
                              key={item.id}
                              className="draggable"
                              style={{
                                  left: `${item.locationX}px`,
                                  top: `${item.locationY}px`,
                              }}
                            />
                        ))}

                        {friendHouse && friendHouse.presents.map((item) => (
                            <Image
                              h="20%"
                              w="auto"
                              fit="contain"
                              src={presentPaths[item.color]}
                              alt="present"
                              key={item.id}
                              className="draggable"
                              style={{
                                  left: `${item.locationX}px`,
                                  top: `${item.locationY}px`,
                              }}
                            />
                        ))}

                        <Text className="positionAbsolute">{name} 님의 하우스에 오신것을 환영합니다</Text>

                        <ActionIcon
                          variant="filled" 
                          aria-label="Settings" 
                          onClick={formOpen}
                          className="positionAbsolute"
                          style={{
                            left: "300px",
                            top: "20px"
                          }}
                        >
                            <IconHeart />
                        </ActionIcon>
    

                        {visible && <Overlay
                          gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
                          opacity={0.85}
                        >
                            {item &&
                            <Image
                              h="10%"
                              w="auto"
                              fit="contain"
                              src={presentPaths[item.color]}
                              alt="present"
                              className="positionAbsolute"
                              style={{
                                  left: `${item.locationX}px`,
                                  top: `${item.locationY}px`,
                                  zIndex: isDragging ? 10 : 1,
                              }}
                              onMouseDown={(e) => handleMouseDown(e)}
                            />
                            }
                            <Group>
                                <Button onClick={SendPresent}>OK</Button>
                                <Button onClick={CancelSendPresent}>NO</Button>
                            </Group>
                        </Overlay>
                        }
                    </div>
                </AspectRatio>
    
                
            </div>
        );
    } else {
        return (
            <div>cq</div>
        )
    }
}
