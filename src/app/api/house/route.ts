import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/authOptions';

export async function POST(request: Request) {

}

export async function GET(request: Request) {
    const  session = await auth();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            error: "id undefined"
        })
    }

    if (!session) {
        return NextResponse.json({
            error: "session undefined"
        })
    }

    // get house info

    return NextResponse.json({
        authorEmail: "gimd82368@gmail.com",
        wallColor: 0,
        roofColor: 0,
        presents: [
            {
                locationX: 50,
                locationY: 50,
                color: 0,
                authorEmail: "gamd82368@gmail.com",
                song: "dJhp6awU5Z8",
                letter: "존나 아프다...."
            }
        ]
    })
}

export async function PATCH(request: Request) {
    
}