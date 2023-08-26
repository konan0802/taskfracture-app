const taskParentList = document.getElementById('task-parent-list');
Sortable.create(taskParentList);

// 親タスクを動的に追加する関数
function addParentTask() {
    const taskParentList = document.getElementById('task-parent-list');
    const newParentTask = document.createElement('li');
    
    const taskName = Object.assign(document.createElement('input'), {
        value: 'Task Name',
        placeholder: 'Task Name'
    });
    newParentTask.appendChild(taskName);

    // 子タスクのリストを作成
    const newChildTaskList = Object.assign(document.createElement('ul'), {
        className: 'child-task-list'
    });
    
    // SortableJSを適用
    Sortable.create(newChildTaskList);

    // ボタンを追加して子タスクを生成できるようにする
    const addChildButton = document.createElement('button');
    addChildButton.innerText = '子タスク追加';
    addChildButton.addEventListener('click', () => addNewChildTask(newChildTaskList));

    newParentTask.appendChild(newChildTaskList);
    newParentTask.appendChild(addChildButton);
    taskParentList.appendChild(newParentTask);
}

// 子タスクを動的に追加する関数
function addNewChildTask(taskListElement) {
    const newChildTask = document.createElement('li');
    newChildTask.innerText = '新規子タスク';
    taskListElement.appendChild(newChildTask);
}

// 親タスク追加ボタンにイベントリスナーを設定
document.getElementById('add-parent-task').addEventListener('click', addParentTask);

// タスクの読み込み
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    const taskUl = document.getElementById('task-list');
    data.tasks.forEach(task => {
      const taskName = document.createElement('input');
      taskName.value = task.name;
      taskName.placeholder = "Task Name";
      taskLi.appendChild(taskName);
      if (task.parent_task_id == null) {
        taskLi.className = 'parent';
      } else {
        taskLi.className = 'child';
      }
      taskUl.appendChild(taskLi);
    });
}

// イベントリスナーの追加
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    }
);


/*
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
*/