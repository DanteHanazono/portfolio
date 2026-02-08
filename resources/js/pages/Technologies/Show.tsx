import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Code2,
    Cpu,
    Edit,
    Eye,
    Folder,
    Heart,
    MessageSquare,
    Star,
    Trash2,
} from 'lucide-react';
import type { PaginatedData, Project, Technology } from '@/types';
import * as technologiesRoutes from '@/routes/technologies';
import * as projectsRoutes from '@/routes/projects';

type TechnologiesShowProps = {
    technology: Technology;
    projects: PaginatedData<Project>;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Borrador', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
    in_progress: { label: 'En progreso', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    completed: { label: 'Completado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
};

export default function Show({ technology, projects }: TechnologiesShowProps) {
    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar "${technology.name}"?`)) {
            router.delete(technologiesRoutes.destroy.url(technology.id), {
                onSuccess: () => router.visit(technologiesRoutes.index.url()),
            });
        }
    }

    function toggleFeatured() {
        router.post(technologiesRoutes.toggleFeatured.url(technology.id), {}, { preserveScroll: true });
    }

    return (
        <AppLayout>
            <Head title={technology.name} />

            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex items-start gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={technologiesRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                            {technology.is_featured && (
                                <Badge className="gap-1.5 bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white">
                                    <Star className="size-3" />
                                    Destacada
                                </Badge>
                            )}
                            {technology.type && (
                                <Badge variant="outline">{technology.type}</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">{technology.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {projects.total} {projects.total === 1 ? 'proyecto' : 'proyectos'} utilizando esta tecnología
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFeatured}
                        >
                            <Star className={`size-4 ${technology.is_featured ? 'fill-current text-violet-500' : ''}`} />
                        </Button>
                        <Button asChild variant="outline" size="icon">
                            <Link href={technologiesRoutes.edit.url(technology.id)}>
                                <Edit className="size-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDelete}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Technology Info Card */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-6 p-8">
                        <div
                            className="flex size-24 shrink-0 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: (technology.color || '#10B981') + '20' }}
                        >
                            <Cpu className="size-12" style={{ color: technology.color || '#10B981' }} />
                        </div>
                        <div className="flex-1">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                    <p className="mt-1 font-mono text-sm">{technology.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Color</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div
                                            className="size-5 rounded border border-border/50"
                                            style={{ backgroundColor: technology.color || '#10B981' }}
                                        />
                                        <span className="font-mono text-sm">{technology.color || '#10B981'}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Orden</p>
                                    <p className="mt-1 text-sm">{technology.order}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                                    <p className="mt-1 text-sm">
                                        {technology.is_featured ? 'Destacada' : 'Normal'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Proyectos que usan {technology.name}</h2>
                    </div>

                    {projects.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {projects.data.map((project) => {
                                    const status = statusConfig[project.status] || statusConfig.draft;
                                    return (
                                        <div
                                            key={project.id}
                                            className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-2xl"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-video overflow-hidden">
                                                {project.featured_image_url ? (
                                                    <img
                                                        src={project.featured_image_url}
                                                        alt={project.title}
                                                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                                        <Code2 className="size-12 text-muted-foreground/30" />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className="absolute right-3 top-3">
                                                    <Badge className={`${status.bg} ${status.color}`}>
                                                        {status.label}
                                                    </Badge>
                                                </div>

                                                {/* Featured Badge */}
                                                {project.is_featured && (
                                                    <div className="absolute left-3 top-3">
                                                        <Badge className="gap-1.5 bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white">
                                                            <Star className="size-3" />
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="mb-2 font-bold">{project.title}</h3>
                                                {project.description && (
                                                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                                        {project.description}
                                                    </p>
                                                )}

                                                {/* Stats */}
                                                <div className="mb-4 flex gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="size-3" />
                                                        {project.views_count}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="size-3" />
                                                        {project.likes_count}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                                                        <Link href={projectsRoutes.show.url(project.id)}>
                                                            <Eye className="size-4" />
                                                            Ver
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                                                        <Link href={projectsRoutes.edit.url(project.id)}>
                                                            <Edit className="size-4" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {projects.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Mostrando {projects.from} - {projects.to} de {projects.total} proyectos
                                    </p>
                                    <div className="flex gap-2">
                                        {projects.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-2xl border border-border/50 bg-card/50 py-20 text-center backdrop-blur-sm">
                            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50">
                                <Folder className="size-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold">Sin proyectos asociados</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Esta tecnología aún no está asociada a ningún proyecto.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
