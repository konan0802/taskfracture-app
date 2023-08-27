// 親タスクのドラッグ&ドロップを設定
const taskParentList = document.getElementById('task-parent-list');
Sortable.create(taskParentList);

// 親タスクを動的に追加する関数
function addParentTask(targetElement) {
    const taskParentList = document.getElementById('task-parent-list');

    const newParentTask = document.createElement('li');
    const newParentTaskName = Object.assign(document.createElement('input'), {
        placeholder: 'Task Name'
    });
    newParentTaskName.addEventListener('keydown', handleKeydownOnParent);

    newParentTask.appendChild(newParentTaskName);

    // 子タスクのリストを作成
    const newChildTaskList = Object.assign(document.createElement('ul'), {
        className: 'child-task-list'
    });

    // SortableJSを適用
    Sortable.create(newChildTaskList);

    newParentTask.appendChild(newChildTaskList);

    if (targetElement) {
        // Enterを押した親タスクの直後に新しい親タスクを挿入
        taskParentList.insertBefore(newParentTask, targetElement.parentNode.nextSibling);
    } else {
        // 親タスクリストの末尾に追加
        taskParentList.appendChild(newParentTask);
    }

    // フォーカスを新規親タスクに移動
    newParentTaskName.focus();
}

// 子タスクを動的に追加する関数
function addNewChildTask(taskListElement, targetElement) {

    const newChildTask = document.createElement('li');
    const newChildTaskName = Object.assign(document.createElement('input'), {
        placeholder: 'Task Name'
    });
    newChildTaskName.addEventListener('keydown', handleKeydownOnChild);

    newChildTask.appendChild(newChildTaskName);

    if (targetElement) {
        // Enterを押した子タスクの直後に新しい子タスクを挿入
        taskListElement.insertBefore(newChildTask, targetElement.parentNode.nextSibling);
    } else {
        // 子タスクリストの末尾に追加
        taskListElement.appendChild(newChildTask);
    }

    // フォーカスを新規子タスクに移動
    newChildTaskName.focus();
}

// 親タスクのinputでのキー操作をハンドルする関数
function handleKeydownOnParent(event) {
    if (event.key === 'Enter') {
        addParentTask(event.target);
    } else if (event.key === 'Tab') {
        event.preventDefault();
        const childTaskList = event.target.parentNode.querySelector('.child-task-list');
        if (childTaskList) {
            addNewChildTask(childTaskList);
        }
    }
}

// 新規に追加された子タスクのinputでのキー操作をハンドルする関数
function handleKeydownOnChild(event) {
    if (event.key === 'Enter') {
        const childTaskList = event.target.parentNode.parentNode;
        addNewChildTask(childTaskList, event.target);
    }
}

// ダブルクリックで親タスクを追加
document.addEventListener('dblclick', function(event) {
    const taskParentList = document.getElementById('task-parent-list');
    if (!taskParentList.contains(event.target)) {
        addParentTask();
    }
});

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