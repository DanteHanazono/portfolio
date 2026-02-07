import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { portfolio as portfolioAction } from '@/actions/App/Http/Controllers/HomeController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code2, ExternalLink, Github, MessageSquare, X, Layers, Search } from 'lucide-react';
import type { Project, Technology, PaginatedData } from '@/types';

type PortfolioProps = {
    projects: PaginatedData<Project>;
    technologies: Technology[];
    filters: {
        category?: string;
        technology?: string;
    };
};

export default function Portfolio({ projects, technologies, filters }: PortfolioProps) {
    function handleTechnologyFilter(value: string) {
        router.get(
            portfolioAction().url,
            { technology: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    }

    function clearFilters() {
        router.get(portfolioAction().url, {}, { preserveState: true });
    }

    const hasActiveFilters = filters.technology;

    return (
        <PublicLayout>
            <Head title="Portafolio" />

            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                    <div className="absolute -right-32 -top-32 size-[400px] animate-float rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 size-[350px] animate-float-delayed rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
                            <Layers className="size-3" />
                            Portafolio
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Mis{' '}
                            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400">
                                Proyectos
                            </span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            Explora mis proyectos y descubre las soluciones que he desarrollado.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Search className="size-4" />
                        Filtrar:
                    </div>
                    <div className="w-full sm:w-64">
                        <Select
                            value={filters.technology ?? 'all'}
                            onValueChange={handleTechnologyFilter}
                        >
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Filtrar por tecnología" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las tecnologías</SelectItem>
                                {technologies.map((tech) => (
                                    <SelectItem key={tech.id} value={String(tech.id)}>
                                        {tech.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
                            <X className="size-3.5" />
                            Limpiar
                        </Button>
                    )}

                    <span className="ml-auto rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {projects.total} {projects.total === 1 ? 'proyecto' : 'proyectos'}
                    </span>
                </div>

                {/* Projects Grid */}
                {projects.data.length > 0 ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.data.map((project) => (
                            <div key={project.id} className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-2xl">
                                {/* Image with overlay */}
                                <div className="relative aspect-video overflow-hidden">
                                    {project.featured_image ? (
                                        <img
                                            src={project.featured_image}
                                            alt={project.title}
                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                            <Code2 className="size-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Status badge */}
                                    <div className="absolute right-3 top-3">
                                        <Badge variant="outline" className="border-white/20 bg-black/30 text-xs capitalize text-white backdrop-blur-sm">
                                            {project.status}
                                        </Badge>
                                    </div>

                                    {/* Hover content */}
                                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-end p-5 transition-transform duration-500 group-hover:translate-y-0">
                                        <div className="flex gap-2">
                                            {project.demo_url && (
                                                <a
                                                    href={project.demo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                                >
                                                    <ExternalLink className="size-3" />
                                                    Demo en vivo
                                                </a>
                                            )}
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                                >
                                                    <Github className="size-3" />
                                                    Código
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-lg font-bold">{project.title}</h3>
                                        {project.testimonials_count !== undefined && project.testimonials_count > 0 && (
                                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                <MessageSquare className="size-3" />
                                                {project.testimonials_count}
                                            </span>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {project.technologies?.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech.id}
                                                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                        {(project.technologies?.length ?? 0) > 4 && (
                                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                +{(project.technologies?.length ?? 0) - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-20 text-center">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50">
                            <Code2 className="size-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">No se encontraron proyectos</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Intenta ajustar los filtros para ver más resultados.
                        </p>
                        {hasActiveFilters && (
                            <Button variant="outline" className="mt-6 gap-2" onClick={clearFilters}>
                                <X className="size-4" />
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {projects.last_page > 1 && (
                    <div className="mt-14 flex items-center justify-center gap-2">
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
            </div>
        </PublicLayout>
    );
}
