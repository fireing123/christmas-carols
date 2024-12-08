"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ColorPicker, Dialog, Group, Button, Image, Modal, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { houseColors, housePaths, groundColors, groundPaths, decorationPaths } from '@lib/resorcePath';


export default function Make() {
    const { data: session, status } = useSession();
    const [house, setHouse] = useState<HouseInfo>();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [decorationOpened, { open: decOpen, close: decClose }] = useDisclosure(false);

    const [items, setItems] = useState<Decoration[]>([]);
    const [dragId, setDragId] = useState<string | null>();
    const [opendComponent, setOpendComponent] = useState("house");
    const [color, setColor] = useState(0);

    const [houseColor, setHouseColor] = useState(0);
    const [backgroundColor, setBackgroundColor] = useState(0);

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
        fetch(`/api/house`, {
            method: "PATCH",
            body: JSON.stringify({
                ...house
            })
        }).then(async (res) => {
            setHouse(await res.json());

            setItems(house?.decorations!);
            setDragId(null);
            setHouseColor(house?.houseColor!);
            setBackgroundColor(house?.backgroundColor!);
        })
    }

    const createDecData = (color: number) => {
        if (status != "authenticated") return;

        setItems([...items,
            {
                id: Math.random().toString(36).substring(2, 16),
                locationX: 100,
                locationY: 100,
                color: color,
            }
        ])
        decClose();
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

    const handleMouseDown = (id: string, event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragId(id)
    };

    // 드래그 중 위치 업데이트
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (dragId == null) return;

        const clientX =
            "clientX" in event
                ? event.clientX
                : event.touches[0].clientX;
        const clientY =
            "clientY" in event
                ? event.clientY
                : event.touches[0].clientY;

        setItems(
            items.map((item) =>
                item.id === dragId
                ? { ...item, locationX: clientX - 50, locationY: clientY - 150} as never
                : item
            )
        )

    };

    // 드래그 종료
    const handleMouseUp = () => {
        setDragId(null);
    };


    return (
        <div 
          className="container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
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

            {items.map((v, i) => (
                <Image
                  w="25%"
                  h="auto"
                  fit="contain"
                  src={decorationPaths[v.color]}
                  alt="house" 
                  key={i}
                  className="draggable"
                  style={{
                      left: `${v.locationX}px`,
                      top: `${v.locationY}px`,
                      zIndex: dragId === v.id ? 10 : 1,
                  }}
                  onMouseDown={(e) => handleMouseDown(v.id, e)}
                  onTouchStart={(e) => handleMouseDown(v.id, e)}
                />
            ))}

            <Button 
              onClick={SaveHouse} 
              className="positionAbsolute"
              style={{
                left: "270px",
                top: "10px"
              }}
            >save</Button>

            <Button 
              onClick={decOpen}
              className="positionAbsolute"
              style={{
                left: "-45px",
                top: "10px"
              }}
            >장식품 추가</Button>

            <Modal fullScreen opened={decorationOpened} onClose={decClose} title="장식품 추가">
                {decorationPaths.map((item, i) => (
                    <Image
                      w="20%"
                      h="auto"
                      fit="contain"
                      src={item}
                      alt="decoration"
                      key={i}
                      onClick={() => createDecData(i)}
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
