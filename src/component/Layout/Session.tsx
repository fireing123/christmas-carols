'use client'
import { SessionProvider } from "next-auth/react";

export function SessionLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}