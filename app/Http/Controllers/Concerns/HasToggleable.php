<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;

trait HasToggleable
{
    protected function toggleAttribute(Model $model, string $attribute, ?string $successMessage = null): RedirectResponse
    {
        $message = $successMessage ?? "Estado de {$attribute} actualizado";

        $model->update([
            $attribute => ! $model->{$attribute},
        ]);

        return back()->with('success', $message);
    }
}
