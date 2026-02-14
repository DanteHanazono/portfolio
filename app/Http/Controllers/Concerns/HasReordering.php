<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

trait HasReordering
{
    protected function reorderItems(Request $request, string $itemsKey, string $modelClass): RedirectResponse
    {
        $validated = $request->validate([
            $itemsKey => 'required|array',
            "{$itemsKey}.*.id" => "required|exists:{$this->getTableName($modelClass)},id",
            "{$itemsKey}.*.order" => 'required|integer',
        ]);

        foreach ($validated[$itemsKey] as $item) {
            $modelClass::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Orden actualizado exitosamente');
    }

    private function getTableName(string $modelClass): string
    {
        return (new $modelClass)->getTable();
    }
}
