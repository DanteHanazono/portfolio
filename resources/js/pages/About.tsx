import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Award, MapPin, Calendar, ExternalLink, User, Code2, Cpu } from 'lucide-react';
import type { Experience, Education, Certification, Skill, Technology } from '@/types';

type AboutProps = {
    experiences: Experience[];
    education: Education[];
    certifications: Certification[];
    skills: Record<string, Skill[]>;
    technologies: Technology[];
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

const categoryGradients: Record<string, string> = {
    Frontend: 'from-blue-500 to-cyan-500',
    Backend: 'from-emerald-500 to-teal-500',
    DevOps: 'from-orange-500 to-amber-500',
    Database: 'from-violet-500 to-purple-500',
    Mobile: 'from-pink-500 to-rose-500',
    Tools: 'from-yellow-500 to-orange-500',
};

function getCategoryGradient(category: string): string {
    return categoryGradients[category] ?? 'from-violet-500 to-blue-500';
}

export default function About({ experiences, education, certifications, skills, technologies }: AboutProps) {
    return (
        <PublicLayout>
            <Head title="Sobre Mí" />

            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                    <div className="absolute -right-32 -top-32 size-[400px] animate-float rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 size-[350px] animate-float-delayed rounded-full bg-gradient-to-tr from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
                            <User className="size-3" />
                            Sobre Mí
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Mi{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-purple-400">
                                Trayectoria
                            </span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            Conoce mi experiencia profesional, formación académica y las tecnologías con las que trabajo día a día.
                        </p>
                    </div>
                </div>
            </section>

            {/* Experience Timeline */}
            {experiences.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                            <Briefcase className="size-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Experiencia Profesional</h2>
                            <p className="text-sm text-muted-foreground">Mi recorrido en la industria</p>
                        </div>
                    </div>

                    <div className="relative mt-12 ml-6 border-l-2 border-border/60 pl-10">
                        {experiences.map((exp, index) => (
                            <div key={exp.id} className={`relative ${index < experiences.length - 1 ? 'pb-12' : ''}`}>
                                {/* Timeline dot */}
                                <div className="absolute -left-[calc(2.5rem+5px)] flex size-4 items-center justify-center rounded-full border-2 border-blue-500 bg-background ring-4 ring-blue-500/10" style={{ marginTop: '4px' }} />

                                <div className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl">
                                    <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                                        <h3 className="text-lg font-bold">{exp.title}</h3>
                                        {exp.is_current && (
                                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-xs text-white">
                                                Actual
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                                        <span className="font-semibold text-foreground/80">{exp.company}</span>
                                        {exp.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3.5" />
                                                {exp.location}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3.5" />
                                            {formatDate(exp.start_date)} - {exp.is_current ? 'Presente' : exp.end_date ? formatDate(exp.end_date) : ''}
                                        </span>
                                        {exp.employment_type && (
                                            <Badge variant="outline" className="text-xs">{exp.employment_type}</Badge>
                                        )}
                                    </div>
                                    {exp.description && (
                                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                                    )}
                                    {exp.company_url && (
                                        <Button asChild variant="link" size="sm" className="mt-2 h-auto p-0">
                                            <a href={exp.company_url} target="_blank" rel="noopener noreferrer">
                                                Visitar empresa <ExternalLink className="size-3" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="relative overflow-hidden border-y border-border/40">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/40 to-background" />
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                                <GraduationCap className="size-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Formación Académica</h2>
                                <p className="text-sm text-muted-foreground">Base de conocimiento sólida</p>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {education.map((edu) => (
                                <div key={edu.id} className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
                                    <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500" />
                                    <div className="p-6">
                                        <h3 className="text-base font-bold">{edu.degree}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground/80">{edu.institution}</span>
                                            {edu.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    {edu.location}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="size-3" />
                                            {formatDate(edu.start_date)} - {edu.is_current ? 'Presente' : edu.end_date ? formatDate(edu.end_date) : ''}
                                        </div>
                                        {edu.field_of_study && (
                                            <span className="mt-3 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-400">
                                                {edu.field_of_study}
                                            </span>
                                        )}
                                        {edu.description && (
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{edu.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills by Category */}
            {Object.keys(skills).length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                            <Code2 className="size-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Habilidades por Categoría</h2>
                            <p className="text-sm text-muted-foreground">Dominio técnico en múltiples áreas</p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(skills).map(([category, categorySkills]) => (
                            <div key={category} className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
                                <div className={`h-1.5 bg-gradient-to-r ${getCategoryGradient(category)}`} />
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold">{category}</h3>
                                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                            {categorySkills.length}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium transition-colors hover:border-border hover:bg-background"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
                <section className="relative overflow-hidden border-y border-border/40">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5" />
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
                                <Cpu className="size-3" />
                                Stack
                            </Badge>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Tecnologías{' '}
                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
                                    Destacadas
                                </span>
                            </h2>
                            <p className="mt-3 text-muted-foreground">Stack tecnológico principal con el que desarrollo.</p>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                            {technologies.map((tech) => (
                                <div
                                    key={tech.id}
                                    className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/50 px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
                                >
                                    {tech.color && (
                                        <span className="size-3 rounded-full shadow-sm" style={{ backgroundColor: tech.color }} />
                                    )}
                                    <span className="text-sm font-semibold">{tech.name}</span>
                                    {tech.type && (
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                            {tech.type}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                            <Award className="size-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Certificaciones</h2>
                            <p className="text-sm text-muted-foreground">Acreditaciones y logros profesionales</p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                                        <Award className="size-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold">{cert.name}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{cert.issuing_organization}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-1.5 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="size-3" />
                                        Emitida: {formatDate(cert.issue_date)}
                                    </div>
                                    {!cert.does_not_expire && cert.expiry_date && (
                                        <div className="pl-[18px]">Expira: {formatDate(cert.expiry_date)}</div>
                                    )}
                                    {cert.does_not_expire && (
                                        <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                            No expira
                                        </span>
                                    )}
                                </div>
                                {cert.credential_url && (
                                    <Button asChild variant="link" size="sm" className="mt-3 h-auto p-0">
                                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                                            Ver credencial <ExternalLink className="size-3" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
