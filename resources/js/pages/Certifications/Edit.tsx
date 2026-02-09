import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Award, Upload, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import type { Certification } from '@/types';
import * as certificationsRoutes from '@/routes/certifications';
import { Checkbox } from '@/components/ui/checkbox';

type EditProps = {
    certification: Certification;
};

export default function Edit({ certification }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: certification.name,
        issuing_organization: certification.issuing_organization,
        credential_id: certification.credential_id ?? '',
        credential_url: certification.credential_url ?? '',
        badge_image: null as File | null,
        remove_badge: false,
        issue_date: certification.issue_date,
        expiry_date: certification.expiry_date ?? '',
        does_not_expire: certification.does_not_expire,
        order: certification.order,
        _method: 'PUT',
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(certificationsRoutes.update.url(certification.id));
    };

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setData('badge_image', file);
            setData('remove_badge', false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function removeImage() {
        setData('badge_image', null);
        setData('remove_badge', true);
        setPreview(null);
    }

    const currentBadge = certification.badge_image && !data.remove_badge ? certification.badge_image : null;

    return (
        <AppLayout>
            <Head title={`Editar ${certification.name}`} />

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
                                Editar Certificación
                            </h1>
                            <p className="text-sm text-muted-foreground">{certification.name}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                            <Award className="size-5 text-violet-600" />
                            Información Básica
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Label htmlFor="name">Nombre de la Certificación *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="AWS Certified Solutions Architect"
                                    className="mt-1"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="issuing_organization">Organización Emisora *</Label>
                                <Input
                                    id="issuing_organization"
                                    value={data.issuing_organization}
                                    onChange={(e) => setData('issuing_organization', e.target.value)}
                                    placeholder="Amazon Web Services"
                                    className="mt-1"
                                />
                                <InputError message={errors.issuing_organization} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="credential_id">ID de Credencial</Label>
                                <Input
                                    id="credential_id"
                                    value={data.credential_id}
                                    onChange={(e) => setData('credential_id', e.target.value)}
                                    placeholder="ABC123XYZ"
                                    className="mt-1"
                                />
                                <InputError message={errors.credential_id} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="credential_url">URL de Credencial</Label>
                                <Input
                                    id="credential_url"
                                    type="url"
                                    value={data.credential_url}
                                    onChange={(e) => setData('credential_url', e.target.value)}
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                                <InputError message={errors.credential_url} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Badge Image */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                            <Upload className="size-5 text-violet-600" />
                            Insignia de la Certificación
                        </h2>

                        <div className="space-y-4">
                            {preview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="size-32 rounded-lg object-cover ring-2 ring-border/50"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeImage}
                                        className="absolute -right-2 -top-2 size-8 rounded-full p-0"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : currentBadge ? (
                                <div className="relative inline-block">
                                    <img
                                        src={currentBadge}
                                        alt={certification.name}
                                        className="size-32 rounded-lg object-cover ring-2 ring-border/50"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeImage}
                                        className="absolute -right-2 -top-2 size-8 rounded-full p-0"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Label htmlFor="badge_image">Imagen de Insignia</Label>
                                    <Input
                                        id="badge_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1"
                                    />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Formatos aceptados: JPG, PNG, WEBP. Máximo 2MB.
                                    </p>
                                </div>
                            )}
                            <InputError message={errors.badge_image} className="mt-2" />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
                        <h2 className="mb-6 text-xl font-semibold">Fechas</h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="issue_date">Fecha de Emisión *</Label>
                                <Input
                                    id="issue_date"
                                    type="date"
                                    value={data.issue_date}
                                    onChange={(e) => setData('issue_date', e.target.value)}
                                    className="mt-1"
                                />
                                <InputError message={errors.issue_date} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="expiry_date">Fecha de Vencimiento</Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    disabled={data.does_not_expire}
                                    className="mt-1"
                                />
                                <InputError message={errors.expiry_date} className="mt-2" />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="does_not_expire"
                                    checked={data.does_not_expire}
                                    onCheckedChange={(checked) => {
                                        setData('does_not_expire', checked as boolean);
                                        if (checked) {
                                            setData('expiry_date', '');
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor="does_not_expire"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Esta certificación no expira
                                </Label>
                            </div>

                            <div>
                                <Label htmlFor="order">Orden de visualización</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="mt-1"
                                />
                                <InputError message={errors.order} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={certificationsRoutes.index.url()}>Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                        >
                            <Save className="mr-2 size-4" />
                            {processing ? 'Guardando...' : 'Actualizar Certificación'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
