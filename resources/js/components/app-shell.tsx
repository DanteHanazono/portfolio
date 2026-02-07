import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { SharedData } from '@/types';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

function getSidebarStateFromCookie(): boolean | null {
    if (typeof document === 'undefined') return null;

    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar_state='));

    if (!cookie) return null;

    const value = cookie.split('=')[1];
    return value === 'true';
}

export function AppShell({ children, variant = 'header' }: Props) {
    const serverDefault = usePage<SharedData>().props.sidebarOpen;
    const [defaultOpen, setDefaultOpen] = useState<boolean>(serverDefault);

    useEffect(() => {
        const cookieState = getSidebarStateFromCookie();
        if (cookieState !== null) {
            setDefaultOpen(cookieState);
        }
    }, []);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>;
}
