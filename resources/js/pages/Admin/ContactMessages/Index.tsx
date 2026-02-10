import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Mail,
    Search,
    Filter,
    X,
    Eye,
    Archive,
    Trash2,
    Clock,
    CheckCircle2,
    MessageSquare,
    Building2,
} from 'lucide-react';
import type { PaginatedData, ContactMessage as ContactMessageType, BreadcrumbItem } from '@/types';
import { useState } from 'react';
import * as contactMessagesRoutes from '@/routes/admin/contact-messages';

type ContactMessagesIndexProps = {
    messages: PaginatedData<ContactMessageType>;
    statusCounts: {
        new: number;
        read: number;
        replied: number;
        archived: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    new: {
        label: 'Nuevo',
        color: 'text-blue-700 dark:text-blue-400',
        bg: 'bg-blue-500/10',
        icon: Mail,
    },
    read: {
        label: 'Leído',
        color: 'text-yellow-700 dark:text-yellow-400',
        bg: 'bg-yellow-500/10',
        icon: Eye,
    },
    replied: {
        label: 'Respondido',
        color: 'text-emerald-700 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        icon: CheckCircle2,
    },
    archived: {
        label: 'Archivado',
        color: 'text-gray-700 dark:text-gray-400',
        bg: 'bg-gray-500/10',
        icon: Archive,
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mensajes de Contacto',
        href: contactMessagesRoutes.index.url(),
    },
];

export default function Index({ messages, statusCounts, filters }: ContactMessagesIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleFilter(key: string, value: string | undefined) {
        router.get(
            contactMessagesRoutes.index.url(),
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, preserveScroll: true },
        );
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        handleFilter('search', search || undefined);
    }

    function clearFilters() {
        router.get(contactMessagesRoutes.index.url(), {}, { preserveState: true });
        setSearch('');
    }

    function handleDelete(message: ContactMessageType) {
        if (confirm(`¿Estás seguro de eliminar el mensaje de "${message.name}"?`)) {
            router.delete(contactMessagesRoutes.destroy.url(message.id), {
                preserveScroll: true,
            });
        }
    }

    const hasFilters = filters.status || filters.search;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mensajes de Contacto" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mensajes de Contacto</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona los mensajes recibidos desde el formulario de contacto
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-border/50 bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2.5">
                                <Mail className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{statusCounts.new}</p>
                                <p className="text-xs text-muted-foreground">Nuevos</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-500/10 p-2.5">
                                <Eye className="size-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{statusCounts.read}</p>
                                <p className="text-xs text-muted-foreground">Leídos</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-500/10 p-2.5">
                                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{statusCounts.replied}</p>
                                <p className="text-xs text-muted-foreground">Respondidos</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-card p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-500/10 p-2.5">
                                <Archive className="size-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{statusCounts.archived}</p>
                                <p className="text-xs text-muted-foreground">Archivados</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nombre, email, asunto o mensaje..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" size="icon" variant="secondary">
                            <Search className="size-4" />
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilter('status', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 size-4" />
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="new">Nuevos</SelectItem>
                                <SelectItem value="read">Leídos</SelectItem>
                                <SelectItem value="replied">Respondidos</SelectItem>
                                <SelectItem value="archived">Archivados</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasFilters && (
                            <Button variant="ghost" size="icon" onClick={clearFilters}>
                                <X className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Messages List */}
                <div className="space-y-3">
                    {messages.data.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/50 bg-muted/50 p-12 text-center">
                            <Mail className="mx-auto size-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">No hay mensajes</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'No se encontraron mensajes con los filtros aplicados'
                                    : 'Aún no has recibido ningún mensaje de contacto'}
                            </p>
                        </div>
                    ) : (
                        messages.data.map((message) => {
                            const StatusIcon = statusConfig[message.status]?.icon || Mail;
                            return (
                                <div
                                    key={message.id}
                                    className="group rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={contactMessagesRoutes.show.url(
                                                                message.id,
                                                            )}
                                                            className="font-semibold hover:underline"
                                                        >
                                                            {message.name}
                                                        </Link>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`${statusConfig[message.status]?.bg} ${statusConfig[message.status]?.color}`}
                                                        >
                                                            <StatusIcon className="mr-1 size-3" />
                                                            {statusConfig[message.status]?.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {message.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                {message.subject && (
                                                    <p className="font-medium">{message.subject}</p>
                                                )}
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {message.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {new Date(message.created_at).toLocaleDateString(
                                                        'es-ES',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                                {message.company && (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="size-3" />
                                                        {message.company}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={contactMessagesRoutes.show.url(message.id)}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(message)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {messages.data.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            Mostrando {messages.from} - {messages.to} de {messages.total} mensajes
                        </p>
                        <div className="flex gap-2">
                            {messages.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
