import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Plus, SquarePen, Star, Trash2, Zap } from 'lucide-react';
import * as skillsRoutes from '@/routes/skills';
import type { Skill } from '@/types/portfolio';
import { useState } from 'react';

interface SkillsIndexProps {
    skills: Skill[];
    groupedSkills: Record<string, Skill[]>;
    categories: string[];
    filters: {
        category?: string;
        search?: string;
    };
}

export default function Index({ skills, groupedSkills, categories, filters }: SkillsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            skillsRoutes.index.url(),
            { search: searchTerm, category: selectedCategory },
            { preserveState: true }
        );
    }

    function handleDelete(skill: Skill) {
        if (!confirm(`¿Estás seguro de que deseas eliminar "${skill.name}"?`)) {
            return;
        }

        router.delete(skillsRoutes.destroy.url({ id: skill.id }));
    }

    function toggleHighlighted(skill: Skill) {
        router.post(skillsRoutes.toggleHighlighted.url({ skill: skill.id }));
    }

    const categoryGradients: Record<string, string> = {
        Frontend: 'from-blue-500 to-cyan-500',
        Backend: 'from-emerald-500 to-teal-500',
        DevOps: 'from-orange-500 to-amber-500',
        Database: 'from-violet-500 to-purple-500',
        Mobile: 'from-pink-500 to-rose-500',
        Tools: 'from-yellow-500 to-orange-500',
    };

    function getCategoryGradient(category: string): string {
        return categoryGradients[category] || 'from-violet-600 to-blue-600';
    }

    return (
        <AppLayout>
            <Head title="Habilidades" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Habilidades</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Gestiona tus habilidades técnicas y destacadas</p>
                    </div>
                    <Button asChild className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white">
                        <Link href={skillsRoutes.create.url()}>
                            <Plus className="size-4" />
                            Agregar Habilidad
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                        <Input
                            type="text"
                            placeholder="Buscar habilidades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="rounded-lg border border-input bg-background px-4 py-2"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <Button type="submit">Buscar</Button>
                        {(searchTerm || selectedCategory) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    router.get(skillsRoutes.index.url());
                                }}
                            >
                                Limpiar
                            </Button>
                        )}
                    </form>
                </div>

                {/* Skills by Category */}
                {Object.keys(groupedSkills).length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center">
                        <Zap className="mx-auto size-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No hay habilidades</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Comienza agregando tu primera habilidad técnica.</p>
                        <Button asChild className="mt-6">
                            <Link href={skillsRoutes.create.url()}>Agregar Habilidad</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category}>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${getCategoryGradient(category)}`} />
                                    <h2 className="text-xl font-bold">{category}</h2>
                                    <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${getCategoryGradient(category)}`} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {categorySkills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl"
                                        >
                                            <div className={`h-1.5 bg-gradient-to-r ${getCategoryGradient(category)}`} />
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {skill.icon && (
                                                                <span className="text-2xl">{skill.icon}</span>
                                                            )}
                                                            <h3 className="text-lg font-bold">{skill.name}</h3>
                                                        </div>
                                                        {skill.years_experience !== null && (
                                                            <p className="mt-2 text-sm text-muted-foreground">
                                                                {skill.years_experience} {skill.years_experience === 1 ? 'año' : 'años'} de experiencia
                                                            </p>
                                                        )}
                                                    </div>
                                                    {skill.is_highlighted && (
                                                        <Badge className="gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                                            <Star className="size-3 fill-current" />
                                                            Destacada
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                                                        <Link href={skillsRoutes.show.url({ id: skill.id })}>
                                                            <Eye className="size-3.5" />
                                                            Ver
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                                                        <Link href={skillsRoutes.edit.url({ id: skill.id })}>
                                                            <SquarePen className="size-3.5" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleHighlighted(skill)}
                                                        className="gap-1.5"
                                                    >
                                                        <Star className={skill.is_highlighted ? 'size-3.5 fill-current text-yellow-500' : 'size-3.5'} />
                                                        {skill.is_highlighted ? 'Quitar' : 'Destacar'}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(skill)}
                                                        className="gap-1.5 text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
