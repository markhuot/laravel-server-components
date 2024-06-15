<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return react('dashboard', [
        'tasks' => Task::get(),
    ]);
});

Route::post('tasks', function (Request $request) {
    sleep(2);
    $safe = $request->validate([
        'title' => 'required|string',
    ]);

    $task = new Task;
    $task->title = $safe['title'];
    $task->save();

    return response()->json(['status' => 'ok']);
});

Route::delete('tasks/{task}', function (Task $task) {
    sleep(2);
    $task->delete();

    return response()->json(['status' => 'ok']);
});

Route::get('tasks/{task}', function (Task $task) {
    return react('task', [
        'task' => $task,
    ]);
});
