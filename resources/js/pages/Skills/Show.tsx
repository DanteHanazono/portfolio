import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Star, Trash2, Zap } from 'lucide-react';
import * as skillsRoutes from '@/routes/skills';
import type { Skill } from '@/types/portfolio';

interface ShowProps {
    skill: Skill;
}

export default function Show({ skill }: ShowProps) {
    function handleDelete() {
        if (!confirm(`¿Estás seguro de que deseas eliminar "${skill.name}"?`)) {
            return;
        }

        router.delete(skillsRoutes.destroy.url({ id: skill.id }), {
            onSuccess: () => router.visit(skillsRoutes.index.url()),
        });
    }

    const categoryGradients: Record<string, string> = {
        Frontend: 'from-blue-500 to-cyan-500',
        Backend: 'from-emerald-500 to-teal-500',
        DevOps: 'from-orange-500 to-amber-500',
        Database: 'from-violet-500 to-purple-500',
        Mobile: 'from-pink-500 to-rose-500',
        Tools: 'from-yellow-500 to-orange-500',
    };

    const gradient = categoryGradients[skill.category] || 'from-violet-600 to-blue-600';

    return (
        <AppLayout>
            <Head title={skill.name} />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={skillsRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Detalles de Habilidad</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={skillsRoutes.edit.url({ id: skill.id })}>
                                <Edit className="size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="gap-2">
                            <Trash2 className="size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Skill Card */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className={`border-b border-border/50 bg-gradient-to-r ${gradient} p-8 text-white`}>
                            <div className="flex items-start gap-6">
                                {skill.icon ? (
                                    <div className="grid size-24 place-items-center rounded-xl border-2 border-white/20 bg-white/10 text-5xl">
                                        {skill.icon}
                                    </div>
                                ) : (
                                    <div className="grid size-24 place-items-center rounded-xl border-2 border-white/20 bg-white/10">
                                        <Zap className="size-12" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black">{skill.name}</h2>
                                        {skill.is_highlighted && (
                                            <Badge className="gap-1 border-white/20 bg-yellow-500/20 text-white">
                                                <Star className="size-3 fill-current" />
                                                Destacada
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="mt-2 text-lg font-semibold text-white/90">{skill.category}</p>
                                    {skill.years_experience !== null && skill.years_experience > 0 && (
                                        <p className="mt-2 text-sm text-white/80">
                                            {skill.years_experience} {skill.years_experience === 1 ? 'año' : 'años'} de experiencia
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                    <p className="text-xs text-muted-foreground">Nombre</p>
                                    <p className="mt-1 text-sm font-medium">{skill.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Categoría</p>
                                    <p className="mt-1 text-sm font-medium">{skill.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Ícono</p>
                                    <p className="mt-1 text-2xl">{skill.icon || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Años de Experiencia</p>
                                    <p className="mt-1 text-sm font-medium">
                                        {skill.years_experience !== null && skill.years_experience > 0
                                            ? `${skill.years_experience} ${skill.years_experience === 1 ? 'año' : 'años'}`
                                            : 'No especificado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Estado</p>
                                    <p className="mt-1 text-sm font-medium">
                                        {skill.is_highlighted ? (
                                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                                <Star className="size-3 fill-current" />
                                                Destacada
                                            </span>
                                        ) : (
                                            'Normal'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Orden</p>
                                    <p className="mt-1 text-sm font-medium">#{skill.order}</p>
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
                                    <p className="mt-1 font-mono text-sm">{skill.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Creado</p>
                                    <p className="mt-1 text-sm">{new Date(skill.created_at).toLocaleString('es-ES')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Última actualización</p>
                                    <p className="mt-1 text-sm">{new Date(skill.updated_at).toLocaleString('es-ES')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
