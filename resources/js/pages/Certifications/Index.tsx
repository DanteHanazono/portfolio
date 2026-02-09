import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Award,
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    MoreVertical,
    Calendar,
    Filter,
    X,
    ExternalLink,
    Shield,
} from 'lucide-react';
import type { Certification } from '@/types';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as certificationsRoutes from '@/routes/certifications';

type CertificationsIndexProps = {
    certifications: Certification[];
    filters: {
        status?: string;
        search?: string;
    };
};

export default function Index({ certifications, filters }: CertificationsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleFilter(key: string, value: string | undefined) {
        router.get(
            certificationsRoutes.index.url(),
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        handleFilter('search', search || undefined);
    }

    function clearFilters() {
        router.get(certificationsRoutes.index.url(), {}, { preserveState: true });
        setSearch('');
    }

    function handleDelete(certification: Certification) {
        if (confirm(`¿Estás seguro de eliminar "${certification.name}"?`)) {
            router.delete(certificationsRoutes.destroy.url(certification.id), {
                preserveScroll: true,
            });
        }
    }

    function getStatusInfo(cert: Certification) {
        if (cert.does_not_expire) {
            return { label: 'Sin vencimiento', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10' };
        }

        if (!cert.expiry_date) {
            return { label: 'Activa', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' };
        }

        const expiryDate = new Date(cert.expiry_date);
        const now = new Date();

        if (expiryDate < now) {
            return { label: 'Expirada', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10' };
        }

        return { label: 'Activa', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-500/10' };
    }

    const hasFilters = filters.status || filters.search;

    return (
        <AppLayout>
            <Head title="Certificaciones" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                            Certificaciones
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona tus certificaciones profesionales
                        </p>
                    </div>
                    <Button asChild className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                        <Link href={certificationsRoutes.create.url()}>
                            <Plus className="mr-2 size-4" />
                            Agregar Certificación
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
                                    placeholder="Buscar por nombre u organización..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <label className="mb-2 block text-sm font-medium">Estado</label>
                            <Select value={filters.status ?? 'all'} onValueChange={(value) => handleFilter('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="active">Activas</SelectItem>
                                    <SelectItem value="expired">Expiradas</SelectItem>
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

                {/* Certifications Grid */}
                {certifications.length === 0 ? (
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center shadow-xl backdrop-blur-sm">
                        <Award className="mx-auto mb-4 size-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">No hay certificaciones</h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                            {hasFilters
                                ? 'No se encontraron certificaciones con los filtros aplicados.'
                                : 'Comienza agregando tu primera certificación profesional.'}
                        </p>
                        {!hasFilters && (
                            <Button asChild className="bg-gradient-to-r from-violet-600 to-blue-600">
                                <Link href={certificationsRoutes.create.url()}>
                                    <Plus className="mr-2 size-4" />
                                    Agregar Certificación
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {certifications.map((cert) => {
                            const statusInfo = getStatusInfo(cert);
                            return (
                                <div
                                    key={cert.id}
                                    className="group rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            {cert.badge_image ? (
                                                <img
                                                    src={cert.badge_image}
                                                    alt={cert.name}
                                                    className="size-16 rounded-lg object-cover ring-2 ring-border/50"
                                                />
                                            ) : (
                                                <div className="flex size-16 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                                                    <Award className="size-8 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Badge className={`${statusInfo.bg} ${statusInfo.color} mb-2 border-0`}>
                                                    {statusInfo.label}
                                                </Badge>
                                                <h3 className="line-clamp-2 font-semibold">{cert.name}</h3>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="size-8 p-0">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={certificationsRoutes.show.url(cert.id)}>
                                                        <Eye className="mr-2 size-4" />
                                                        Ver
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={certificationsRoutes.edit.url(cert.id)}>
                                                        <Pencil className="mr-2 size-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                {cert.credential_url && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 size-4" />
                                                            Ver Credencial
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(cert)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 size-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <Shield className="mr-2 size-4" />
                                            <span>{cert.issuing_organization}</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="mr-2 size-4" />
                                            <span>Emitida: {new Date(cert.issue_date).toLocaleDateString('es')}</span>
                                        </div>
                                        {cert.expiry_date && !cert.does_not_expire && (
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="mr-2 size-4" />
                                                <span>Vence: {new Date(cert.expiry_date).toLocaleDateString('es')}</span>
                                            </div>
                                        )}
                                        {cert.credential_id && (
                                            <div className="mt-2 rounded-lg bg-muted/50 p-2 font-mono text-xs">
                                                ID: {cert.credential_id}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
