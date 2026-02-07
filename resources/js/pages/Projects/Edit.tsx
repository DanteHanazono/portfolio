import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Code2, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { Project, Technology } from '@/types';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import * as projectsRoutes from '@/routes/projects';

type ProjectsEditProps = {
    project: Project;
    technologies: Technology[];
};

export default function Edit({ project, technologies }: ProjectsEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT' as const,
        title: project.title,
        slug: project.slug,
        description: project.description ?? '',
        content: project.content ?? '',
        featured_image: null as File | null,
        thumbnail: null as File | null,
        gallery: [] as File[],
        remove_featured_image: false,
        remove_thumbnail: false,
        remove_gallery: [] as string[],
        video_url: project.video_url ?? '',
        demo_url: project.demo_url ?? '',
        github_url: project.github_url ?? '',
        client_name: project.client_name ?? '',
        client_website: project.client_website ?? '',
        start_date: project.start_date ?? '',
        end_date: project.end_date ?? '',
        status: project.status,
        technologies: project.technologies?.map((t) => t.id) ?? [],
        is_featured: project.is_featured,
        is_published: project.is_published,
    });

    const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    function handleImageChange(file: File | null, type: 'featured' | 'thumbnail') {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'featured') {
                setFeaturedImagePreview(reader.result as string);
                setData('featured_image', file);
            } else {
                setThumbnailPreview(reader.result as string);
                setData('thumbnail', file);
            }
        };
        reader.readAsDataURL(file);
    }

    function handleGalleryChange(files: FileList | null) {
        if (!files) return;

        const fileArray = Array.from(files);
        const previews: string[] = [];

        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result as string);
                if (previews.length === fileArray.length) {
                    setGalleryPreviews((prev) => [...prev, ...previews]);
                    setData('gallery', [...data.gallery, ...fileArray]);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function removeExistingGalleryImage(imagePath: string) {
        setData('remove_gallery', [...data.remove_gallery, imagePath]);
    }

    function removeNewGalleryImage(index: number) {
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
        setData(
            'gallery',
            data.gallery.filter((_, i) => i !== index),
        );
    }

    function handleTechnologyToggle(techId: number) {
        setData(
            'technologies',
            data.technologies.includes(techId)
                ? data.technologies.filter((id) => id !== techId)
                : [...data.technologies, techId],
        );
    }

    function generateSlug() {
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setData('slug', slug);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(projectsRoutes.update.url(project.id));
    }

    const existingGallery = (project.gallery ?? []).filter((img) => !data.remove_gallery.includes(img));

    return (
        <AppLayout>
            <Head title={`Editar: ${project.title}`} />

            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
                    <Link href={projectsRoutes.index.url()}>
                        <ArrowLeft className="size-4" />
                        Volver a proyectos
                    </Link>
                </Button>

                <div className="flex items-start gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 text-white shadow-lg">
                        <Code2 className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Proyecto</h1>
                        <p className="mt-2 text-sm text-muted-foreground">{project.title}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Basic Information */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 text-lg font-bold">Información Básica</h2>

                    <div className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <Label htmlFor="title">
                                    Título <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    onBlur={generateSlug}
                                    className="mt-2 rounded-xl"
                                />
                                {errors.title && <p className="mt-1.5 text-xs text-destructive">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="slug">
                                    Slug <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="mt-2 rounded-xl"
                                />
                                {errors.slug && <p className="mt-1.5 text-xs text-destructive">{errors.slug}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción Corta</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-2 min-h-[80px] rounded-xl"
                            />
                            {errors.description && <p className="mt-1.5 text-xs text-destructive">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="content">Contenido Detallado</Label>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-2 min-h-[200px] rounded-xl"
                            />
                            {errors.content && <p className="mt-1.5 text-xs text-destructive">{errors.content}</p>}
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <Label htmlFor="status">Estado</Label>
                                <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                    <SelectTrigger className="mt-2 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Borrador</SelectItem>
                                        <SelectItem value="in_progress">En progreso</SelectItem>
                                        <SelectItem value="completed">Completado</SelectItem>
                                        <SelectItem value="archived">Archivado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="mt-1.5 text-xs text-destructive">{errors.status}</p>}
                            </div>

                            <div className="flex items-end gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                    />
                                    <Label htmlFor="is_featured" className="cursor-pointer text-sm font-normal">
                                        Destacar
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer text-sm font-normal">
                                        Publicar
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 text-lg font-bold">Imágenes</h2>

                    <div className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Featured Image */}
                            <div>
                                <Label htmlFor="featured_image">Imagen Principal</Label>
                                <div className="mt-2">
                                    {featuredImagePreview ? (
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50">
                                            <img src={featuredImagePreview} alt="Preview" className="size-full object-cover" />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute right-2 top-2 size-8"
                                                onClick={() => {
                                                    setFeaturedImagePreview(null);
                                                    setData('featured_image', null);
                                                }}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : project.featured_image && !data.remove_featured_image ? (
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50">
                                            <img src={`/storage/${project.featured_image}`} alt="Current" className="size-full object-cover" />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute right-2 top-2 size-8"
                                                onClick={() => setData('remove_featured_image', true)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="featured_image"
                                            className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/30 transition-colors hover:border-border hover:bg-muted/50"
                                        >
                                            <ImageIcon className="size-8 text-muted-foreground/40" />
                                            <span className="mt-2 text-xs text-muted-foreground">Click para subir</span>
                                            <input
                                                id="featured_image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null, 'featured')}
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.featured_image && <p className="mt-1.5 text-xs text-destructive">{errors.featured_image}</p>}
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <Label htmlFor="thumbnail">Miniatura</Label>
                                <div className="mt-2">
                                    {thumbnailPreview ? (
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50">
                                            <img src={thumbnailPreview} alt="Preview" className="size-full object-cover" />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute right-2 top-2 size-8"
                                                onClick={() => {
                                                    setThumbnailPreview(null);
                                                    setData('thumbnail', null);
                                                }}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : project.thumbnail && !data.remove_thumbnail ? (
                                        <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50">
                                            <img src={`/storage/${project.thumbnail}`} alt="Current" className="size-full object-cover" />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute right-2 top-2 size-8"
                                                onClick={() => setData('remove_thumbnail', true)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="thumbnail"
                                            className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/30 transition-colors hover:border-border hover:bg-muted/50"
                                        >
                                            <ImageIcon className="size-8 text-muted-foreground/40" />
                                            <span className="mt-2 text-xs text-muted-foreground">Click para subir</span>
                                            <input
                                                id="thumbnail"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null, 'thumbnail')}
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.thumbnail && <p className="mt-1.5 text-xs text-destructive">{errors.thumbnail}</p>}
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <Label htmlFor="gallery">Galería de imágenes</Label>
                            <div className="mt-2">
                                <label
                                    htmlFor="gallery"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/30 p-8 transition-colors hover:border-border hover:bg-muted/50"
                                >
                                    <Upload className="size-8 text-muted-foreground/40" />
                                    <span className="mt-2 text-sm text-muted-foreground">Click o arrastra imágenes aquí</span>
                                    <span className="mt-1 text-xs text-muted-foreground/70">Puedes añadir más imágenes a la galería</span>
                                    <input
                                        id="gallery"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleGalleryChange(e.target.files)}
                                    />
                                </label>

                                {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
                                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                                        {/* Existing images */}
                                        {existingGallery.map((imagePath) => (
                                            <div key={imagePath} className="relative aspect-video overflow-hidden rounded-lg border border-border/50">
                                                <img src={`/storage/${imagePath}`} alt="Gallery" className="size-full object-cover" />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute right-1 top-1 size-6"
                                                    onClick={() => removeExistingGalleryImage(imagePath)}
                                                >
                                                    <X className="size-3" />
                                                </Button>
                                            </div>
                                        ))}

                                        {/* New images */}
                                        {galleryPreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative aspect-video overflow-hidden rounded-lg border border-border/50">
                                                <img src={preview} alt={`New ${index + 1}`} className="size-full object-cover" />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute right-1 top-1 size-6"
                                                    onClick={() => removeNewGalleryImage(index)}
                                                >
                                                    <X className="size-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.gallery && <p className="mt-1.5 text-xs text-destructive">{errors.gallery}</p>}
                        </div>
                    </div>
                </div>

                {/* URLs */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 text-lg font-bold">Enlaces</h2>

                    <div className="grid gap-5 md:grid-cols-3">
                        <div>
                            <Label htmlFor="demo_url">URL de Demo</Label>
                            <Input
                                id="demo_url"
                                type="url"
                                value={data.demo_url}
                                onChange={(e) => setData('demo_url', e.target.value)}
                                className="mt-2 rounded-xl"
                                placeholder="https://demo.example.com"
                            />
                            {errors.demo_url && <p className="mt-1.5 text-xs text-destructive">{errors.demo_url}</p>}
                        </div>

                        <div>
                            <Label htmlFor="github_url">URL de GitHub</Label>
                            <Input
                                id="github_url"
                                type="url"
                                value={data.github_url}
                                onChange={(e) => setData('github_url', e.target.value)}
                                className="mt-2 rounded-xl"
                                placeholder="https://github.com/usuario/repo"
                            />
                            {errors.github_url && <p className="mt-1.5 text-xs text-destructive">{errors.github_url}</p>}
                        </div>

                        <div>
                            <Label htmlFor="video_url">URL de Video</Label>
                            <Input
                                id="video_url"
                                type="url"
                                value={data.video_url}
                                onChange={(e) => setData('video_url', e.target.value)}
                                className="mt-2 rounded-xl"
                                placeholder="https://youtube.com/watch?v=..."
                            />
                            {errors.video_url && <p className="mt-1.5 text-xs text-destructive">{errors.video_url}</p>}
                        </div>
                    </div>
                </div>

                {/* Client & Dates */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 text-lg font-bold">Cliente y Fechas</h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <Label htmlFor="client_name">Nombre del Cliente</Label>
                            <Input
                                id="client_name"
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                                className="mt-2 rounded-xl"
                                placeholder="Ej: Empresa XYZ"
                            />
                            {errors.client_name && <p className="mt-1.5 text-xs text-destructive">{errors.client_name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="client_website">Sitio Web del Cliente</Label>
                            <Input
                                id="client_website"
                                type="url"
                                value={data.client_website}
                                onChange={(e) => setData('client_website', e.target.value)}
                                className="mt-2 rounded-xl"
                                placeholder="https://cliente.com"
                            />
                            {errors.client_website && <p className="mt-1.5 text-xs text-destructive">{errors.client_website}</p>}
                        </div>

                        <div>
                            <Label htmlFor="start_date">Fecha de Inicio</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="mt-2 rounded-xl"
                            />
                            {errors.start_date && <p className="mt-1.5 text-xs text-destructive">{errors.start_date}</p>}
                        </div>

                        <div>
                            <Label htmlFor="end_date">Fecha de Finalización</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="mt-2 rounded-xl"
                            />
                            {errors.end_date && <p className="mt-1.5 text-xs text-destructive">{errors.end_date}</p>}
                        </div>
                    </div>
                </div>

                {/* Technologies */}
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 text-lg font-bold">Tecnologías</h2>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                        {technologies.map((tech) => (
                            <label
                                key={tech.id}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 transition-all ${data.technologies.includes(tech.id)
                                    ? 'border-violet-500/50 bg-gradient-to-br from-violet-500/10 to-blue-500/10'
                                    : 'border-border/50 bg-background/50 hover:border-border'
                                    }`}
                            >
                                <Checkbox
                                    checked={data.technologies.includes(tech.id)}
                                    onCheckedChange={() => handleTechnologyToggle(tech.id)}
                                />
                                <span className="text-sm font-medium">{tech.name}</span>
                            </label>
                        ))}
                    </div>
                    {errors.technologies && <p className="mt-3 text-xs text-destructive">{errors.technologies}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg"
                    >
                        Guardar Cambios
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href={projectsRoutes.index.url()}>Cancelar</Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
