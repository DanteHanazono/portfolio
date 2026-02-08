import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { ArrowLeft, Briefcase, Building2, Plus, Save, X } from 'lucide-react';
import * as experiencesRoutes from '@/routes/experiences';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        company: '',
        company_logo: null as File | null,
        company_url: '',
        location: '',
        employment_type: '',
        description: '',
        responsibilities: [] as string[],
        achievements: [] as string[],
        start_date: '',
        end_date: '',
        is_current: false,
        order: 0,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [newResponsibility, setNewResponsibility] = useState('');
    const [newAchievement, setNewAchievement] = useState('');

    function handleLogoChange(file: File | null) {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
            setData('company_logo', file);
        };
        reader.readAsDataURL(file);
    }

    function addResponsibility() {
        if (newResponsibility.trim()) {
            setData('responsibilities', [...data.responsibilities, newResponsibility.trim()]);
            setNewResponsibility('');
        }
    }

    function removeResponsibility(index: number) {
        setData(
            'responsibilities',
            data.responsibilities.filter((_, i) => i !== index),
        );
    }

    function addAchievement() {
        if (newAchievement.trim()) {
            setData('achievements', [...data.achievements, newAchievement.trim()]);
            setNewAchievement('');
        }
    }

    function removeAchievement(index: number) {
        setData(
            'achievements',
            data.achievements.filter((_, i) => i !== index),
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(experiencesRoutes.store.url());
    }

    return (
        <AppLayout>
            <Head title="Nueva Experiencia" />

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={experiencesRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black tracking-tight">Nueva Experiencia</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Agrega una nueva experiencia laboral a tu portafolio</p>
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
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Cargo / Título <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ej: Desarrollador Full Stack Senior"
                                    className={errors.title ? 'border-destructive' : ''}
                                />
                                {errors.title && <InputError message={errors.title} />}
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <Label htmlFor="company">
                                    Empresa <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="company"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="Ej: Tech Solutions Inc."
                                    className={errors.company ? 'border-destructive' : ''}
                                />
                                {errors.company && <InputError message={errors.company} />}
                            </div>

                            {/* Company Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="company_logo">Logo de la Empresa</Label>
                                <div className="flex items-center gap-4">
                                    {logoPreview && (
                                        <img
                                            src={logoPreview}
                                            alt="Vista previa"
                                            className="size-16 rounded-lg border object-cover"
                                        />
                                    )}
                                    <Input
                                        id="company_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
                                    />
                                </div>
                                {errors.company_logo && <InputError message={errors.company_logo} />}
                            </div>

                            {/* Company URL */}
                            <div className="space-y-2">
                                <Label htmlFor="company_url">Sitio Web de la Empresa</Label>
                                <Input
                                    id="company_url"
                                    type="url"
                                    value={data.company_url}
                                    onChange={(e) => setData('company_url', e.target.value)}
                                    placeholder="https://company.com"
                                />
                                {errors.company_url && <InputError message={errors.company_url} />}
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

                            {/* Employment Type */}
                            <div className="space-y-2">
                                <Label htmlFor="employment_type">Tipo de Empleo</Label>
                                <Select value={data.employment_type} onValueChange={(value) => setData('employment_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Tiempo completo</SelectItem>
                                        <SelectItem value="Part-time">Medio tiempo</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                        <SelectItem value="Contract">Contrato</SelectItem>
                                        <SelectItem value="Internship">Pasantía</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.employment_type && <InputError message={errors.employment_type} />}
                            </div>
                        </div>
                    </div>

                    {/* Description & Details */}
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                            <h2 className="font-bold">Descripción y Detalles</h2>
                        </div>
                        <div className="space-y-6 p-6">
                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción General</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Breve descripción del rol y la empresa..."
                                    rows={4}
                                />
                                {errors.description && <InputError message={errors.description} />}
                            </div>

                            {/* Responsibilities */}
                            <div className="space-y-2">
                                <Label>Responsabilidades</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newResponsibility}
                                        onChange={(e) => setNewResponsibility(e.target.value)}
                                        placeholder="Agrega una responsabilidad..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                                    />
                                    <Button type="button" onClick={addResponsibility} size="icon">
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                                {data.responsibilities.length > 0 && (
                                    <ul className="mt-2 space-y-2">
                                        {data.responsibilities.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                                                <span className="flex-1 text-sm">{item}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeResponsibility(index)}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.responsibilities && <InputError message={errors.responsibilities} />}
                            </div>

                            {/* Achievements */}
                            <div className="space-y-2">
                                <Label>Logros</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newAchievement}
                                        onChange={(e) => setNewAchievement(e.target.value)}
                                        placeholder="Agrega un logro..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                    />
                                    <Button type="button" onClick={addAchievement} size="icon">
                                        <Plus className="size-4" />
                                    </Button>
                                </div>
                                {data.achievements.length > 0 && (
                                    <ul className="mt-2 space-y-2">
                                        {data.achievements.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                                                <span className="flex-1 text-sm">{item}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeAchievement(index)}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.achievements && <InputError message={errors.achievements} />}
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
                                    Trabajo actual
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
                            <Link href={experiencesRoutes.index.url()}>Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                        >
                            <Save className="size-4" />
                            {processing ? 'Guardando...' : 'Guardar Experiencia'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
