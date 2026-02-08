import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Calendar,
    Code2,
    ExternalLink,
    Eye,
    Github,
    Globe,
    Heart,
    Layers,
    MessageSquare,
    Play,
    Star,
    User,
    Users,
    Clock,
} from 'lucide-react';
import type { Project } from '@/types';

type ProjectDetailProps = {
    project: Project;
    relatedProjects: Project[];
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Borrador', color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-500/10' },
    in_progress: { label: 'En progreso', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' },
    completed: { label: 'Completado', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    archived: { label: 'Archivado', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10' },
};

export default function ProjectDetail({ project, relatedProjects }: ProjectDetailProps) {
    function handleLike() {
        router.post(`/project/${project.slug}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Visual feedback
            },
        });
    }

    const status = statusConfig[project.status] || statusConfig.draft;

    return (
        <PublicLayout>
            <Head title={project.title}>
                {project.description && <meta name="description" content={project.description} />}
            </Head>

            {/* Back button */}
            <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    Volver al inicio
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute right-0 top-0 size-[600px] rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                    <div className="absolute -left-32 bottom-0 size-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Project Info */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-6 flex flex-wrap items-center gap-3">
                                <Badge className={`${status.bg} ${status.color}`}>{status.label}</Badge>
                                {project.is_featured && (
                                    <Badge className="gap-1.5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-400">
                                        <Star className="size-3" />
                                        Destacado
                                    </Badge>
                                )}
                            </div>

                            <h1 className="mb-6 text-4xl font-black tracking-tight lg:text-5xl">
                                {project.title}
                            </h1>

                            <p className="mb-8 text-lg text-muted-foreground">
                                {project.description}
                            </p>

                            {/* Meta info */}
                            <div className="mb-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                                {project.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4" />
                                        <span>{project.duration}</span>
                                    </div>
                                )}
                                {project.team_size && (
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4" />
                                        <span>{project.team_size} miembros</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Eye className="size-4" />
                                    <span>{project.views_count} vistas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="size-4" />
                                    <span>{project.likes_count} likes</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={handleLike}
                                    size="lg"
                                    className="group gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl hover:shadow-pink-500/40"
                                >
                                    <Heart className="size-5 transition-transform group-hover:scale-110" />
                                    Me gusta
                                </Button>

                                {project.demo_url && (
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                                    >
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="size-5" />
                                            Ver Demo
                                        </a>
                                    </Button>
                                )}

                                {project.github_url && (
                                    <Button asChild variant="outline" size="lg" className="gap-2">
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="size-5" />
                                            Ver Código
                                        </a>
                                    </Button>
                                )}

                                {project.client_url && (
                                    <Button asChild variant="outline" size="lg" className="gap-2">
                                        <a href={project.client_url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="size-5" />
                                            Visitar Sitio
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {/* Technologies */}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Tecnologías utilizadas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech) => (
                                            <Badge
                                                key={tech.id}
                                                variant="outline"
                                                className="gap-2 border-border/50 bg-card/50 backdrop-blur-sm"
                                            >
                                                {tech.icon_class && <Code2 className="size-3" />}
                                                {tech.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Featured Image */}
                        <div className="relative">
                            {project.featured_image_url ? (
                                <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl">
                                    <img
                                        src={project.featured_image_url}
                                        alt={project.title}
                                        className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            ) : (
                                <div className="flex aspect-video items-center justify-center rounded-3xl border border-border/50 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                    <Code2 className="size-20 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            {project.content && (
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm lg:p-12">
                        <h2 className="mb-6 text-2xl font-bold">Acerca del proyecto</h2>
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: project.content }}
                        />
                    </div>
                </section>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-black tracking-tight lg:text-4xl">
                        Características Principales
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {project.features.map((feature) => (
                            <div
                                key={feature.id}
                                className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-border hover:shadow-xl"
                            >
                                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-3">
                                    <Layers className="size-6 text-violet-600 dark:text-violet-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Gallery */}
            {project.gallery_urls && project.gallery_urls.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-black tracking-tight lg:text-4xl">
                        Galería
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {project.gallery_urls.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="group relative aspect-video overflow-hidden rounded-2xl border border-border/50 bg-card"
                            >
                                <img
                                    src={imageUrl}
                                    alt={`${project.title} - Imagen ${index + 1}`}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {project.published_testimonials && project.published_testimonials.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-black tracking-tight lg:text-4xl">
                        Testimonios
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {project.published_testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm"
                            >
                                <MessageSquare className="mb-4 size-8 text-violet-500/30" />
                                <p className="mb-6 text-lg italic leading-relaxed text-muted-foreground">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                                        <User className="size-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.client_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.client_position}
                                            {testimonial.client_company && ` - ${testimonial.client_company}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="mx-auto mb-16 max-w-7xl px-6 py-16 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-black tracking-tight lg:text-4xl">
                        Proyectos Relacionados
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedProjects.map((relatedProject) => (
                            <Link
                                key={relatedProject.id}
                                href={`/project/${relatedProject.slug}`}
                                className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-2xl"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    {relatedProject.featured_image_url ? (
                                        <img
                                            src={relatedProject.featured_image_url}
                                            alt={relatedProject.title}
                                            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                            <Code2 className="size-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 font-bold transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                        {relatedProject.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {relatedProject.description}
                                    </p>
                                    {relatedProject.technologies && relatedProject.technologies.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {relatedProject.technologies.slice(0, 3).map((tech) => (
                                                <Badge
                                                    key={tech.id}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {tech.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
