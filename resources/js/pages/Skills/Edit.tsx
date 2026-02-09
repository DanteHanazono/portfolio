import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft, Save } from 'lucide-react';
import * as skillsRoutes from '@/routes/skills';
import type { Skill } from '@/types/portfolio';

interface EditProps {
    skill: Skill;
    categories: string[];
}

export default function Edit({ skill, categories }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: skill.name,
        category: skill.category,
        icon: skill.icon || '',
        years_experience: skill.years_experience ?? 0,
        is_highlighted: skill.is_highlighted,
        order: skill.order,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(skillsRoutes.update.url({ id: skill.id }));
    }

    return (
        <AppLayout>
            <Head title={`Editar: ${skill.name}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={skillsRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Editar Habilidad</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{skill.name}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
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
                                    placeholder="Ej: React, Laravel, Docker"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Categoría <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <select
                                        id="category"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className={`flex-1 rounded-lg border border-input bg-background px-4 py-2 ${errors.category ? 'border-destructive' : ''}`}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="Database">Database</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Tools">Tools</option>
                                    </select>
                                    <Input
                                        placeholder="O escribe nueva..."
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                                {errors.category && <InputError message={errors.category} />}
                            </div>

                            {/* Icon */}
                            <div className="space-y-2">
                                <Label htmlFor="icon">Ícono (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    placeholder="Ej: ⚛️, 🐘, 🐳"
                                    className="text-2xl"
                                    maxLength={2}
                                />
                                {errors.icon && <InputError message={errors.icon} />}
                                <p className="text-xs text-muted-foreground">
                                    Puedes copiar un emoji desde{' '}
                                    <a href="https://emojipedia.org" target="_blank" rel="noopener noreferrer" className="underline">
                                        Emojipedia
                                    </a>
                                </p>
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="years_experience">Años de Experiencia</Label>
                                <Input
                                    id="years_experience"
                                    type="number"
                                    min="0"
                                    value={data.years_experience}
                                    onChange={(e) => setData('years_experience', Number(e.target.value))}
                                />
                                {errors.years_experience && <InputError message={errors.years_experience} />}
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <h2 className="font-bold">Opciones Adicionales</h2>
                        </div>
                        <div className="space-y-6 p-6">
                            {/* Is Highlighted */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_highlighted"
                                    checked={data.is_highlighted}
                                    onCheckedChange={(checked) => setData('is_highlighted', checked as boolean)}
                                />
                                <Label htmlFor="is_highlighted" className="cursor-pointer">
                                    Destacar esta habilidad
                                </Label>
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <Label htmlFor="order">Orden de visualización</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', Number(e.target.value))}
                                />
                                {errors.order && <InputError message={errors.order} />}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={skillsRoutes.index.url()}>Cancelar</Link>
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
