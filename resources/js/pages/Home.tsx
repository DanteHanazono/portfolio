import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { portfolio, skills as skillsRoute, testimonials as testimonialsRoute } from '@/actions/App/Http/Controllers/HomeController';
import { create as contactCreate } from '@/actions/App/Http/Controllers/ContactMessageController';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code2, Briefcase, Users, Cpu, Star, ExternalLink, Github, Sparkles, Zap, Layers, Quote } from 'lucide-react';
import type { Project, Skill, Testimonial, HomeStats } from '@/types';
import { useEffect, useRef, useState } from 'react';

type HomeProps = {
    featuredProjects: Project[];
    highlightedSkills: Skill[];
    featuredTestimonials: Testimonial[];
    stats: HomeStats;
};

const statConfig = [
    { key: 'projects_completed', icon: Briefcase, label: 'Proyectos Completados', suffix: '', color: 'from-violet-500 to-purple-600', bgGlow: 'bg-violet-500/20' },
    { key: 'years_experience', icon: Code2, label: 'Años de Experiencia', suffix: '+', color: 'from-blue-500 to-cyan-500', bgGlow: 'bg-blue-500/20' },
    { key: 'happy_clients', icon: Users, label: 'Clientes Satisfechos', suffix: '', color: 'from-emerald-500 to-teal-500', bgGlow: 'bg-emerald-500/20' },
    { key: 'technologies_used', icon: Cpu, label: 'Tecnologías Utilizadas', suffix: '', color: 'from-orange-500 to-amber-500', bgGlow: 'bg-orange-500/20' },
] as const;

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 2000;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * value));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 },
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref} className="text-4xl font-black tracking-tight lg:text-5xl">
            {count}{suffix}
        </div>
    );
}

