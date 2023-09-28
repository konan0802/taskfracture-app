<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task; // Taskモデルを使用します。

class TaskController extends Controller
{
    public function getTasks()
    {
        $tasks = Task::all(); // すべてのタスクを取得します。
        return response()->json(['tasks' => $tasks]);
    }

    public function syncTasks(Request $request)
    {
        $parentTasksData = $request->input('tasks', []);
        
        // ログ出力
        \Log::info('parent_tasks_data: '. json_encode($parentTasksData));
        
        $taskIds = Task::syncTasks($parentTasksData); // タスクの同期を行います。
        
        return response()->json(['status' => 'success', 'taskIds' => $taskIds]);
    }
}
