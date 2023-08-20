// タスクの読み込み
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    const taskList = document.getElementById('task-list');
    data.tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.textContent = task.name;
      taskList.appendChild(taskElement);
    });
}

// タスクの追加
async function addTask() {
    const newTask = {
        name: 'New Task',
        // ... その他のタスク情報
    };
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });
    const data = await response.json();
    if (data.message === 'Task added successfully!') {
        loadTasks();  // タスク一覧を更新
    }
}

// タスクの更新（ここでは仮実装）
async function updateTask(taskId, newPosition) {
// ここでAPIを呼び出してタスクを更新
}

// イベントリスナーの追加
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();  // ページ読み込み時にタスクを読み込む
    document.getElementById('add-task-button').addEventListener('click', addTask);  // タスク追加ボタン
    }
);

// ... 既存のコード

// タスク要素のドラッグ設定
function setDraggable(taskElement, taskId) {
    taskElement.draggable = true;
    taskElement.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', taskId);
    });
}
  
// タスクリストのドロップ設定
document.getElementById('task-list').addEventListener('dragover', function(event) {
    event.preventDefault();
});
  
document.getElementById('task-list').addEventListener('drop', function(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    // ここでAPIを呼び出してタスクの位置を更新
    updateTask(taskId, /* 新しい位置情報 */);
});
  
// タスクの読み込み関数を更新
async function loadTasks() {
    // ... 既存のコード
    data.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.textContent = task.name;
        setDraggable(taskElement, task.id);  // ドラッグ可能に設定
        taskList.appendChild(taskElement);
    });
}
