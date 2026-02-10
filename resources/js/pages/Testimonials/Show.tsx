import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Star,
    User,
    Briefcase,
    Building2,
    Calendar,
    Hash,
    MessageSquare,
    Code2,
} from 'lucide-react';
import type { Testimonial } from '@/types';
import { router } from '@inertiajs/react';
import * as testimonialsRoutes from '@/routes/testimonials';

type TestimonialsShowProps = {
    testimonial: Testimonial;
};

export default function Show({ testimonial }: TestimonialsShowProps) {
    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar el testimonio de "${testimonial.client_name}"?`)) {
            router.delete(testimonialsRoutes.destroy.url(testimonial.id));
        }
    }

    function toggleFeatured() {
        router.post(
            testimonialsRoutes.toggleFeatured.url({ testimonial: testimonial.id }),
            {},
            { preserveScroll: true },
        );
    }

    function togglePublished() {
        router.post(
            testimonialsRoutes.togglePublished.url({ testimonial: testimonial.id }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <AppLayout>
            <Head title={`Testimonio: ${testimonial.client_name}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={testimonialsRoutes.index.url()}>
                                <ArrowLeft className="mr-2 size-4" />
                                Volver
                            </Link>
                        </Button>
                        <div>
                            <h1 className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                                Testimonio
                            </h1>
                            <p className="text-sm text-muted-foreground">{testimonial.client_name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={testimonialsRoutes.edit.url(testimonial.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm">
                    <div className="flex flex-col items-start gap-8 md:flex-row">
                        {/* Avatar */}
                        {testimonial.client_avatar ? (
                            <img
                                src={`/storage/${testimonial.client_avatar}`}
                                alt={testimonial.client_name}
                                className="size-32 rounded-full object-cover ring-4 ring-border/50"
                            />
                        ) : (
                            <div className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-2xl">
                                <User className="size-16 text-white" />
                            </div>
                        )}

                        {/* Client Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <h2 className="text-2xl font-bold">{testimonial.client_name}</h2>
                                    {testimonial.is_featured && (
                                        <Badge className="border-0 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                            <Star className="mr-1 size-3" />
                                            Destacado
                                        </Badge>
                                    )}
                                    {testimonial.is_published ? (
                                        <Badge className="border-0 bg-green-500/10 text-green-700 dark:text-green-400">
                                            Publicado
                                        </Badge>
                                    ) : (
                                        <Badge className="border-0 bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                            Borrador
                                        </Badge>
                                    )}
                                </div>

                                {testimonial.client_position && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Briefcase className="size-4" />
                                        <span>{testimonial.client_position}</span>
                                    </div>
                                )}

                                {testimonial.client_company && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="size-4" />
                                        <span>{testimonial.client_company}</span>
                                    </div>
                                )}

                                {testimonial.project && (
                                    <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                                        <Code2 className="size-4" />
                                        <span>
                                            Proyecto:{' '}
                                            <span className="font-medium text-foreground">
                                                {testimonial.project.title}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            {testimonial.rating && (
                                <div>
                                    <div className="mb-2 text-sm font-medium text-muted-foreground">Calificación</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`size-6 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold">{testimonial.rating}/5</span>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={toggleFeatured}>
                                    <Star className="mr-2 size-3" />
                                    {testimonial.is_featured ? 'Quitar destacado' : 'Destacar'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={togglePublished}>
                                    <MessageSquare className="mr-2 size-3" />
                                    {testimonial.is_published ? 'Despublicar' : 'Publicar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Content */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-semibold">Testimonio</h3>
                    <blockquote className="border-l-4 border-violet-600 pl-6 italic text-muted-foreground">
                        "{testimonial.content}"
                    </blockquote>
                </div>

                {/* Metadata */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Order */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Hash className="size-4" />
                            Orden
                        </div>
                        <div className="text-2xl font-bold">{testimonial.order}</div>
                    </div>

                    {/* Created */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            Creado
                        </div>
                        <div className="text-sm font-medium">
                            {new Date(testimonial.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>

                    {/* Updated */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            Actualizado
                        </div>
                        <div className="text-sm font-medium">
                            {new Date(testimonial.updated_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