export default function Home({ featuredProjects, highlightedSkills, featuredTestimonials, stats }: HomeProps) {
    return (
        <PublicLayout>
            <Head title="Inicio">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* Hero Section - Full visual impact */}
            <section className="relative min-h-[90vh] overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
                    <div className="absolute right-0 top-0 -z-10 size-[600px] animate-float rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 -z-10 size-[500px] animate-float-delayed rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
                    <div className="absolute left-1/2 top-1/4 -z-10 size-[300px] animate-pulse-glow rounded-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 blur-3xl" />
                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-28 sm:py-36 lg:px-8 lg:py-44">
                    {/* Animated availability badge */}
                    <div className="animate-slide-up opacity-0">
                        <Badge variant="outline" className="mb-8 gap-2 border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-400">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            Disponible para nuevos proyectos
                        </Badge>
                    </div>

                    {/* Main heading with dramatic gradient */}
                    <h1 className="animate-slide-up-delayed max-w-4xl text-center text-5xl font-black leading-[1.1] tracking-tight opacity-0 sm:text-7xl lg:text-8xl">
                        Creando experiencias{' '}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400">
                                digitales únicas
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                <path d="M2 8.5C50 2 100 2 150 6C200 10 250 4 298 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                                        <stop stopColor="#7c3aed" />
                                        <stop offset="0.5" stopColor="#2563eb" />
                                        <stop offset="1" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h1>

                    <p className="animate-slide-up-delayed-2 mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground opacity-0 sm:text-xl">
                        Desarrollo soluciones web modernas, escalables y con atención al detalle.
                        Transformo ideas en productos digitales que generan impacto real.
                    </p>

                    {/* CTA Buttons with glow effects */}
                    <div className="animate-slide-up-delayed-2 mt-12 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
                        <Button asChild size="lg" className="group relative h-12 overflow-hidden bg-gradient-to-r from-violet-600 to-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 dark:shadow-violet-500/10 dark:hover:shadow-violet-500/20">
                            <Link href={portfolio().url}>
                                Ver Portafolio
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
                            <Link href={contactCreate().url}>
                                <Sparkles className="size-4" />
                                Contáctame
                            </Link>
                        </Button>
                    </div>

                    {/* Scroll indicator */}
                    <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground/50 sm:mt-28">
                        <span className="text-xs uppercase tracking-widest">Descubre más</span>
                        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/20 p-1">
                            <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Glassmorphism cards */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/40 to-background" />
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {statConfig.map(({ key, icon: Icon, label, suffix, color, bgGlow }) => (
                            <div
                                key={key}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl lg:p-8"
                            >
                                {/* Glow background */}
                                <div className={`absolute -right-8 -top-8 size-32 rounded-full ${bgGlow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

                                <div className={`relative mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                                    <Icon className="size-6 text-white" />
                                </div>
                                <AnimatedCounter value={stats[key]} suffix={suffix} />
                                <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects - Bento-style grid */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="flex items-end justify-between">
                    <div>
                        <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
                            <Layers className="size-3" />
                            Proyectos
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Proyectos{' '}
                            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
                                Destacados
                            </span>
                        </h2>
                        <p className="mt-3 max-w-lg text-muted-foreground">
                            Una selección de mis trabajos más recientes e impactantes.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="hidden gap-2 sm:inline-flex">
                        <Link href={portfolio().url}>
                            Ver todos <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {featuredProjects.map((project, index) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.slug}`}
                            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-2xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                        >
                            {/* Image with overlay */}
                            <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[16/10]' : 'aspect-video'}`}>
                                {project.featured_image_url ? (
                                    <img
                                        src={project.featured_image_url}
                                        alt={project.title}
                                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                        <Code2 className={`text-muted-foreground/30 ${index === 0 ? 'size-20' : 'size-12'}`} />
                                    </div>
                                )}
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                {/* Hover content */}
                                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-end p-5 transition-transform duration-500 group-hover:translate-y-0">
                                    <div className="flex gap-2">
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
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
                                                onClick={(e) => e.stopPropagation()}
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
                                <h3 className={`font-bold ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                                    {project.title}
                                </h3>
                                {project.description && (
                                    <p className={`mt-2 text-muted-foreground ${index === 0 ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-sm'}`}>
                                        {project.description}
                                    </p>
                                )}
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {project.technologies?.slice(0, index === 0 ? 6 : 3).map((tech) => (
                                        <span
                                            key={tech.id}
                                            className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                        >
                                            {tech.name}
                                        </span>
                                    ))}
                                    {(project.technologies?.length ?? 0) > (index === 0 ? 6 : 3) && (
                                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                            +{(project.technologies?.length ?? 0) - (index === 0 ? 6 : 3)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Button asChild variant="outline">
                        <Link href={portfolio().url}>
                            Ver todos los proyectos <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Highlighted Skills - Animated marquee style */}
            {highlightedSkills.length > 0 && (
                <section className="relative overflow-hidden border-y border-border/40">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5" />
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
                                <Zap className="size-3" />
                                Habilidades
                            </Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Mi{' '}
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                                    Stack Tecnológico
                                </span>
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Tecnologías y herramientas con las que trabajo a diario.
                            </p>
                        </div>

                        {/* Skills as pill cards */}
                        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
                            {highlightedSkills.map((skill, index) => {
                                const colors = [
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
                                        className={`flex items-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${colors[index % colors.length]}`}
                                    >
                                        <span className="text-sm font-semibold">{skill.name}</span>
                                        {skill.years_experience && (
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                {skill.years_experience} años
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 text-center">
                            <Button asChild variant="outline" className="gap-2">
                                <Link href={skillsRoute().url}>
                                    Explorar todas las habilidades
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials - Modern card design */}
            {featuredTestimonials.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="text-center">
                        <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
                            <Star className="size-3" />
                            Testimonios
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Lo que dicen mis{' '}
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                                clientes
                            </span>
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Opiniones reales de quienes han confiado en mi trabajo.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredTestimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl lg:p-8"
                            >
                                {/* Decorative quote */}
                                <Quote className="absolute -right-2 -top-2 size-20 rotate-12 text-muted/30 transition-colors group-hover:text-violet-500/10" />

                                {testimonial.rating && (
                                    <div className="relative mb-4 flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`size-5 ${i < testimonial.rating!
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-muted/30'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <blockquote className="relative text-sm leading-relaxed text-muted-foreground lg:text-base">
                                    &ldquo;{testimonial.content}&rdquo;
                                </blockquote>

                                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
                                    {testimonial.client_avatar ? (
                                        <img
                                            src={testimonial.client_avatar}
                                            alt={testimonial.client_name}
                                            className="size-11 rounded-full object-cover ring-2 ring-border"
                                        />
                                    ) : (
                                        <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white ring-2 ring-border">
                                            {testimonial.client_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-semibold">{testimonial.client_name}</div>
                                        {(testimonial.client_position || testimonial.client_company) && (
                                            <div className="text-xs text-muted-foreground">
                                                {[testimonial.client_position, testimonial.client_company]
                                                    .filter(Boolean)
                                                    .join(' en ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={testimonialsRoute().url}>
                                Ver todos los testimonios
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
            )}

            {/* CTA Section - Full visual impact */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-blue-600/90 to-cyan-600/90 dark:from-violet-900/90 dark:via-blue-900/90 dark:to-cyan-900/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1),transparent_70%)]" />
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            ¿Listo para dar vida a tu próximo proyecto?
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-white/80">
                            Cuéntame sobre tu idea y trabajemos juntos para crear algo extraordinario.
                            Cada gran proyecto comienza con una conversación.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 bg-white px-8 text-base font-semibold text-violet-700 shadow-xl hover:bg-white/90">
                                <Link href={contactCreate().url}>
                                    Hablemos de tu proyecto
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white">
                                <Link href={portfolio().url}>
                                    Ver mi trabajo
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
