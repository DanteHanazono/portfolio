import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Edit,
    ExternalLink,
    MapPin,
    Target,
    Trophy,
    Trash2,
} from 'lucide-react';
import type { Experience } from '@/types';
import * as experiencesRoutes from '@/routes/experiences';

type ExperiencesShowProps = {
    experience: Experience;
};

export default function Show({ experience }: ExperiencesShowProps) {
    function handleDelete() {
        if (!confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
            return;
        }

        router.delete(experiencesRoutes.destroy.url(experience.id), {
            onSuccess: () => router.visit(experiencesRoutes.index.url()),
        });
    }

    function formatDate(date: string | null): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }

    return (
        <AppLayout>
            <Head title={experience.title} />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-4">
                        <Button asChild variant="outline" size="icon" className="shrink-0">
                            <Link href={experiencesRoutes.index.url()}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">{experience.title}</h1>
                                {experience.is_current && (
                                    <Badge className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                        <span className="relative flex size-2">
                                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                        </span>
                                        Actual
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Detalles de la experiencia laboral</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="gap-2">
                            <Link href={experiencesRoutes.edit.url(experience.id)}>
                                <Edit className="size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-2 text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Company Information */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                        <h2 className="font-bold">Información de la Empresa</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-6">
                            {/* Company Logo */}
                            {experience.company_logo_url ? (
                                <img
                                    src={experience.company_logo_url}
                                    alt={experience.company}
                                    className="size-24 rounded-xl border border-border/50 object-cover"
                                />
                            ) : (
                                <div className="flex size-24 items-center justify-center rounded-xl border border-border/50 bg-muted/50">
                                    <Building2 className="size-12 text-muted-foreground" />
                                </div>
                            )}

                            {/* Company Details */}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold">{experience.company}</h3>
                                        {experience.company_url && (
                                            <a
                                                href={experience.company_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 transition-colors hover:text-violet-700"
                                            >
                                                <ExternalLink className="size-5" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="mt-1 text-lg text-muted-foreground">{experience.title}</p>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                    {experience.employment_type && (
                                        <Badge variant="outline" className="gap-1.5">
                                            {experience.employment_type}
                                        </Badge>
                                    )}
                                    {experience.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-4" />
                                            {experience.location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="size-4" />
                                        {formatDate(experience.start_date)} -{' '}
                                        {experience.is_current ? 'Presente' : formatDate(experience.end_date)}
                                    </span>
                                    {experience.duration && (
                                        <span className="font-medium text-muted-foreground">• {experience.duration}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {experience.description && (
                            <div className="mt-6 rounded-lg bg-muted/30 p-4">
                                <p className="text-sm leading-relaxed">{experience.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Responsibilities */}
                {experience.responsibilities && experience.responsibilities.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Target className="size-5 text-violet-600" />
                                <h2 className="font-bold">Responsabilidades</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {experience.responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex gap-3 text-sm">
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-600" />
                                        <span className="flex-1 leading-relaxed">{responsibility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {experience.achievements && experience.achievements.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="size-5 text-amber-600" />
                                <h2 className="font-bold">Logros</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {experience.achievements.map((achievement, index) => (
                                    <li key={index} className="flex gap-3 text-sm">
                                        <Trophy className="mt-0.5 size-4 shrink-0 text-amber-600" />
                                        <span className="flex-1 leading-relaxed">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                        <h2 className="font-bold">Información del Sistema</h2>
                    </div>
                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Creado</p>
                            <p className="mt-1 text-sm font-medium">
                                {new Date(experience.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Última actualización</p>
                            <p className="mt-1 text-sm font-medium">
                                {new Date(experience.updated_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Orden</p>
                            <p className="mt-1 text-sm font-medium">{experience.order}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
