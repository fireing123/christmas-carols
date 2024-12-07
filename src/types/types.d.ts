declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        email: string;
        name: string;
        image: string;
      };
    }
  }

interface HouseItem {
    id: number;
    x: number;
    y: number;
    label: string;
    isDraggable: boolean;
}

interface HouseInfo {
    id: string,
    authorEmail: string,
    link: string,
    wallColor: number,
    roofColor: number,
    presents: PresentData[],
}

interface PresentData {
    locationX: number;
    locationY: number;
    color: number;
    authorEmail: string;
    song: string;
    letter: string;
}