
interface HouseInfo {
    id: string;
    authorEmail: string;
    link: string;
    houseColor: number;
    backgroundColor: number;
    presents: PresentData[];
    decorations: Decoration[];
}

interface PresentData {
    id: string;
    locationX: number;
    locationY: number;
    color: number;
    authorEmail: string;
    song: string;
    letter: string;
}

interface Decoration {
    id: string;
    locationX: number;
    locationY: number;
    color: number;
}