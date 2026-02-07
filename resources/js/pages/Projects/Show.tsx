import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Calendar,
    Code2,
    Edit,
    ExternalLink,
    Eye,
    Github,
    Globe,
    Heart,
    Layers,
    MessageSquare,
    Play,
    Star,
    Trash2,
    User,
} from 'lucide-react';
import type { Project } from '@/types';
import * as projectsRoutes from '@/routes/projects';

type ProjectsShowProps = {
    project: Project;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Borrador', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
    in_progress: { label: 'En progreso', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    completed: { label: 'Completado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
};

export default function Show({ project }: ProjectsShowProps) {
    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar "${project.title}"?`)) {
            router.delete(projectsRoutes.destroy.url(project.id), {
                onSuccess: () => router.visit(projectsRoutes.index.url()),
            });
        }
    }

    function toggleFeatured() {
        router.post(projectsRoutes.toggleFeatured.url(project.id), {}, { preserveScroll: true });
    }

    function togglePublished() {
        router.post(projectsRoutes.togglePublished.url(project.id), {}, { preserveScroll: true });
    }

    return (
        <AppLayout>
            <Head title={project.title} />

            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
                    <Link href={projectsRoutes.index.url()}>
                        <ArrowLeft className="size-4" />
                        Volver a proyectos
                    </Link>
                </Button>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 text-white shadow-lg">
                            <Code2 className="size-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${statusConfig[project.status].bg} ${statusConfig[project.status].color}`}>
                                    {statusConfig[project.status].label}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{project.slug}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                {project.is_featured && (
                                    <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                        <Star className="size-3" />
                                        Destacado
                                    </Badge>
                                )}
                                {project.is_published ? (
                                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                        Publicado
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                        Privado
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" onClick={toggleFeatured} className="gap-2">
                            <Star className="size-4" />
                            {project.is_featured ? 'Quitar destacado' : 'Destacar'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={togglePublished} className="gap-2">
                            <Layers className="size-4" />
                            {project.is_published ? 'Despublicar' : 'Publicar'}
                        </Button>
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <Link href={projectsRoutes.edit.url(project.id)}>
                                <Edit className="size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
                            <Trash2 className="size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Eye className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{project.views_count}</p>
                            <p className="text-xs text-muted-foreground">Vistas</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                            <Heart className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{project.likes_count}</p>
                            <p className="text-xs text-muted-foreground">Me gusta</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            <Code2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{project.technologies?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Tecnologías</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <MessageSquare className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{project.testimonials_count ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Testimonios</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Featured Image */}
                    {project.featured_image && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
                            <img
                                src={`/storage/${project.featured_image}`}
                                alt={project.title}
                                className="aspect-video w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Description */}
                    {project.description && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Descripción</h2>
                            <p className="leading-relaxed text-muted-foreground">{project.description}</p>
                        </div>
                    )}

                    {/* Content */}
                    {project.content && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Detalles del Proyecto</h2>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{project.content}</p>
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Galería</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {project.gallery.map((image, index) => (
                                    <div key={index} className="group relative aspect-video overflow-hidden rounded-xl border border-border/50">
                                        <img src={`/storage/${image}`} alt={`Gallery ${index + 1}`} className="size-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {project.features && project.features.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Características</h2>
                            <div className="space-y-3">
                                {project.features.map((feature) => (
                                    <div key={feature.id} className="flex items-start gap-3 rounded-xl border border-border/50 bg-background/50 p-4">
                                        <div className="mt-0.5 size-5 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
                                        <div className="flex-1">
                                            <h3 className="font-bold">{feature.title}</h3>
                                            {feature.description && <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Testimonials */}
                    {project.testimonials && project.testimonials.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Testimonios</h2>
                            <div className="space-y-4">
                                {project.testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="rounded-xl border border-border/50 bg-background/50 p-5">
                                        <p className="italic leading-relaxed text-muted-foreground">"{testimonial.content}"</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            {testimonial.avatar ? (
                                                <img src={`/storage/${testimonial.avatar}`} alt={testimonial.name} className="size-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold">{testimonial.name}</p>
                                                {testimonial.position && <p className="text-xs text-muted-foreground">{testimonial.position}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Links */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                        <h2 className="mb-4 text-lg font-bold">Enlaces</h2>
                        <div className="space-y-2">
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:border-border hover:bg-background"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                                        <ExternalLink className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Ver Demo</p>
                                        <p className="truncate text-xs text-muted-foreground">{project.demo_url}</p>
                                    </div>
                                </a>
                            )}

                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:border-border hover:bg-background"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 text-white">
                                        <Github className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Repositorio</p>
                                        <p className="truncate text-xs text-muted-foreground">{project.github_url}</p>
                                    </div>
                                </a>
                            )}

                            {project.video_url && (
                                <a
                                    href={project.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:border-border hover:bg-background"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white">
                                        <Play className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Video</p>
                                        <p className="truncate text-xs text-muted-foreground">{project.video_url}</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Tecnologías</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <Badge key={tech.id} variant="outline" className="text-xs">
                                        {tech.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Client Info */}
                    {(project.client_name || project.client_website) && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Cliente</h2>
                            <div className="space-y-3">
                                {project.client_name && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <User className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Nombre</p>
                                            <p className="font-medium">{project.client_name}</p>
                                        </div>
                                    </div>
                                )}
                                {project.client_website && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <Globe className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs text-muted-foreground">Sitio web</p>
                                            <a
                                                href={project.client_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate font-medium text-violet-600 hover:underline dark:text-violet-400"
                                            >
                                                {project.client_website}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    {(project.start_date || project.end_date || project.duration) && (
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                            <h2 className="mb-4 text-lg font-bold">Fechas</h2>
                            <div className="space-y-3">
                                {project.start_date && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <Calendar className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Inicio</p>
                                            <p className="font-medium">{new Date(project.start_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                                        </div>
                                    </div>
                                )}
                                {project.end_date && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                                            <Calendar className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Finalización</p>
                                            <p className="font-medium">{new Date(project.end_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                                        </div>
                                    </div>
                                )}
                                {project.duration && (
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground">Duración</p>
                                        <p className="font-bold text-violet-600 dark:text-violet-400">{project.duration}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                        <h2 className="mb-4 text-lg font-bold">Metadatos</h2>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Creado:</span>
                                <span className="font-medium">{new Date(project.created_at).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Actualizado:</span>
                                <span className="font-medium">{new Date(project.updated_at).toLocaleDateString('es-ES')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Orden:</span>
                                <span className="font-medium">{project.order}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
