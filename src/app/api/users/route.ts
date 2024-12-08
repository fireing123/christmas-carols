import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({
            error: "id undefined"
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    });

    if (user) {
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } else {
        return NextResponse.json({
            error: "id undefined"
        })
    }
}