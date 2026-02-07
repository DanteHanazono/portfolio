import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
                Navegación
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:space-y-2">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <Link
                                href={item.href}
                                prefetch
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-2.5 ${isActive
                                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                    }`}
                            >
                                {item.icon && (
                                    <item.icon
                                        className="size-5 shrink-0 transition-transform duration-200"
                                    />
                                )}
                                <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                {isActive && (
                                    <div className="size-1.5 shrink-0 rounded-full bg-white group-data-[collapsible=icon]:hidden" />
                                )}
                            </Link>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
