import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Award,
    Calendar,
    ExternalLink,
    Pencil,
    Shield,
    Trash2,
    Clock,
    Hash,
} from 'lucide-react';
import type { Certification } from '@/types';
import * as certificationsRoutes from '@/routes/certifications';

type ShowProps = {
    certification: Certification;
};

export default function Show({ certification }: ShowProps) {
    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar "${certification.name}"?`)) {
            router.delete(certificationsRoutes.destroy.url(certification.id), {
                onSuccess: () => router.visit(certificationsRoutes.index.url()),
            });
        }
    }

    function getStatusInfo() {
        if (certification.does_not_expire) {
            return {
                label: 'Sin vencimiento',
                color: 'text-emerald-700 dark:text-emerald-400',
                bg: 'bg-emerald-500/10',
                description: 'Esta certificación no tiene fecha de vencimiento',
            };
        }

        if (!certification.expiry_date) {
            return {
                label: 'Activa',
                color: 'text-blue-700 dark:text-blue-400',
                bg: 'bg-blue-500/10',
                description: 'Esta certificación está activa',
            };
        }

        const expiryDate = new Date(certification.expiry_date);
        const now = new Date();

        if (expiryDate < now) {
            return {
                label: 'Expirada',
                color: 'text-red-700 dark:text-red-400',
                bg: 'bg-red-500/10',
                description: `Expiró el ${expiryDate.toLocaleDateString('es')}`,
            };
        }

        const daysUntilExpiration = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
            label: 'Activa',
            color: 'text-blue-700 dark:text-blue-400',
            bg: 'bg-blue-500/10',
            description: `Expira en ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'día' : 'días'}`,
        };
    }

    const statusInfo = getStatusInfo();

    return (
        <AppLayout>
            <Head title={certification.name} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={certificationsRoutes.index.url()}>
                                <ArrowLeft className="mr-2 size-4" />
                                Volver
                            </Link>
                        </Button>
                        <div>
                            <h1 className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                                Certificación
                            </h1>
                            <p className="text-sm text-muted-foreground">Detalles de la certificación</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={certificationsRoutes.edit.url(certification.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-8 shadow-xl backdrop-blur-sm">
                    <div className="mb-8 flex items-start gap-6">
                        {certification.badge_image ? (
                            <img
                                src={certification.badge_image}
                                alt={certification.name}
                                className="size-32 rounded-xl object-cover ring-2 ring-border/50 shadow-lg"
                            />
                        ) : (
                            <div className="flex size-32 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                                <Award className="size-16 text-white" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex-1">
                                    <Badge className={`${statusInfo.bg} ${statusInfo.color} mb-3 border-0`}>
                                        {statusInfo.label}
                                    </Badge>
                                    <h2 className="mb-2 text-3xl font-bold">{certification.name}</h2>
                                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                                        <Shield className="size-5" />
                                        <span>{certification.issuing_organization}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
                            {certification.credential_url && (
                                <Button asChild className="mt-4" variant="outline" size="sm">
                                    <a href={certification.credential_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 size-4" />
                                        Ver Credencial
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* General Information */}
                        <div className="rounded-xl border border-border/50 bg-card p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Award className="size-5 text-violet-600" />
                                Información General
                            </h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Nombre</dt>
                                    <dd className="mt-1 text-sm">{certification.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Organización Emisora</dt>
                                    <dd className="mt-1 text-sm">{certification.issuing_organization}</dd>
                                </div>
                                {certification.credential_id && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">ID de Credencial</dt>
                                        <dd className="mt-1 font-mono text-sm">{certification.credential_id}</dd>
                                    </div>
                                )}
                                {certification.credential_url && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">URL de Credencial</dt>
                                        <dd className="mt-1 text-sm">
                                            <a
                                                href={certification.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:underline"
                                            >
                                                {certification.credential_url}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Dates & Status */}
                        <div className="rounded-xl border border-border/50 bg-card p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Calendar className="size-5 text-violet-600" />
                                Fechas y Estado
                            </h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Fecha de Emisión</dt>
                                    <dd className="mt-1 text-sm">
                                        {new Date(certification.issue_date).toLocaleDateString('es', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Fecha de Vencimiento</dt>
                                    <dd className="mt-1 text-sm">
                                        {certification.does_not_expire
                                            ? 'No expira'
                                            : certification.expiry_date
                                                ? new Date(certification.expiry_date).toLocaleDateString('es', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : 'No especificada'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Estado</dt>
                                    <dd className="mt-1">
                                        <Badge className={`${statusInfo.bg} ${statusInfo.color} border-0`}>
                                            {statusInfo.label}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Orden</dt>
                                    <dd className="mt-1 text-sm">{certification.order}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* System Information */}
                        <div className="rounded-xl border border-border/50 bg-card p-6 md:col-span-2">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <Clock className="size-5 text-violet-600" />
                                Información del Sistema
                            </h3>
                            <dl className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                                    <dd className="mt-1 font-mono text-sm">#{certification.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Creado</dt>
                                    <dd className="mt-1 text-sm">
                                        {new Date(certification.created_at).toLocaleString('es')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Última actualización</dt>
                                    <dd className="mt-1 text-sm">
                                        {new Date(certification.updated_at).toLocaleString('es')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
