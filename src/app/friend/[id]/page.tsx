"use client";
import { useEffect, useState } from 'react';
import { ActionIcon, Group, TextInput, Drawer, Button, Checkbox, Select, Overlay, AspectRatio  } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconHeart } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Friend() {
    const params = useParams<{ id: string }>();
    const { data: session, status } = useSession();
    const [friendHouse, setFriendHouse] = useState<HouseInfo>();
    const [formOpened, { open: formOpen, close: formClose }] = useDisclosure(false);
    const [item, setItem] = useState<PresentData>();
    const [isDragging, setIsDragging] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        fetch(`/api/house?userId=${params.id}`)
        .then(async (res) => {
            const fetchRes = await res.json();
            if ("error" in fetchRes) {
                console.log("error" + fetchRes.error)
            } else {
                setFriendHouse(fetchRes)
            }
        })
    }, [params.id]);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          youtubeLink: '',
          letter: '',
          color: 0,
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
        setVisible(false);
    }

    const CancelSendPresent = () => {
        setVisible(false);
    }

    return (
        <div>
            <Drawer offset={8} radius="md" opened={formOpened} onClose={formClose} title="Authentication">
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

                    <Select
                      mt="md"
                      label="selet color"
                      data={["red", "blue"]}
                      key={form.key('color')}
                      {...form.getInputProps('color')}
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
                    <ActionIcon variant="filled" aria-label="Settings" onClick={formOpen}>
                        <IconHeart />
                    </ActionIcon>

                    
                    {friendHouse && friendHouse.presents.map((item) => (
                        <div
                            key={item.authorEmail}
                            className="draggable"
                            style={{
                                left: `${item.locationX}px`,
                                top: `${item.locationY}px`,
                            }}
                        >
                            {item.authorEmail}
                        </div>
                    ))}

                    {visible && <Overlay
                      gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
                      opacity={0.85}
                    >
                        {item &&
                        <div
                            className="draggable"
                            style={{
                                left: `${item.locationX}px`,
                                top: `${item.locationY}px`,
                                zIndex: isDragging ? 10 : 1,
                            }}
                            onMouseDown={(e) => handleMouseDown(e)}
                        >
                            {item.authorEmail}
                        </div>
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
}
