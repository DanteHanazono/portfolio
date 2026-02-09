import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft, GraduationCap, Save, Trash2, X } from 'lucide-react';
import * as educationRoutes from '@/routes/education';
import { useState } from 'react';
import type { Education } from '@/types/portfolio';

interface EditProps {
    education: Education;
}

export default function Edit({ education }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        degree: education.degree,
        institution: education.institution,
        institution_logo: null as File | null,
        location: education.location || '',
        field_of_study: education.field_of_study || '',
        description: education.description || '',
        start_date: education.start_date,
        end_date: education.end_date || '',
        is_current: education.is_current,
        order: education.order,
        remove_logo: false,
        _method: 'PUT',
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [removeLogo, setRemoveLogo] = useState(false);

    function handleLogoChange(file: File | null) {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
            setData('institution_logo', file);
            setRemoveLogo(false);
            setData('remove_logo', false);
        };
        reader.readAsDataURL(file);
    }

    function handleRemoveLogo() {
        setRemoveLogo(true);
        setData('remove_logo', true);
        setLogoPreview(null);
        setData('institution_logo', null);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(educationRoutes.update.url({ id: education.id }));
    }

    const currentLogo = !removeLogo && !logoPreview ? education.institution_logo_url : null;
    const displayLogo = logoPreview || currentLogo;

    return (
        <AppLayout>
            <Head title={`Editar: ${education.degree}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={educationRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Editar Formación</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{education.institution}</p>
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
                            {/* Degree */}
                            <div className="space-y-2">
                                <Label htmlFor="degree">
                                    Título / Grado <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="degree"
                                    value={data.degree}
                                    onChange={(e) => setData('degree', e.target.value)}
                                    placeholder="Ej: Ingeniería en Sistemas Computacionales"
                                    className={errors.degree ? 'border-destructive' : ''}
                                />
                                {errors.degree && <InputError message={errors.degree} />}
                            </div>

                            {/* Field of Study */}
                            <div className="space-y-2">
                                <Label htmlFor="field_of_study">Campo de Estudio</Label>
                                <Input
                                    id="field_of_study"
                                    value={data.field_of_study}
                                    onChange={(e) => setData('field_of_study', e.target.value)}
                                    placeholder="Ej: Ciencias de la Computación"
                                />
                                {errors.field_of_study && <InputError message={errors.field_of_study} />}
                            </div>

                            {/* Institution */}
                            <div className="space-y-2">
                                <Label htmlFor="institution">
                                    Institución <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="institution"
                                    value={data.institution}
                                    onChange={(e) => setData('institution', e.target.value)}
                                    placeholder="Ej: Universidad Nacional Autónoma"
                                    className={errors.institution ? 'border-destructive' : ''}
                                />
                                {errors.institution && <InputError message={errors.institution} />}
                            </div>

                            {/* Institution Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="institution_logo">Logo de la Institución</Label>
                                {displayLogo && (
                                    <div className="relative inline-block">
                                        <img
                                            src={displayLogo}
                                            alt="Logo actual"
                                            className="size-20 rounded-xl border object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-lg transition-transform hover:scale-110"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                )}
                                <Input
                                    id="institution_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                                />
                                {errors.institution_logo && <InputError message={errors.institution_logo} />}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Ej: Ciudad de México, México"
                                />
                                {errors.location && <InputError message={errors.location} />}
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <h2 className="font-bold">Detalles Adicionales</h2>
                        </div>
                        <div className="space-y-6 p-6">
                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe tu formación, logros destacados, proyectos realizados..."
                                    rows={4}
                                />
                                {errors.description && <InputError message={errors.description} />}
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <h2 className="font-bold">Fechas</h2>
                        </div>
                        <div className="space-y-6 p-6">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="start_date">
                                    Fecha de Inicio <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className={errors.start_date ? 'border-destructive' : ''}
                                />
                                {errors.start_date && <InputError message={errors.start_date} />}
                            </div>

                            {/* Is Current */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_current"
                                    checked={data.is_current}
                                    onCheckedChange={(checked) => setData('is_current', checked as boolean)}
                                />
                                <Label htmlFor="is_current" className="cursor-pointer">
                                    Estudio actualmente aquí
                                </Label>
                            </div>

                            {/* End Date */}
                            {!data.is_current && (
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Fecha de Finalización</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <InputError message={errors.end_date} />}
                                </div>
                            )}

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
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={educationRoutes.index.url()}>Cancelar</Link>
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
