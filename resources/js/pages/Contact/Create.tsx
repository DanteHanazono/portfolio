import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { store } from '@/actions/App/Http/Controllers/ContactMessageController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Mail, Phone, Building2, Send, CheckCircle2, Sparkles, Globe, ArrowRight } from 'lucide-react';
import type { FormEvent } from 'react';

type FlashMessages = {
    flash?: {
        success?: string;
    };
    [key: string]: unknown;
};

export default function Create() {
    const { flash } = usePage<FlashMessages>().props;
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(store().url, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            description: 'Respondo en menos de 24 horas.',
            gradient: 'from-violet-500 to-purple-600',
        },
        {
            icon: Phone,
            title: 'Teléfono',
            description: 'Disponible en horario laboral.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Globe,
            title: 'Freelance',
            description: 'Abierto a proyectos remotos a nivel global.',
            gradient: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Contacto" />

            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                    <div className="absolute -right-32 -top-32 size-[400px] animate-float rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 size-[350px] animate-float-delayed rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
                </div>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1">
                            <Sparkles className="size-3" />
                            Contacto
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Hablemos de tu{' '}
                            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-blue-400 dark:to-cyan-400">
                                próximo proyecto
                            </span>
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                            ¿Tienes un proyecto en mente o quieres colaborar? Envíame un mensaje y te responderé lo antes posible.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-4 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold">Información de Contacto</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Completa el formulario y me pondré en contacto contigo. También puedes contactarme directamente.
                        </p>

                        <div className="mt-8 space-y-4">
                            {contactInfo.map((info) => (
                                <div key={info.title} className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg">
                                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${info.gradient} shadow-lg`}>
                                        <info.icon className="size-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">{info.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {info.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick CTA */}
                        <div className="mt-8 rounded-2xl border border-border/50 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5 p-6">
                            <h3 className="font-bold">¿Proyecto urgente?</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Si necesitas una respuesta rápida, no dudes en contactarme directamente.
                            </p>
                            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
                                Respuesta en menos de 24h
                                <ArrowRight className="size-3.5" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        {(recentlySuccessful || flash?.success) && (
                            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                                    <CheckCircle2 className="size-5 text-white" />
                                </div>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    {flash?.success ?? '¡Mensaje enviado exitosamente! Te responderé pronto.'}
                                </p>
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />
                            <div className="p-6 lg:p-8">
                                <h3 className="text-lg font-bold">Envíame un mensaje</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Todos los campos marcados con * son obligatorios.
                                </p>

                                <form onSubmit={submit} className="mt-8 space-y-5">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Tu nombre completo"
                                                aria-invalid={!!errors.name}
                                                className="rounded-xl"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="tu@email.com"
                                                aria-invalid={!!errors.email}
                                                className="rounded-xl"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 234 567 890"
                                                className="rounded-xl"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company">Empresa</Label>
                                            <Input
                                                id="company"
                                                value={data.company}
                                                onChange={(e) => setData('company', e.target.value)}
                                                placeholder="Nombre de tu empresa"
                                                className="rounded-xl"
                                            />
                                            <InputError message={errors.company} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Asunto *</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="¿En qué puedo ayudarte?"
                                            aria-invalid={!!errors.subject}
                                            className="rounded-xl"
                                        />
                                        <InputError message={errors.subject} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje *</Label>
                                        <textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Cuéntame sobre tu proyecto o idea..."
                                            rows={5}
                                            aria-invalid={!!errors.message}
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
                                        />
                                        <InputError message={errors.message} />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 w-full gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 sm:w-auto sm:px-8 dark:shadow-violet-500/10 dark:hover:shadow-violet-500/20"
                                    >
                                        {processing ? (
                                            'Enviando...'
                                        ) : (
                                            <>
                                                <Send className="size-4" />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
