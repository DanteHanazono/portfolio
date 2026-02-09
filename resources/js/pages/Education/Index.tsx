import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, GraduationCap, MapPin, Plus, Trash2, Eye, Edit } from 'lucide-react';
import type { Education } from '@/types';
import * as educationRoutes from '@/routes/education';

type EducationIndexProps = {
    education: Education[];
};

export default function Index({ education }: EducationIndexProps) {
    function handleDelete(item: Education) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta formación?')) {
            return;
        }

        router.delete(educationRoutes.destroy.url(item.id), {
            preserveScroll: true,
        });
    }

    function formatDate(date: string | null): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', { year: 'numeric' });
    }

    return (
        <AppLayout>
            <Head title="Educación" />

            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 text-white shadow-lg">
                        <GraduationCap className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Educación</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Gestiona tu formación académica y certificaciones
                        </p>
                    </div>
                </div>
                <Button asChild className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25">
                    <Link href={educationRoutes.create.url()}>
                        <Plus className="size-4" />
                        Agregar Formación
                    </Link>
                </Button>
            </div>

            {/* Education List */}
            {education.length === 0 ? (
                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 backdrop-blur-sm">
                    <div className="text-center">
                        <GraduationCap className="mx-auto size-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No hay formación registrada</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Comienza agregando tu primera formación académica
                        </p>
                        <Button asChild className="mt-6 gap-2 bg-gradient-to-r from-violet-600 to-blue-600">
                            <Link href={educationRoutes.create.url()}>
                                <Plus className="size-4" />
                                Agregar Formación
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {education.map((item) => (
                        <div
                            key={item.id}
                            className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-violet-500/10"
                        >
                            <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-start lg:justify-between">
                                {/* Left Section - Institution Info */}
                                <div className="flex flex-1 gap-4">
                                    {/* Institution Logo */}
                                    <div className="shrink-0">
                                        {item.institution_logo_url ? (
                                            <img
                                                src={item.institution_logo_url}
                                                alt={item.institution}
                                                className="size-16 rounded-xl border border-border/50 object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-16 items-center justify-center rounded-xl border border-border/50 bg-muted/50">
                                                <GraduationCap className="size-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-bold">{item.degree}</h3>
                                                {item.is_current && (
                                                    <Badge className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                        <span className="relative flex size-2">
                                                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                                                        </span>
                                                        En curso
                                                    </Badge>
                                                )}
                                            </div>
                                            {item.field_of_study && (
                                                <p className="mt-1 text-sm text-muted-foreground">en {item.field_of_study}</p>
                                            )}
                                            <p className="mt-1 font-semibold text-muted-foreground">{item.institution}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            {item.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3.5" />
                                                    {item.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3.5" />
                                                {formatDate(item.start_date)} -{' '}
                                                {item.is_current ? 'Presente' : formatDate(item.end_date)}
                                            </span>
                                        </div>

                                        {item.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section - Actions */}
                                <div className="flex gap-2 lg:flex-col">
                                    <Button asChild variant="outline" size="sm" className="flex-1 gap-2 lg:flex-none">
                                        <Link href={educationRoutes.show.url(item.id)}>
                                            <Eye className="size-4" />
                                            Ver
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="sm" className="flex-1 gap-2 lg:flex-none">
                                        <Link href={educationRoutes.edit.url(item.id)}>
                                            <Edit className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(item)}
                                        className="flex-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive lg:flex-none"
                                    >
                                        <Trash2 className="size-4" />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
