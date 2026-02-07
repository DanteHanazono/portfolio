import { Link, usePage } from '@inertiajs/react';
import { index as homeAction, about, portfolio, skills, testimonials } from '@/actions/App/Http/Controllers/HomeController';
import { create as contactCreate } from '@/actions/App/Http/Controllers/ContactMessageController';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Inicio', href: homeAction },
    { name: 'Sobre Mí', href: about },
    { name: 'Portafolio', href: portfolio },
    { name: 'Habilidades', href: skills },
    { name: 'Testimonios', href: testimonials },
    { name: 'Contacto', href: contactCreate },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function isActive(routeFn: () => { url: string }): boolean {
        const routeUrl = routeFn().url;
        if (routeUrl === '/') {
            return url === '/';
        }
        return url.startsWith(routeUrl);
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <Link href={homeAction().url} className="text-xl font-bold tracking-tight">
                        Portfolio
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href().url}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive(item.href)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </nav>

                {mobileMenuOpen && (
                    <div className="border-t border-border md:hidden">
                        <div className="space-y-1 px-4 py-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href().url}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                        isActive(item.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border bg-muted/30">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-lg font-semibold">Portfolio</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Desarrollador apasionado por crear soluciones digitales innovadoras y experiencias web excepcionales.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider">Navegación</h3>
                            <ul className="mt-3 space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href().url}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider">Contacto</h3>
                            <p className="mt-3 text-sm text-muted-foreground">
                                ¿Tienes un proyecto en mente?
                            </p>
                            <Link
                                href={contactCreate().url}
                                className="mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                Envíame un mensaje &rarr;
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Portfolio. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
