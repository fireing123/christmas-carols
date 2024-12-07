"use client";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ColorPicker, Text, Dialog, ActionIcon, Group, TextInput, Drawer, Button, Checkbox, Select, Overlay, AspectRatio, ColorSwatch, CheckIcon, rem  } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

const colors = ['#fff'];

export default function Make() {
    const { data: session, status } = useSession();
    const [house, setHouse] = useState<HouseInfo>();

    useEffect(() => {
        if (status == "authenticated") {
            fetch(`/api/house?userId=${session.user?.id}`)
            .then(async (res) => {
                const fetchRes = await res.json();
                if ("error" in fetchRes) {
                    console.log("error" + fetchRes.error)
                } else {

                }
            })
        }
    }, [status]);

    const [opened, { toggle, close }] = useDisclosure(false);

    const [opendComponent, setOpendComponent] = useState("roof");
    const [color, setColor] = useState(0);

    const [roofColor, setRoofColor] = useState(0);
    const [wallColor, setWallColor] = useState(0);

    const OpenHouseRoof = () => {
        setOpendComponent("roof");
        toggle()
    }

    const OpenHouseWall = () => {
        setOpendComponent("wall");
        toggle();
    }

    const SaveHouse = () => {

    }

    const changeColor = (value: string) => {
        const index = colors.indexOf(value);
        setColor(index);

        if (opendComponent == "roof") {
            setRoofColor(index);
        } else if (opendComponent == "wall") {
            setWallColor(index);
        }
    }

    return (
        <>
            <Button onClick={SaveHouse}>save</Button>

            <Group justify="center">
                <Button onClick={OpenHouseRoof}>Toggle dialog</Button>
            </Group>
        
            <Group justify="center">
                <Button onClick={OpenHouseWall}>Toggle dialog</Button>
            </Group>
        
            <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
                <Group align="flex-end">
                    <ColorPicker 
                      format='hex'
                      value={colors[color]}
                      onChange={(value) => changeColor(value)}
                      withPicker={false}
                      swatches={colors}
                    />
                </Group>
            </Dialog>


          
        </>
    );
}
