import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Code2,
    MessageSquare,
    Star,
    Eye,
    Heart,
    Mail,
    TrendingUp,
    ExternalLink,
    ArrowUpRight,
    Calendar,
} from 'lucide-react';
import type { BreadcrumbItem, Project, ContactMessage } from '@/types';
import { dashboard } from '@/routes';
import * as projectsRoutes from '@/routes/projects';

type DashboardStats = {
    total_projects: number;
    published_projects: number;
    featured_projects: number;
    total_views: number;
    total_messages: number;
    new_messages: number;
    unread_messages: number;
    total_testimonials: number;
    published_testimonials: number;
};

type MonthlyActivity = {
    month: string;
    projects: number;
};

type PopularProject = {
    id: number;
    title: string;
    views_count: number;
    likes_count: number;
};

type DashboardIndexProps = {
    stats: DashboardStats;
    recentProjects: Project[];
    recentMessages: ContactMessage[];
    popularProjects: PopularProject[];
    monthlyActivity: MonthlyActivity[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
    },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Borrador', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
    in_progress: { label: 'En progreso', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    completed: { label: 'Completado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
};

const messageStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    new: { label: 'Nuevo', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    read: { label: 'Leído', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-500/10' },
    replied: { label: 'Respondido', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
};

export default function Index({
    stats,
    recentProjects,
    recentMessages,
    popularProjects,
    monthlyActivity,
}: DashboardIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                            <Code2 className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.published_projects} publicados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vistas Totales</CardTitle>
                            <Eye className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.featured_projects} proyectos destacados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
                            <Mail className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_messages}</div>
                            <p className="text-xs text-muted-foreground">{stats.new_messages} nuevos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Testimonios</CardTitle>
                            <MessageSquare className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_testimonials}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.published_testimonials} publicados
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Projects */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Proyectos Recientes</CardTitle>
                                    <CardDescription>Últimos 5 proyectos creados</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={projectsRoutes.index.url()}>
                                        Ver todos
                                        <ArrowUpRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProjects.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground">
                                        No hay proyectos aún
                                    </p>
                                ) : (
                                    recentProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex items-start justify-between gap-4 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={projectsRoutes.show.url(project.id)}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                    {project.is_featured && (
                                                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`${statusConfig[project.status]?.bg} ${statusConfig[project.status]?.color}`}
                                                    >
                                                        {statusConfig[project.status]?.label}
                                                    </Badge>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="size-3" />
                                                        {project.views_count || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="size-3" />
                                                        {project.likes_count || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Messages */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Mensajes Recientes</CardTitle>
                                    <CardDescription>Últimos 5 mensajes recibidos</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentMessages.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground">
                                        No hay mensajes aún
                                    </p>
                                ) : (
                                    recentMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className="flex items-start justify-between gap-4 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{message.name}</p>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`${messageStatusConfig[message.status]?.bg} ${messageStatusConfig[message.status]?.color}`}
                                                    >
                                                        {messageStatusConfig[message.status]?.label}
                                                    </Badge>
                                                </div>
                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                    {message.subject || message.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {message.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Popular Projects */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5" />
                                Proyectos Populares
                            </CardTitle>
                            <CardDescription>Más vistos de tu portafolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {popularProjects.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground">
                                        No hay proyectos publicados aún
                                    </p>
                                ) : (
                                    popularProjects.map((project, index) => (
                                        <div
                                            key={project.id}
                                            className="flex items-center justify-between gap-4 rounded-lg border border-border/50 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{project.title}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="size-3" />
                                                            {project.views_count.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="size-3" />
                                                            {project.likes_count.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5" />
                                Actividad Mensual
                            </CardTitle>
                            <CardDescription>Proyectos creados por mes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {monthlyActivity.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                                    >
                                        <span className="text-sm font-medium">{item.month}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{
                                                        width: `${Math.min((item.projects / Math.max(...monthlyActivity.map((m) => m.projects))) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-8 text-right text-sm font-bold text-primary">
                                                {item.projects}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
