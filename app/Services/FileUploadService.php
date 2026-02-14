<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function __construct(
        private string $disk = 'public'
    ) {}

    public function upload(UploadedFile $file, string $path): string
    {
        return $file->store($path, $this->disk);
    }

    public function uploadMultiple(array $files, string $path): array
    {
        $paths = [];

        foreach ($files as $file) {
            $paths[] = $this->upload($file, $path);
        }

        return $paths;
    }

    public function delete(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        return Storage::disk($this->disk)->delete($path);
    }

    public function deleteMultiple(array $paths): bool
    {
        if (empty($paths)) {
            return false;
        }

        return Storage::disk($this->disk)->delete($paths);
    }

    public function replaceFile(?string $oldPath, UploadedFile $newFile, string $storagePath): string
    {
        $this->delete($oldPath);

        return $this->upload($newFile, $storagePath);
    }

    public function handleFileUpdate(?string $currentPath, ?UploadedFile $newFile, bool $shouldRemove, string $storagePath): ?string
    {
        if ($shouldRemove && $currentPath) {
            $this->delete($currentPath);

            return null;
        }

        if ($newFile) {
            return $this->replaceFile($currentPath, $newFile, $storagePath);
        }

        return $currentPath;
    }
}
