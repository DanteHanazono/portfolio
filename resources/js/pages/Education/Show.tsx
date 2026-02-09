import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, GraduationCap, MapPin, Calendar, BookOpen, Trash2 } from 'lucide-react';
import * as educationRoutes from '@/routes/education';
import type { Education } from '@/types/portfolio';

interface ShowProps {
    education: Education;
}

export default function Show({ education }: ShowProps) {
    function handleDelete() {
        if (!confirm(`¿Estás seguro de que deseas eliminar la formación "${education.degree}"?`)) {
            return;
        }

        router.delete(educationRoutes.destroy.url({ id: education.id }), {
            onSuccess: () => router.visit(educationRoutes.index.url()),
        });
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
        });
    }

    return (
        <AppLayout>
            <Head title={education.degree} />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={educationRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Detalles de Formación</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={educationRoutes.edit.url({ id: education.id })}>
                                <Edit className="size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="gap-2"
                        >
                            <Trash2 className="size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Institution Card */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 p-8 text-white">
                            <div className="flex items-start gap-6">
                                {education.institution_logo_url ? (
                                    <img
                                        src={education.institution_logo_url}
                                        alt={education.institution}
                                        className="size-24 rounded-xl border-2 border-white/20 bg-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="grid size-24 place-items-center rounded-xl border-2 border-white/20 bg-white/10">
                                        <GraduationCap className="size-12" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black">{education.degree}</h2>
                                    {education.field_of_study && (
                                        <p className="mt-1 flex items-center gap-2 text-white/90">
                                            <BookOpen className="size-4" />
                                            {education.field_of_study}
                                        </p>
                                    )}
                                    <p className="mt-3 text-lg font-semibold">{education.institution}</p>
                                    {education.location && (
                                        <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
                                            <MapPin className="size-4" />
                                            {education.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {formatDate(education.start_date)}
                                        {' - '}
                                        {education.is_current ? (
                                            <Badge variant="outline" className="ml-1 animate-pulse border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                                                Presente
                                            </Badge>
                                        ) : education.end_date ? (
                                            formatDate(education.end_date)
                                        ) : (
                                            'Presente'
                                        )}
                                    </span>
                                </div>
                                {education.period && (
                                    <Badge variant="secondary" className="text-xs">
                                        {education.period}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {education.description && (
                            <div className="p-6">
                                <h3 className="mb-3 font-bold">Descripción</h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {education.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* General Information */}
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                            <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                                <h3 className="font-bold">Información General</h3>
                            </div>
                            <div className="space-y-4 p-6">
                                <div>
                                    <p className="text-xs text-muted-foreground">Título Completo</p>
                                    <p className="mt-1 text-sm font-medium">{education.full_degree || education.degree}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Estado</p>
                                    <p className="mt-1 text-sm font-medium">
                                        {education.is_current ? (
                                            <span className="text-green-600 dark:text-green-400">En curso</span>
                                        ) : (
                                            'Completado'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Orden</p>
                                    <p className="mt-1 text-sm font-medium">#{education.order}</p>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                            <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                                <h3 className="font-bold">Información del Sistema</h3>
                            </div>
                            <div className="space-y-4 p-6">
                                <div>
                                    <p className="text-xs text-muted-foreground">ID</p>
                                    <p className="mt-1 font-mono text-sm">{education.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Creado</p>
                                    <p className="mt-1 text-sm">{new Date(education.created_at).toLocaleString('es-ES')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Última actualización</p>
                                    <p className="mt-1 text-sm">{new Date(education.updated_at).toLocaleString('es-ES')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
