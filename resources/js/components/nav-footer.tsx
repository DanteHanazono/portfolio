import type { ComponentPropsWithoutRef } from 'react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={className}
        >
            <SidebarGroupContent className="px-3">
                <div className="mb-3 rounded-xl border border-border/50 bg-muted/20 p-3 backdrop-blur-sm group-data-[collapsible=icon]:mb-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
                    <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:space-y-2">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <a
                                    href={toUrl(item.href)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-2"
                                    title={item.title}
                                >
                                    {item.icon && (
                                        <item.icon className="size-4 shrink-0 transition-transform duration-200 hover:scale-110" />
                                    )}
                                    <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </a>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
