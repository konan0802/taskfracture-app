<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Task extends Model
{
    public static function syncTasks($tasksData)
    {
        $newTaskIds = collect($tasksData)->pluck('id')->toArray();

        $existingTaskIds = DB::table('tasks')->pluck('id')->toArray();

        $deletedTaskIds = array_diff($existingTaskIds, $newTaskIds);

        foreach ($deletedTaskIds as $taskId) {
            DB::table('tasks')->where('id', $taskId)->delete();
        }

        $taskIndex = 0;
        foreach ($tasksData as $task) {
            DB::table('tasks')->updateOrInsert(
                ['id' => $task['id']],
                [
                    'name' => $task['name'] ?? null,
                    'is_parent' => true,
                    'status' => $task['status'] ?? 0,
                    'order' => $taskIndex
                ]
            );
            $taskIndex++;
            $parentTaskId = $task['id'];

            foreach ($task['children'] ?? [] as $subTask) {
                DB::table('tasks')->updateOrInsert(
                    ['id' => $subTask['id']],
                    [
                        'name' => $subTask['name'] ?? null,
                        'is_parent' => false,
                        'status' => $subTask['status'] ?? 0,
                        'parent_task_id' => $parentTaskId,
                        'order' => $taskIndex
                    ]
                );
                $taskIndex++;
            }
        }

        return $newTaskIds;
    }

    public static function getTasks()
    {
        $rows = DB::table('tasks')->orderBy('order', 'asc')->get()->toArray();
        $tasks = [];

        foreach ($rows as $row) {
            if ($row->is_parent) {
                $tasks[$row->id] = [
                    'id' => $row->id,
                    'name' => $row->name,
                    'isParent' => true,
                    'children' => []
                ];
            } else {
                $tasks[$row->parent_task_id]['children'][] = [
                    'id' => $row->id,
                    'name' => $row->name,
                    'isParent' => false,
                ];
            }
        }

        return array_values($tasks);
    }
}
