"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ColorPicker, Dialog, Group, Button, Image, Modal, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { houseColors, housePaths, groundColors, groundPaths, decorationPaths, decorationColors } from '@lib/resorcePath';


export default function Make() {
    const { data: session, status } = useSession();
    const [house, setHouse] = useState<HouseInfo>();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [decorationOpened, { open: decOpen, close: decClose }] = useDisclosure(false);

    const [opendComponent, setOpendComponent] = useState("house");
    const [color, setColor] = useState(0);

    const [houseColor, setHouseColor] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState(0);

    const [decColor, setDecColor] = useState(0);

    if (status == "authenticated") {
        console.log(session)
    }

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
            })
        }
    }, [status]);

    const OpenHouse = () => {
        setOpendComponent("house");
        toggle();
    }

    const OpenBackground = () => {
        setOpendComponent("background");
        toggle();
    }

    const SaveHouse = () => {

    }

    const createDecData = () => {
        
    }

    const changeColor = (value: string) => {
        if (opendComponent == "house") {
            const index = houseColors.indexOf(value);
            setColor(index);

            setHouseColor(index);
        } else if (opendComponent == "background") {
            const index = groundColors.indexOf(value);
            setColor(index);

            setBackgroundColor(index);
        }
    }

    return (
        <div className="container">
            <Image 
              w="100%"
              h="auto"
              fit="contain"
              src={groundPaths[backgroundColor]}
              alt="background" 
              onClick={OpenBackground}
              className="positionAbsolute"
            />

            <Image 
              w="50%"
              h="auto"
              fit="contain"
              src={housePaths[houseColor]}
              alt="house" 
              onClick={OpenHouse}
              className="positionAbsolute"
              style={{
                left: "40%",
                top: "45%"
              }}
            />

            <Button 
              onClick={SaveHouse} 
              className="positionAbsolute"
              style={{
                left: "200px",
                top: "50px"
              }}
            >save</Button>

            <Button 
              onClick={decOpen}
              className="positionAbsolute"
              style={{
                left: "10px",
                top: "50px"
              }}
            >장식품 추가</Button>

            <Modal fullScreen opened={decorationOpened} onClose={decClose} title="장식품 추가">
                    {decorationColors.map((item, i) => (
                        
                            <Image
                              w="20%"
                              h="auto"
                              fit="contain"
                              src={decorationPaths[i]}
                              alt="present"
                              key={i}
                              onClick={() => setDecColor(i)}
                            />

                    ))}
            </Modal>

            <Dialog opened={opened} withCloseButton onClose={close} size="lg" radius="md">
                <Group align="flex-end">
                    <ColorPicker 
                      format='hex'
                      value={opendComponent === "house" ? houseColors[color] : groundColors[color]}
                      onChange={(value) => changeColor(value)}
                      withPicker={false}
                      swatches={opendComponent === "house" ? houseColors : groundColors}
                    />
                </Group>
            </Dialog>
        </div>
    );
}
