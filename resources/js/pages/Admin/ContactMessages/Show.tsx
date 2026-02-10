import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    Clock,
    Eye,
    Archive,
    Trash2,
    CheckCircle2,
    Send,
    Save,
    User,
} from 'lucide-react';
import type { ContactMessage, BreadcrumbItem } from '@/types';
import * as contactMessagesRoutes from '@/routes/admin/contact-messages';
import { Link } from '@inertiajs/react';

type ContactMessageShowProps = {
    message: ContactMessage;
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

const breadcrumbs = (messageId: number): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mensajes de Contacto',
        href: contactMessagesRoutes.index.url(),
    },
    {
        title: `Mensaje #${messageId}`,
        href: contactMessagesRoutes.show.url(messageId),
    },
];

export default function Show({ message }: ContactMessageShowProps) {
    const notesForm = useForm({
        admin_notes: message.admin_notes || '',
    });

    const replyForm = useForm({
        reply_message: '',
    });

    function handleMarkAsRead() {
        router.post(
            contactMessagesRoutes.markAsRead.url({ contactMessage: message.id }),
            {},
            { preserveScroll: true },
        );
    }

    function handleMarkAsReplied() {
        router.post(
            contactMessagesRoutes.markAsReplied.url({ contactMessage: message.id }),
            {},
            { preserveScroll: true },
        );
    }

    function handleArchive() {
        router.post(
            contactMessagesRoutes.archive.url({ contactMessage: message.id }),
            {},
            { preserveScroll: true },
        );
    }

    function handleDelete() {
        if (confirm(`¿Estás seguro de eliminar el mensaje de "${message.name}"?`)) {
            router.delete(contactMessagesRoutes.destroy.url(message.id));
        }
    }

    function handleUpdateNotes(e: React.FormEvent) {
        e.preventDefault();
        notesForm.post(contactMessagesRoutes.updateNotes.url({ contactMessage: message.id }), {
            preserveScroll: true,
            onSuccess: () => {
                // Mensaje de éxito viene del backend
            },
        });
    }

    function handleReply(e: React.FormEvent) {
        e.preventDefault();
        replyForm.post(contactMessagesRoutes.reply.url({ contactMessage: message.id }), {
            preserveScroll: true,
            onSuccess: () => {
                replyForm.reset();
            },
        });
    }

    const StatusIcon = statusConfig[message.status]?.icon || Mail;

    return (
        <AppLayout breadcrumbs={breadcrumbs(message.id)}>
            <Head title={`Mensaje de ${message.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="outline" size="icon">
                            <Link href={contactMessagesRoutes.index.url()}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Mensaje de {message.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Recibido el{' '}
                                {new Date(message.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {message.status !== 'read' && (
                            <Button variant="outline" onClick={handleMarkAsRead}>
                                <Eye className="mr-2 size-4" />
                                Marcar como leído
                            </Button>
                        )}
                        {message.status !== 'replied' && (
                            <Button variant="outline" onClick={handleMarkAsReplied}>
                                <CheckCircle2 className="mr-2 size-4" />
                                Marcar como respondido
                            </Button>
                        )}
                        {message.status !== 'archived' && (
                            <Button variant="outline" onClick={handleArchive}>
                                <Archive className="mr-2 size-4" />
                                Archivar
                            </Button>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Message Details - Left Side */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Status & Info Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>Información del Mensaje</CardTitle>
                                        <CardDescription>
                                            Detalles del remitente y el mensaje
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`${statusConfig[message.status]?.bg} ${statusConfig[message.status]?.color}`}
                                    >
                                        <StatusIcon className="mr-1 size-3" />
                                        {statusConfig[message.status]?.label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Contact Info */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Nombre</Label>
                                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 p-2">
                                            <User className="size-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{message.name}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Email</Label>
                                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 p-2">
                                            <Mail className="size-4 text-muted-foreground" />
                                            <a
                                                href={`mailto:${message.email}`}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                {message.email}
                                            </a>
                                        </div>
                                    </div>

                                    {message.phone && (
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">
                                                Teléfono
                                            </Label>
                                            <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 p-2">
                                                <Phone className="size-4 text-muted-foreground" />
                                                <a
                                                    href={`tel:${message.phone}`}
                                                    className="text-sm font-medium hover:underline"
                                                >
                                                    {message.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {message.company && (
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">
                                                Empresa
                                            </Label>
                                            <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 p-2">
                                                <Building2 className="size-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    {message.company}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Subject */}
                                {message.subject && (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Asunto</Label>
                                        <p className="rounded-md border border-border/50 bg-muted/50 p-3 text-sm font-medium">
                                            {message.subject}
                                        </p>
                                    </div>
                                )}

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Mensaje</Label>
                                    <div className="rounded-md border border-border/50 bg-muted/50 p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {message.message}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reply Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Responder Mensaje</CardTitle>
                                <CardDescription>
                                    Se enviará una respuesta al email del remitente
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleReply} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reply_message">Mensaje de respuesta</Label>
                                        <Textarea
                                            id="reply_message"
                                            value={replyForm.data.reply_message}
                                            onChange={(e) =>
                                                replyForm.setData('reply_message', e.target.value)
                                            }
                                            placeholder="Escribe tu respuesta aquí..."
                                            rows={6}
                                            className={
                                                replyForm.errors.reply_message
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        />
                                        {replyForm.errors.reply_message && (
                                            <p className="text-sm text-destructive">
                                                {replyForm.errors.reply_message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={replyForm.processing}
                                        className="w-full"
                                    >
                                        <Send className="mr-2 size-4" />
                                        {replyForm.processing ? 'Enviando...' : 'Enviar Respuesta'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Línea de Tiempo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-blue-500/10 p-2">
                                            <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="h-full w-px bg-border" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="text-sm font-medium">Mensaje recibido</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(message.created_at).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>

                                {message.read_at && (
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-yellow-500/10 p-2">
                                                <Eye className="size-4 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            {message.replied_at && (
                                                <div className="h-full w-px bg-border" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm font-medium">Mensaje leído</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(message.read_at).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {message.replied_at && (
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-emerald-500/10 p-2">
                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Mensaje respondido</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(message.replied_at).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Admin Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Notas del Administrador</CardTitle>
                                <CardDescription>
                                    Notas internas, no visibles para el usuario
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateNotes} className="space-y-4">
                                    <Textarea
                                        value={notesForm.data.admin_notes}
                                        onChange={(e) =>
                                            notesForm.setData('admin_notes', e.target.value)
                                        }
                                        placeholder="Agrega notas internas aquí..."
                                        rows={6}
                                        className={
                                            notesForm.errors.admin_notes ? 'border-destructive' : ''
                                        }
                                    />
                                    {notesForm.errors.admin_notes && (
                                        <p className="text-sm text-destructive">
                                            {notesForm.errors.admin_notes}
                                        </p>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={notesForm.processing}
                                        className="w-full"
                                        variant="secondary"
                                    >
                                        <Save className="mr-2 size-4" />
                                        {notesForm.processing ? 'Guardando...' : 'Guardar Notas'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
