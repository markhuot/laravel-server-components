<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return react('dashboard', [
        'tasks' => [
            ['id' => '1', 'title' => 'one'],
            ['id' => '2', 'title' => 'two'],
            ['id' => '3', 'title' => 'three'],
        ]
    ]);
});

Route::post('tasks', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'title' => 'required|string',
    ]);

    return response()->json(['status' => 'ok']);
});
