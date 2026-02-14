<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $sitemap = $this->generateSitemap();

        return response($sitemap, 200)
            ->header('Content-Type', 'application/xml');
    }

    private function generateSitemap(): string
    {
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>');

        // Páginas estáticas
        $this->addUrl($xml, route('home'), '1.0', 'daily');
        $this->addUrl($xml, route('about'), '0.8', 'weekly');
        $this->addUrl($xml, route('portfolio'), '0.9', 'daily');
        $this->addUrl($xml, route('habilidades'), '0.7', 'weekly');
        $this->addUrl($xml, route('testimonials'), '0.7', 'weekly');
        $this->addUrl($xml, route('contact.create'), '0.6', 'monthly');

        // Proyectos publicados
        $projects = Project::published()->get();

        foreach ($projects as $project) {
            $url = $this->addUrl(
                $xml,
                route('project.show', $project->slug),
                '0.8',
                'weekly',
                $project->updated_at
            );

            // Agregar imagen si existe
            if ($project->featured_image) {
                $image = $url->addChild('image:image', null, 'http://www.google.com/schemas/sitemap-image/1.1');
                $image->addChild('image:loc', asset('storage/'.$project->featured_image), 'http://www.google.com/schemas/sitemap-image/1.1');
                $image->addChild('image:title', htmlspecialchars($project->title), 'http://www.google.com/schemas/sitemap-image/1.1');
            }
        }

        return $xml->asXML();
    }

    private function addUrl(\SimpleXMLElement $xml, string $loc, string $priority, string $changefreq, ?\Carbon\Carbon $lastmod = null): \SimpleXMLElement
    {
        $url = $xml->addChild('url');
        $url->addChild('loc', htmlspecialchars($loc));
        $url->addChild('priority', $priority);
        $url->addChild('changefreq', $changefreq);

        if ($lastmod) {
            $url->addChild('lastmod', $lastmod->toW3cString());
        } else {
            $url->addChild('lastmod', now()->toW3cString());
        }

        return $url;
    }
}
