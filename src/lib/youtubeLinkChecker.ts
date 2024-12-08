export function isYouTubeLink(url: string) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url) ? null : "유효하지 않은 링크";
}

export function extractYouTubeId(url: string): string | null {
    const idRegex = /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/;
    const match = url.match(idRegex);
    return match ? match[1] : null;
}

export async function CheckYoutubeLink(id: string): Promise<boolean> {
    const res = await fetch(`/api/youtubeChecker?id=${id}`)
        .then(async res => await res.json());
    
    return res.youtubeEmbed;
}