import { Link } from '@inertiajs/react';
import { Award, BookOpen, Briefcase, Code2, Cpu, Folder, GraduationCap, Globe, LayoutGrid, MessageSquare, Zap } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import * as certificationsRoutes from '@/routes/certifications';
import * as educationRoutes from '@/routes/education';
import * as experiencesRoutes from '@/routes/experiences';
import * as projectsRoutes from '@/routes/projects';
import * as skillsRoutes from '@/routes/skills';
import * as technologiesRoutes from '@/routes/technologies';
import * as testimonialsRoutes from '@/routes/testimonials';
import type { NavItem } from '@/types';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Proyectos',
        href: projectsRoutes.index.url(),
        icon: Code2,
    },
    {
        title: 'Tecnologías',
        href: technologiesRoutes.index.url(),
        icon: Cpu,
    },
    {
        title: 'Experiencia',
        href: experiencesRoutes.index.url(),
        icon: Briefcase,
    },
    {
        title: 'Educación',
        href: educationRoutes.index.url(),
        icon: GraduationCap,
    },
    {
        title: 'Habilidades',
        href: skillsRoutes.index.url(),
        icon: Zap,
    },
    {
        title: 'Certificaciones',
        href: certificationsRoutes.index.url(),
        icon: Award,
    },
    {
        title: 'Testimonios',
        href: testimonialsRoutes.index.url(),
        icon: MessageSquare,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Ver Portafolio',
//         href: '/',
//         icon: Globe,
//     },
//     {
//         title: 'Documentación',
//         href: 'https://laravel.com/docs',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-border/50">
            <SidebarHeader className="border-b border-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href={dashboard()}
                            prefetch
                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-muted/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                        >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
                                <AppLogoIcon className="size-6 fill-current text-white" />
                            </div>
                            <div className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                                <p className="text-sm font-bold">Portfolio</p>
                                <p className="text-xs text-muted-foreground">Dashboard</p>
                            </div>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50">
                {/* <NavFooter items={footerNavItems} className="mt-0" /> */}
                <div className="px-3 pb-3">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
