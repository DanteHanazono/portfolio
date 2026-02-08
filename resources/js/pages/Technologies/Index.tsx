import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowUpDown,
    Code2,
    Cpu,
    Edit,
    Eye,
    Filter,
    Folder,
    Plus,
    Search,
    Star,
    X,
} from 'lucide-react';
import type { PaginatedData, Technology } from '@/types';
import { useState } from 'react';
import * as technologiesRoutes from '@/routes/technologies';

type TechnologiesIndexProps = {
    technologies: PaginatedData<Technology & { projects_count?: number }>;
    types: string[];
    filters: {
        type?: string;
        search?: string;
    };
};

export default function Index({ technologies, types, filters }: TechnologiesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            technologiesRoutes.index.url(),
            { search, type: type || undefined },
            { preserveState: true, preserveScroll: true }
        );
    }

    function clearFilters() {
        setSearch('');
        setType('');
        router.get(technologiesRoutes.index.url());
    }

    function toggleFeatured(id: number) {
        router.post(technologiesRoutes.toggleFeatured.url(id), {}, { preserveScroll: true });
    }

    const hasFilters = filters.search || filters.type;

    return (
        <AppLayout>
            <Head title="Tecnologías" />

            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Tecnologías</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestiona las tecnologías y herramientas de tu portafolio
                        </p>
                    </div>
                    <Button asChild className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/30">
                        <Link href={technologiesRoutes.create.url()}>
                            <Plus className="size-4" />
                            Nueva Tecnología
                        </Link>
                    </Button>
                </div>

                {/* Filters Section */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar tecnologías..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="mr-2 size-4" />
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {types.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button type="submit" className="gap-2">
                                <Search className="size-4" />
                                Buscar
                            </Button>
                            {hasFilters && (
                                <Button type="button" variant="outline" onClick={clearFilters} className="gap-2">
                                    <X className="size-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Technologies Grid */}
                {technologies.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {technologies.data.map((technology) => (
                                <div
                                    key={technology.id}
                                    className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-border hover:shadow-2xl"
                                >
                                    {/* Icon/Visual */}
                                    <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10">
                                        <div
                                            className="flex size-20 items-center justify-center rounded-2xl transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundColor: (technology.color || '#10B981') + '20' }}
                                        >
                                            <Cpu
                                                className="size-10"
                                                style={{ color: technology.color || '#10B981' }}
                                            />
                                        </div>

                                        {/* Featured Badge */}
                                        {technology.is_featured && (
                                            <div className="absolute right-3 top-3">
                                                <Badge className="gap-1.5 bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white">
                                                    <Star className="size-3" />
                                                    Destacada
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        {technology.type && (
                                            <div className="absolute left-3 top-3">
                                                <Badge variant="outline" className="border-white/20 bg-black/30 text-xs text-white backdrop-blur-sm">
                                                    {technology.type}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <h3 className="flex-1 text-lg font-bold">{technology.name}</h3>
                                            {technology.projects_count !== undefined && technology.projects_count > 0 && (
                                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                    <Folder className="size-3" />
                                                    {technology.projects_count}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-1.5"
                                            >
                                                <Link href={technologiesRoutes.show.url(technology.id)}>
                                                    <Eye className="size-4" />
                                                    Ver
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-1.5"
                                            >
                                                <Link href={technologiesRoutes.edit.url(technology.id)}>
                                                    <Edit className="size-4" />
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleFeatured(technology.id)}
                                                className="gap-1.5"
                                            >
                                                <Star
                                                    className={`size-4 ${technology.is_featured ? 'fill-current text-violet-500' : ''}`}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {technologies.last_page > 1 && (
                            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {technologies.from} - {technologies.to} de {technologies.total} tecnologías
                                </p>
                                <div className="flex gap-2">
                                    {technologies.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-2xl border border-border/50 bg-card/50 py-20 text-center backdrop-blur-sm">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-muted/50">
                            <Cpu className="size-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="mt-6 text-lg font-bold">No se encontraron tecnologías</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {hasFilters
                                ? 'Intenta ajustar los filtros para ver más resultados.'
                                : 'Comienza creando tu primera tecnología.'}
                        </p>
                        {hasFilters ? (
                            <Button variant="outline" onClick={clearFilters} className="mt-6 gap-2">
                                <X className="size-4" />
                                Limpiar filtros
                            </Button>
                        ) : (
                            <Button asChild className="mt-6 gap-2">
                                <Link href={technologiesRoutes.create.url()}>
                                    <Plus className="size-4" />
                                    Nueva Tecnología
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
