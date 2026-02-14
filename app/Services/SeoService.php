<?php

namespace App\Services;

use Illuminate\Support\Facades\URL;

class SeoService
{
    private array $meta = [];

    private array $openGraph = [];

    private array $twitter = [];

    private ?array $structuredData = null;

    public function __construct()
    {
        $this->setDefaults();
    }

    private function setDefaults(): void
    {
        $siteName = config('app.name');
        $siteUrl = config('app.url');

        $this->meta = [
            'title' => $siteName,
            'description' => 'Desarrollador Web Full Stack especializado en Laravel, React y soluciones modernas.',
            'keywords' => 'desarrollador web, laravel, react, php, javascript, portfolio',
            'author' => $siteName,
            'robots' => 'index, follow',
            'canonical' => $siteUrl,
        ];

        $this->openGraph = [
            'type' => 'website',
            'url' => $siteUrl,
            'title' => $siteName,
            'description' => $this->meta['description'],
            'site_name' => $siteName,
            'locale' => 'es_ES',
        ];

        $this->twitter = [
            'card' => 'summary_large_image',
            'title' => $siteName,
            'description' => $this->meta['description'],
        ];
    }

    public function setTitle(string $title, bool $appendSiteName = true): self
    {
        $fullTitle = $appendSiteName ? "{$title} | ".config('app.name') : $title;

        $this->meta['title'] = $fullTitle;
        $this->openGraph['title'] = $fullTitle;
        $this->twitter['title'] = $fullTitle;

        return $this;
    }

    public function setDescription(string $description): self
    {
        $this->meta['description'] = $description;
        $this->openGraph['description'] = $description;
        $this->twitter['description'] = $description;

        return $this;
    }

    public function setKeywords(array|string $keywords): self
    {
        $this->meta['keywords'] = is_array($keywords) ? implode(', ', $keywords) : $keywords;

        return $this;
    }

    public function setCanonical(string $url): self
    {
        $this->meta['canonical'] = $url;
        $this->openGraph['url'] = $url;

        return $this;
    }

    public function setImage(string $imageUrl, ?string $alt = null): self
    {
        $fullImageUrl = str_starts_with($imageUrl, 'http')
            ? $imageUrl
            : URL::to($imageUrl);

        $this->openGraph['image'] = $fullImageUrl;
        $this->twitter['image'] = $fullImageUrl;

        if ($alt) {
            $this->openGraph['image:alt'] = $alt;
            $this->twitter['image:alt'] = $alt;
        }

        return $this;
    }

    public function setType(string $type): self
    {
        $this->openGraph['type'] = $type;

        return $this;
    }

    public function setTwitterCard(string $card = 'summary_large_image'): self
    {
        $this->twitter['card'] = $card;

        return $this;
    }

    public function setAuthor(string $author): self
    {
        $this->meta['author'] = $author;

        return $this;
    }

    public function noIndex(): self
    {
        $this->meta['robots'] = 'noindex, nofollow';

        return $this;
    }

    public function setStructuredData(array $data): self
    {
        $this->structuredData = $data;

        return $this;
    }

    public function addStructuredData(string $type, array $properties): self
    {
        $data = [
            '@context' => 'https://schema.org',
            '@type' => $type,
        ];

        $this->structuredData = array_merge($data, $properties);

        return $this;
    }

    public function getMeta(): array
    {
        return $this->meta;
    }

    public function getOpenGraph(): array
    {
        return $this->openGraph;
    }

    public function getTwitter(): array
    {
        return $this->twitter;
    }

    public function getStructuredData(): ?array
    {
        return $this->structuredData;
    }

    public function toArray(): array
    {
        return [
            'meta' => $this->meta,
            'openGraph' => $this->openGraph,
            'twitter' => $this->twitter,
            'structuredData' => $this->structuredData,
        ];
    }

    public static function forProject($project): self
    {
        $seo = new self;

        $seo->setTitle($project->title)
            ->setDescription($project->description)
            ->setType('article')
            ->setCanonical(route('project.show', $project->slug));

        if ($project->featured_image) {
            $seo->setImage(
                asset('storage/'.$project->featured_image),
                $project->title
            );
        }

        $keywords = $project->technologies->pluck('name')->toArray();
        if (! empty($keywords)) {
            $seo->setKeywords($keywords);
        }

        $seo->addStructuredData('Article', [
            'headline' => $project->title,
            'description' => $project->description,
            'datePublished' => $project->published_at?->toIso8601String(),
            'dateModified' => $project->updated_at->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $project->user->name ?? config('app.name'),
            ],
        ]);

        return $seo;
    }

    public static function forHome(): self
    {
        $seo = new self;

        $seo->setTitle('Inicio', false)
            ->setDescription('Portfolio de desarrollo web profesional. Especializado en Laravel, React, y soluciones full-stack modernas.')
            ->setCanonical(route('home'))
            ->setKeywords(['desarrollador full stack', 'laravel', 'react', 'portfolio', 'desarrollo web']);

        $seo->addStructuredData('Person', [
            'name' => config('app.name'),
            'jobTitle' => 'Desarrollador Web Full Stack',
            'url' => config('app.url'),
        ]);

        return $seo;
    }

    public static function forPortfolio(): self
    {
        $seo = new self;

        $seo->setTitle('Portfolio')
            ->setDescription('Explora mis proyectos de desarrollo web, desde aplicaciones Laravel hasta interfaces React modernas.')
            ->setCanonical(route('portfolio'))
            ->setKeywords(['proyectos web', 'portfolio', 'desarrollo', 'laravel', 'react']);

        return $seo;
    }
}
