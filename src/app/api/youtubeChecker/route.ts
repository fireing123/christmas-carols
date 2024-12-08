import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return NextResponse.json({
                youtubeEmbed: data.items[0].status.embeddable
            })
        }
    } catch (error) {
        return NextResponse.json({
            youtubeEmbed: false
        });
    }
    return NextResponse.json({
        youtubeEmbed: false
    });
}
