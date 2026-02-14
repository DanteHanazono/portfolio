<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaSeO
{
    public function handle(Request $request, Closure $next): Response
    {
        Inertia::share([
            'seo' => fn () => $request->attributes->get('seo', [
                'meta' => [
                    'title' => config('app.name'),
                    'description' => 'Portfolio profesional de desarrollo web',
                ],
            ]),
        ]);

        return $next($request);
    }
}
