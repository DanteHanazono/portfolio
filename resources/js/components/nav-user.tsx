import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SharedData } from '@/types';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex w-full items-center gap-3 overflow-hidden rounded-xl border border-border/50 bg-card/50 px-3 py-2.5 text-left transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md backdrop-blur-sm group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-2.5"
                            data-test="sidebar-menu-button"
                        >
                            <div className="flex min-w-0 flex-1 items-center gap-3 group-data-[collapsible=icon]:hidden">
                                <UserInfo user={auth.user} />
                            </div>
                            <div className="hidden shrink-0 group-data-[collapsible=icon]:flex">
                                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600">
                                    <span className="text-sm font-bold text-white">
                                        {auth.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                                    </span>
                                </div>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 hover:scale-110 group-data-[collapsible=icon]:hidden" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl border-border/50 bg-card/95 backdrop-blur-sm"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                    ? 'left'
                                    : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
