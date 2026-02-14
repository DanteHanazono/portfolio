<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- SEO Meta Tags --}}
        @php
            $seo = $page['props']['seo'] ?? [];
            $meta = $seo['meta'] ?? [];
            $og = $seo['openGraph'] ?? [];
            $twitter = $seo['twitter'] ?? [];
        @endphp

        <title inertia>{{ $meta['title'] ?? config('app.name') }}</title>

        @if(isset($meta['description']))
            <meta name="description" content="{{ $meta['description'] }}">
        @endif

        @if(isset($meta['keywords']))
            <meta name="keywords" content="{{ $meta['keywords'] }}">
        @endif

        @if(isset($meta['author']))
            <meta name="author" content="{{ $meta['author'] }}">
        @endif

        <meta name="robots" content="{{ $meta['robots'] ?? 'index, follow' }}">

        @if(isset($meta['canonical']))
            <link rel="canonical" href="{{ $meta['canonical'] }}">
        @endif

        {{-- Open Graph Meta Tags --}}
        @foreach($og as $property => $content)
            <meta property="og:{{ $property }}" content="{{ $content }}">
        @endforeach

        {{-- Twitter Card Meta Tags --}}
        @foreach($twitter as $name => $content)
            <meta name="twitter:{{ $name }}" content="{{ $content }}">
        @endforeach

        {{-- Structured Data --}}
        @if(isset($seo['structuredData']) && $seo['structuredData'])
            <script type="application/ld+json">
                {!! json_encode($seo['structuredData'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @endif

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
