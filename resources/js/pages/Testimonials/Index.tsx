import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    MessageSquare,
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    MoreVertical,
    Star,
    Filter,
    X,
    User,
    Building2,
} from 'lucide-react';
import type { PaginatedData, Testimonial, Project } from '@/types';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as testimonialsRoutes from '@/routes/testimonials';

type TestimonialsIndexProps = {
    testimonials: PaginatedData<Testimonial>;
    projects: Project[];
    filters: {
        project?: string;
        rating?: string;
        search?: string;
    };
};

export default function Index({ testimonials, projects, filters }: TestimonialsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleFilter(key: string, value: string | undefined) {
        router.get(
            testimonialsRoutes.index.url(),
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        handleFilter('search', search || undefined);
    }

    function clearFilters() {
        router.get(testimonialsRoutes.index.url(), {}, { preserveState: true });
        setSearch('');
    }

    function handleDelete(testimonial: Testimonial) {
        if (confirm(`¿Estás seguro de eliminar el testimonio de "${testimonial.client_name}"?`)) {
            router.delete(testimonialsRoutes.destroy.url(testimonial.id), {
                preserveScroll: true,
            });
        }
    }

    function toggleFeatured(testimonial: Testimonial) {
        router.post(
            testimonialsRoutes.toggleFeatured.url({ testimonial: testimonial.id }),
            {},
            { preserveScroll: true },
        );
    }

    function togglePublished(testimonial: Testimonial) {
        router.post(
            testimonialsRoutes.togglePublished.url({ testimonial: testimonial.id }),
            {},
            { preserveScroll: true },
        );
    }

    const hasFilters = filters.project || filters.rating || filters.search;

    return (
        <AppLayout>
            <Head title="Testimonios" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                            Testimonios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona los testimonios de tus clientes
                        </p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                        <Link href={testimonialsRoutes.create.url()}>
                            <Plus className="mr-2 size-4" />
                            Agregar Testimonio
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium">Buscar</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por cliente o contenido..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-56">
                            <label className="mb-2 block text-sm font-medium">Proyecto</label>
                            <Select value={filters.project ?? 'all'} onValueChange={(value) => handleFilter('project', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los proyectos</SelectItem>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-40">
                            <label className="mb-2 block text-sm font-medium">Calificación</label>
                            <Select value={filters.rating ?? 'all'} onValueChange={(value) => handleFilter('rating', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                                    <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                                    <SelectItem value="3">⭐⭐⭐</SelectItem>
                                    <SelectItem value="2">⭐⭐</SelectItem>
                                    <SelectItem value="1">⭐</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">
                                <Filter className="mr-2 size-4" />
                                Filtrar
                            </Button>
                            {hasFilters && (
                                <Button type="button" variant="ghost" onClick={clearFilters}>
                                    <X className="mr-2 size-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Testimonials Grid */}
                {testimonials.data.length === 0 ? (
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center shadow-xl backdrop-blur-sm">
                        <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">No hay testimonios</h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                            {hasFilters
                                ? 'No se encontraron testimonios con los filtros aplicados.'
                                : 'Comienza agregando el primer testimonio de un cliente.'}
                        </p>
                        {!hasFilters && (
                            <Button asChild className="bg-gradient-to-r from-violet-600 to-blue-600">
                                <Link href={testimonialsRoutes.create.url()}>
                                    <Plus className="mr-2 size-4" />
                                    Agregar Testimonio
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {testimonials.data.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="group rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    {testimonial.client_avatar ? (
                                        <img
                                            src={testimonial.client_avatar}
                                            alt={testimonial.client_name}
                                            className="size-16 rounded-full object-cover ring-2 ring-border/50"
                                        />
                                    ) : (
                                        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                                            <User className="size-8 text-white" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <h3 className="font-semibold">{testimonial.client_name}</h3>
                                                    {testimonial.is_featured && (
                                                        <Badge className="border-0 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                                            <Star className="mr-1 size-3" />
                                                            Destacado
                                                        </Badge>
                                                    )}
                                                    {testimonial.is_published ? (
                                                        <Badge className="border-0 bg-green-500/10 text-green-700 dark:text-green-400">
                                                            Publicado
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="border-0 bg-gray-500/10 text-gray-700 dark:text-gray-400">
                                                            Borrador
                                                        </Badge>
                                                    )}
                                                </div>
                                                {testimonial.client_position && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {testimonial.client_position}
                                                        {testimonial.client_company && ` en ${testimonial.client_company}`}
                                                    </p>
                                                )}
                                                {testimonial.project && (
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Proyecto: {testimonial.project.title}
                                                    </p>
                                                )}
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="size-8 p-0">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={testimonialsRoutes.show.url(testimonial.id)}>
                                                            <Eye className="mr-2 size-4" />
                                                            Ver
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={testimonialsRoutes.edit.url(testimonial.id)}>
                                                            <Pencil className="mr-2 size-4" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => toggleFeatured(testimonial)}>
                                                        <Star className="mr-2 size-4" />
                                                        {testimonial.is_featured ? 'Quitar destacado' : 'Destacar'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => togglePublished(testimonial)}>
                                                        <MessageSquare className="mr-2 size-4" />
                                                        {testimonial.is_published ? 'Despublicar' : 'Publicar'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(testimonial)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Rating */}
                                        {testimonial.rating && (
                                            <div className="mb-3 flex items-center gap-1">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`size-4 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Testimonial Content */}
                                        <p className="line-clamp-3 text-sm text-muted-foreground">"{testimonial.content}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {testimonials.last_page > 1 && (
                            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 shadow-xl backdrop-blur-sm">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {testimonials.from} a {testimonials.to} de {testimonials.total} resultados
                                </div>
                                <div className="flex gap-2">
                                    {testimonials.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} preserveScroll>
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
