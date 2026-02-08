import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Code2,
    Eye,
    Heart,
    Pencil,
    Plus,
    Search,
    Star,
    Trash2,
    MoreVertical,
    ExternalLink,
    Github,
    Calendar,
    Filter,
    X,
    Layers,
    MessageSquare,
} from 'lucide-react';
import type { PaginatedData, Project, Technology } from '@/types';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as projectsRoutes from '@/routes/projects';

type ProjectsIndexProps = {
    projects: PaginatedData<Project>;
    technologies: Technology[];
    filters: {
        technology?: string;
        status?: string;
        search?: string;
        sort?: string;
        order?: string;
    };
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Borrador', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
    in_progress: { label: 'En progreso', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    completed: { label: 'Completado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
};

export default function Index({ projects, technologies, filters }: ProjectsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleFilter(key: string, value: string | undefined) {
        router.get(
            projectsRoutes.index.url(),
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        handleFilter('search', search || undefined);
    }

    function clearFilters() {
        router.get(projectsRoutes.index.url(), {}, { preserveState: true });
        setSearch('');
    }

    function handleDelete(project: Project) {
        if (confirm(`¿Estás seguro de eliminar "${project.title}"?`)) {
            router.delete(projectsRoutes.destroy.url(project.id), {
                preserveScroll: true,
            });
        }
    }

    function toggleFeatured(project: Project) {
        router.post(
            projectsRoutes.toggleFeatured.url({ project: project.id }),
            {},
            { preserveScroll: true },
        );
    }

    function togglePublished(project: Project) {
        router.post(
            projectsRoutes.togglePublished.url({ project: project.id }),
            {},
            { preserveScroll: true },
        );
    }

    const hasFilters = filters.technology || filters.status || filters.search;

    return (
        <AppLayout>
            <Head title="Proyectos" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Proyectos
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Administra y organiza tus proyectos de portafolio.
                        </p>
                    </div>
                    <Button asChild className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg">
                        <Link href={projectsRoutes.create.url()}>
                            <Plus className="size-4" />
                            Nuevo Proyecto
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <Filter className="size-4" />
                    Filtros
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar proyectos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-xl pl-9"
                            />
                        </div>
                    </form>

                    {/* Status filter */}
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) => handleFilter('status', value)}
                    >
                        <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="in_progress">En progreso</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                            <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Technology filter */}
                    <Select
                        value={filters.technology ?? 'all'}
                        onValueChange={(value) => handleFilter('technology', value)}
                    >
                        <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Tecnología" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {technologies.map((tech) => (
                                <SelectItem key={tech.id} value={String(tech.id)}>
                                    {tech.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasFilters && (
                    <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
                            <X className="size-3.5" />
                            Limpiar filtros
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            {projects.total} {projects.total === 1 ? 'resultado' : 'resultados'}
                        </span>
                    </div>
                )}
            </div>

            {/* Projects grid */}
            {projects.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.data.map((project) => (
                            <div
                                key={project.id}
                                className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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

                                    {/* Badges overlay */}
                                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                                        {project.is_featured && (
                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs text-white">
                                                <Star className="size-3" />
                                            </Badge>
                                        )}
                                        {project.is_published ? (
                                            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 backdrop-blur-sm dark:text-emerald-400">
                                                Publicado
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-gray-500/30 bg-gray-500/10 text-xs text-gray-700 backdrop-blur-sm dark:text-gray-400">
                                                Privado
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Actions menu */}
                                    <div className="absolute right-3 top-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="outline" className="size-8 border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.visit(projectsRoutes.show.url(project.slug))}>
                                                    <Eye className="size-4" />
                                                    Ver
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.visit(projectsRoutes.edit.url(project.id))}>
                                                    <Pencil className="size-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => toggleFeatured(project)}>
                                                    <Star className="size-4" />
                                                    {project.is_featured ? 'Quitar destacado' : 'Destacar'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => togglePublished(project)}>
                                                    <Layers className="size-4" />
                                                    {project.is_published ? 'Despublicar' : 'Publicar'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(project)} className="text-destructive">
                                                    <Trash2 className="size-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="line-clamp-1 text-lg font-bold">{project.title}</h3>
                                        <span className={`inline-flex shrink-0 items-center rounded-lg px-2 py-1 text-xs font-semibold ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}>
                                            {statusConfig[project.status].label}
                                        </span>
                                    </div>

                                    {project.description && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Technologies */}
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {project.technologies?.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech.id}
                                                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                        {(project.technologies?.length ?? 0) > 3 && (
                                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                +{(project.technologies?.length ?? 0) - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats & links */}
                                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="size-3" />
                                                {project.views_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="size-3" />
                                                {project.likes_count}
                                            </span>
                                            {project.testimonials_count !== undefined && project.testimonials_count > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="size-3" />
                                                    {project.testimonials_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {project.demo_url && (
                                                <a
                                                    href={project.demo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex size-7 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
                                                >
                                                    <ExternalLink className="size-3.5" />
                                                </a>
                                            )}
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex size-7 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
                                                >
                                                    <Github className="size-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {projects.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {projects.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                    className={link.active ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white' : ''}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveState
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-2xl border border-border/50 bg-card/50 p-16 text-center backdrop-blur-sm">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50">
                        <Code2 className="size-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold">No se encontraron proyectos</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {hasFilters
                            ? 'Intenta ajustar los filtros para ver más resultados.'
                            : 'Comienza creando tu primer proyecto.'}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        {hasFilters ? (
                            <Button variant="outline" onClick={clearFilters} className="gap-2">
                                <X className="size-4" />
                                Limpiar filtros
                            </Button>
                        ) : (
                            <Button asChild className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white">
                                <Link href={projectsRoutes.create.url()}>
                                    <Plus className="size-4" />
                                    Crear Proyecto
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
