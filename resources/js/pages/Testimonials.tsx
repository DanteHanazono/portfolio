import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, MessageCircle } from 'lucide-react';
import type { Testimonial } from '@/types';

type TestimonialsProps = {
    testimonials: Testimonial[];
};

export default function Testimonials({ testimonials }: TestimonialsProps) {
    return (
        <PublicLayout>
            <Head title="Testimonios" />

            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                    <div className="absolute -right-32 -top-32 size-[400px] animate-float rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 size-[350px] animate-float-delayed rounded-full bg-gradient-to-tr from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
                            <Star className="size-3" />
                            Testimonios
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Lo que dicen mis{' '}
                            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
                                clientes
                            </span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            Opiniones y reseñas de clientes con los que he tenido el placer de trabajar.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8">
                {testimonials.length > 0 ? (
                    <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="group mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl lg:p-8">
                                {/* Decorative quote */}
                                <Quote className="absolute -right-2 -top-2 size-20 rotate-12 text-muted/30 transition-colors group-hover:text-violet-500/10" />

                                {testimonial.rating && (
                                    <div className="mb-4 flex gap-0.5">
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

                                <blockquote className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                                    &ldquo;{testimonial.content}&rdquo;
                                </blockquote>

                                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
                                    {testimonial.client_avatar ? (
                                        <img
                                            src={`/storage/${testimonial.client_avatar}`}
                                            alt={testimonial.client_name}
                                            className="size-11 rounded-full object-cover ring-2 ring-border"
                                        />
                                    ) : (
                                        <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-bold text-white ring-2 ring-border">
                                            {testimonial.client_name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold">
                                            {testimonial.client_name}
                                        </div>
                                        {(testimonial.client_position || testimonial.client_company) && (
                                            <div className="truncate text-xs text-muted-foreground">
                                                {[testimonial.client_position, testimonial.client_company]
                                                    .filter(Boolean)
                                                    .join(' en ')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {testimonial.project && (
                                    <div className="mt-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                            <MessageCircle className="size-3" />
                                            {testimonial.project.title}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50">
                            <Quote className="size-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">Aún no hay testimonios</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Los testimonios de clientes aparecerán aquí pronto.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
