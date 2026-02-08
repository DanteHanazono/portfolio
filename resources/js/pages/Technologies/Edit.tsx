import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft, Cpu, Save, Trash2 } from 'lucide-react';
import type { Technology } from '@/types';
import * as technologiesRoutes from '@/routes/technologies';

type TechnologiesEditProps = {
    technology: Technology;
};

export default function Edit({ technology }: TechnologiesEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: technology.name,
        slug: technology.slug,
        type: technology.type || '',
        icon: technology.icon || '',
        color: technology.color || '#10B981',
        order: technology.order,
        is_featured: technology.is_featured,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(technologiesRoutes.update.url(technology.id));
    }

    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar "${technology.name}"?`)) {
            router.delete(technologiesRoutes.destroy.url(technology.id), {
                onSuccess: () => router.visit(technologiesRoutes.index.url()),
            });
        }
    }

    return (
        <AppLayout>
            <Head title={`Editar ${technology.name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={technologiesRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Editar Tecnología</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {technology.name}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDelete}
                        className="shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Info Card */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <h2 className="font-bold">Información Básica</h2>
                        </div>
                        <div className="space-y-6 p-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: React, Laravel, TypeScript"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <Label htmlFor="slug">
                                    Slug
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (Se genera automáticamente si se deja vacío)
                                    </span>
                                </Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="react"
                                />
                                {errors.slug && <InputError message={errors.slug} />}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Input
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    placeholder="Ej: Frontend, Backend, Database, DevOps"
                                />
                                {errors.type && <InputError message={errors.type} />}
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <div className="flex gap-3">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="#10B981"
                                        className="flex-1"
                                    />
                                    <div
                                        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50"
                                        style={{ backgroundColor: data.color + '20' }}
                                    >
                                        <Cpu className="size-5" style={{ color: data.color }} />
                                    </div>
                                </div>
                                {errors.color && <InputError message={errors.color} />}
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <Label htmlFor="order">Orden de visualización</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', Number(e.target.value))}
                                    min="0"
                                />
                                {errors.order && <InputError message={errors.order} />}
                            </div>

                            {/* Featured */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                />
                                <Label htmlFor="is_featured" className="cursor-pointer">
                                    Marcar como destacada
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={technologiesRoutes.index.url()}>Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                        >
                            <Save className="size-4" />
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
