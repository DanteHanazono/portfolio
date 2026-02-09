import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, User, Star } from 'lucide-react';
import type { Project } from '@/types';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import * as testimonialsRoutes from '@/routes/testimonials';

type TestimonialsCreateProps = {
    projects: Project[];
};

export default function Create({ projects }: TestimonialsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        client_name: '',
        client_position: '',
        client_company: '',
        client_avatar: null as File | null,
        content: '',
        rating: '5',
        is_featured: false,
        is_published: false,
        order: 0,
    });

    const [preview, setPreview] = useState<string | null>(null);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('client_avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(testimonialsRoutes.store.url());
    }

    return (
        <AppLayout>
            <Head title="Agregar Testimonio" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="shrink-0">
                        <Link href={testimonialsRoutes.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                            Agregar Testimonio
                        </h1>
                        <p className="text-sm text-muted-foreground">Crea un nuevo testimonio de cliente</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Information */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold">Información del Cliente</h2>
                        <div className="space-y-6">
                            {/* Avatar Upload */}
                            <div>
                                <Label>Avatar del Cliente (Opcional)</Label>
                                <div className="mt-2 flex items-center gap-4">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Avatar preview"
                                            className="size-20 rounded-full object-cover ring-2 ring-border/50"
                                        />
                                    ) : (
                                        <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                                            <User className="size-10 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="cursor-pointer"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            JPG, PNG o GIF. Máximo 2MB.
                                        </p>
                                    </div>
                                </div>
                                {errors.client_avatar && (
                                    <p className="mt-1 text-sm text-red-600">{errors.client_avatar}</p>
                                )}
                            </div>

                            {/* Client Name */}
                            <div>
                                <Label htmlFor="client_name">
                                    Nombre del Cliente <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="client_name"
                                    value={data.client_name}
                                    onChange={(e) => setData('client_name', e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="mt-2"
                                    required
                                />
                                {errors.client_name && <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>}
                            </div>

                            {/* Position & Company */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="client_position">Cargo (Opcional)</Label>
                                    <Input
                                        id="client_position"
                                        value={data.client_position}
                                        onChange={(e) => setData('client_position', e.target.value)}
                                        placeholder="Ej: Director de Tecnología"
                                        className="mt-2"
                                    />
                                    {errors.client_position && (
                                        <p className="mt-1 text-sm text-red-600">{errors.client_position}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="client_company">Empresa (Opcional)</Label>
                                    <Input
                                        id="client_company"
                                        value={data.client_company}
                                        onChange={(e) => setData('client_company', e.target.value)}
                                        placeholder="Ej: Tech Corp"
                                        className="mt-2"
                                    />
                                    {errors.client_company && (
                                        <p className="mt-1 text-sm text-red-600">{errors.client_company}</p>
                                    )}
                                </div>
                            </div>

                            {/* Project Association */}
                            <div>
                                <Label htmlFor="project_id">Proyecto Asociado (Opcional)</Label>
                                <Select value={data.project_id} onValueChange={(value) => setData('project_id', value)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Selecciona un proyecto (opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id.toString()}>
                                                {project.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.project_id && <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold">Contenido del Testimonio</h2>
                        <div className="space-y-6">
                            {/* Rating */}
                            <div>
                                <Label htmlFor="rating">
                                    Calificación <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.rating} onValueChange={(value) => setData('rating', value)}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5 estrellas)</SelectItem>
                                        <SelectItem value="4">⭐⭐⭐⭐ (4 estrellas)</SelectItem>
                                        <SelectItem value="3">⭐⭐⭐ (3 estrellas)</SelectItem>
                                        <SelectItem value="2">⭐⭐ (2 estrellas)</SelectItem>
                                        <SelectItem value="1">⭐ (1 estrella)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
                            </div>

                            {/* Content */}
                            <div>
                                <Label htmlFor="content">
                                    Testimonio <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Escribe el testimonio del cliente..."
                                    rows={6}
                                    className="mt-2"
                                    required
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {data.content.length} caracteres
                                </p>
                                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold">Configuración</h2>
                        <div className="space-y-6">
                            {/* Order */}
                            <div>
                                <Label htmlFor="order">Orden de visualización</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="mt-2"
                                    min="0"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Número menor = aparece primero
                                </p>
                                {errors.order && <p className="mt-1 text-sm text-red-600">{errors.order}</p>}
                            </div>

                            {/* Toggles */}
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                    />
                                    <div>
                                        <Label htmlFor="is_featured" className="cursor-pointer font-medium">
                                            <Star className="mr-2 inline size-4 text-yellow-500" />
                                            Destacar testimonio
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Los testimonios destacados aparecen en secciones especiales
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                    />
                                    <div>
                                        <Label htmlFor="is_published" className="cursor-pointer font-medium">
                                            Publicar
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            El testimonio será visible en el portafolio público
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href={testimonialsRoutes.index.url()}>Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                        >
                            <Save className="mr-2 size-4" />
                            {processing ? 'Guardando...' : 'Guardar Testimonio'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
