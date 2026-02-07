import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Zap, Cpu, Star } from 'lucide-react';
import type { Skill, Technology } from '@/types';

type SkillsProps = {
    skills: Skill[];
    groupedSkills: Record<string, Skill[]>;
    technologies: Technology[];
};

const categoryConfig: Record<string, { gradient: string; bg: string; text: string }> = {
    Frontend: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400' },
    Backend: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400' },
    DevOps: { gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400' },
    Database: { gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400' },
    Mobile: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', text: 'text-pink-700 dark:text-pink-400' },
    Tools: { gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400' },
};

function getCategoryConfig(category: string) {
    return categoryConfig[category] ?? { gradient: 'from-violet-500 to-blue-500', bg: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400' };
}

export default function Skills({ skills, groupedSkills, technologies }: SkillsProps) {
    return (
        <PublicLayout>
            <Head title="Habilidades" />

            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                    <div className="absolute -right-32 -top-32 size-[400px] animate-float rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 size-[350px] animate-float-delayed rounded-full bg-gradient-to-tr from-blue-500/10 via-violet-500/5 to-transparent blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
                            <Zap className="size-3" />
                            Habilidades
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Habilidades &{' '}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
                                Tecnologías
                            </span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            Mi stack tecnológico y las herramientas que domino para crear soluciones de calidad.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                            <span className="rounded-full bg-muted px-3 py-1 font-medium">
                                {skills.length} habilidades
                            </span>
                            <span className="size-1 rounded-full bg-muted-foreground/30" />
                            <span className="rounded-full bg-muted px-3 py-1 font-medium">
                                {Object.keys(groupedSkills).length} categorías
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills by Category */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                        const config = getCategoryConfig(category);
                        return (
                            <div key={category} className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
                                <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />
                                <div className="p-6 lg:p-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold">{category}</h3>
                                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                            {categorySkills.length} {categorySkills.length === 1 ? 'habilidad' : 'habilidades'}
                                        </span>
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        {categorySkills.map((skill) => (
                                            <div key={skill.id} className="flex items-center justify-between rounded-xl border border-border/30 bg-background/50 px-4 py-3 transition-colors hover:border-border/60 hover:bg-background">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
                                                        {skill.name}
                                                    </span>
                                                    {skill.is_highlighted && (
                                                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                                    )}
                                                </div>
                                                {skill.years_experience && (
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {skill.years_experience} {skill.years_experience === 1 ? 'año' : 'años'}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Technologies */}
            {technologies.length > 0 && (
                <section className="relative overflow-hidden border-y border-border/40">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5" />
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
                                <Cpu className="size-3" />
                                Stack
                            </Badge>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Stack{' '}
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
                                    Tecnológico
                                </span>
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Las tecnologías que utilizo en mis proyectos.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {technologies.map((tech) => (
                                <div
                                    key={tech.id}
                                    className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl"
                                >
                                    {tech.color ? (
                                        <span
                                            className="size-10 rounded-xl shadow-sm transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: tech.color }}
                                        />
                                    ) : (
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                                            <Cpu className="size-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold">{tech.name}</span>
                                    {tech.type && (
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                            {tech.type}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Skills Cloud */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Todas las Habilidades</h2>
                    <p className="mt-3 text-muted-foreground">Vista completa de todo lo que sé hacer.</p>
                </div>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                    {skills.map((skill, index) => {
                        const hoverColors = [
                            'hover:border-violet-500/40 hover:bg-violet-500/5',
                            'hover:border-blue-500/40 hover:bg-blue-500/5',
                            'hover:border-emerald-500/40 hover:bg-emerald-500/5',
                            'hover:border-orange-500/40 hover:bg-orange-500/5',
                            'hover:border-pink-500/40 hover:bg-pink-500/5',
                            'hover:border-cyan-500/40 hover:bg-cyan-500/5',
                        ];
                        return (
                            <div
                                key={skill.id}
                                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${skill.is_highlighted
                                        ? 'border-amber-500/30 bg-amber-500/5'
                                        : `border-border/50 bg-card/50 ${hoverColors[index % hoverColors.length]}`
                                    }`}
                            >
                                {skill.is_highlighted && <Star className="size-3 fill-amber-400 text-amber-400" />}
                                {skill.name}
                                {skill.years_experience && (
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                        {skill.years_experience}a
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </PublicLayout>
    );
}
