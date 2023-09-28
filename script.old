// 即時実行関数でスコープを限定
(function () {
    const taskState = [];  // State to store tasks
    let taskIdCounter = 0; // Counter to generate unique task IDs

    // DOM要素の取得とドラッグ&ドロップの設定
    const parentTaskList = document.getElementById('task-parent-list');
    Sortable.create(parentTaskList, {
        onUpdate: function (evt) {
            // Update the taskState when the order changes
            updateTaskStateOrder();
        }
    });

    // イベントリスナーの追加
    document.addEventListener('DOMContentLoaded', loadTasksFromServer);
    document.addEventListener('dblclick', handleDoubleClickOutsideTaskList);

    // Update the order of tasks in the taskState
    function updateTaskStateOrder() {
        Array.from(parentTaskList.querySelectorAll('li')).forEach((taskElement, index) => {
            const taskId = parseInt(taskElement.getAttribute('data-id'));
            const task = taskState.find(t => t.id === taskId);
            if (task) {
                task.order = index;
            }
        });
    }

    // タスクリストの外側でダブルクリックされた場合の処理
    function handleDoubleClickOutsideTaskList(event) {
        if (!parentTaskList.contains(event.target)) {
            addParentTask();
        }
    }

    // 親タスクまたは子タスクを追加する一般的な関数
    function addTask(taskList, referenceElement, taskTitle, isParent, keyEventHandler) {
        const newTask = document.createElement('li');
        const taskDiv = Object.assign(document.createElement('div'), {
            className: isParent ? 'task-parent-div' : 'task-child-div'
        });
        const newTaskName = Object.assign(document.createElement('input'), {
            value: taskTitle,
            placeholder: 'Task Name'
        });
        newTaskName.addEventListener('keydown', keyEventHandler);
        taskDiv.appendChild(newTaskName);
        newTask.appendChild(taskDiv);

        // Generate a new task ID and set it as a data attribute
        const newTaskId = ++taskIdCounter;
        newTask.setAttribute('data-id', newTaskId);

        // Add new task to the taskState
        taskState.push({
            id: newTaskId,
            name: taskTitle,
            isParent: isParent,
            order: taskList.children.length // The initial order is the last
        });

        if (isParent) {
            const newChildTaskList = Object.assign(document.createElement('ul'), {
                className: 'task-child-list'
            });
            newTask.appendChild(newChildTaskList);
            Sortable.create(newChildTaskList);
        }

        if (referenceElement) {
            taskList.insertBefore(newTask, referenceElement.nextSibling);
        } else {
            taskList.appendChild(newTask);
        }

        newTaskName.focus();
        return newTask;
    }

    // 親タスクを追加する関数
    function addParentTask(referenceElement, taskTitle = null) {
        return addTask(parentTaskList, referenceElement, taskTitle, true, handleKeydownOnParent);
    }

    // 子タスクを追加する関数
    function addNewChildTask(parentTaskElement, referenceElement = null, taskTitle = null) {
        return addTask(parentTaskElement, referenceElement, taskTitle, false, handleKeydownOnChild);
    }

    // サーバーからタスクを読み込む関数
    async function loadTasksFromServer() {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        let currentParentTaskElement = null;
        data.tasks.forEach(task => {
            if (task.task_type === 'parent') {
                currentParentTaskElement = addParentTask(null, task.name);
            } else {
                addNewChildTask(currentParentTaskElement.querySelector('.task-child-list'), null, task.name);
            }
        });
    }

    // 親タスクの入力でのキー操作を処理する関数
    function handleKeydownOnParent(event) {
        if (event.isComposing) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            addParentTask(event.target.parentNode.parentNode);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            const childTaskList = event.target.parentNode.parentNode.querySelector('.task-child-list');
            if (childTaskList) {
                addNewChildTask(childTaskList);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevInput = findPreviousInput(event.target.parentNode.parentNode);
            if (prevInput) prevInput.focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextInput = findNextInput(event.target.parentNode.parentNode);
            if (nextInput) nextInput.focus();
        }
    }

    // 子タスクの入力でのキー操作を処理する関数
    function handleKeydownOnChild(event) {
        if (event.isComposing) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            const childTaskList = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('.task-child-list');
            addNewChildTask(childTaskList, event.target.parentNode.parentNode);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevInput = findPreviousInput(event.target.parentNode.parentNode);
            if (prevInput) prevInput.focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextInput = findNextInput(event.target.parentNode.parentNode);
            if (nextInput) nextInput.focus();
        }
    }

    // 次の入力要素（input）を見つける関数
    function findNextInput(currentListItem) {
        let nextInput = null;

        const childList = currentListItem.querySelector('ul');
        if (childList) {
            nextInput = childList.querySelector('input');
            if (nextInput) return nextInput;
        }

        let sibling = currentListItem.nextSibling;
        while (sibling) {
            nextInput = sibling.querySelector('input');
            if (nextInput) return nextInput;
            sibling = sibling.nextSibling;
        }

        let parent = currentListItem.parentNode.closest('li');
        while (parent) {
            sibling = parent.nextSibling;
            while (sibling) {
                nextInput = sibling.querySelector('input');
                if (nextInput) return nextInput;
                sibling = sibling.nextSibling;
            }
            parent = parent.parentNode.closest('li');
        }

        return null;
    }

    // 前の入力要素（input）を見つける関数
    function findPreviousInput(currentListItem) {
        let prevInput = null;

        let sibling = currentListItem.previousSibling;
        while (sibling) {
            const lastChild = sibling.querySelector('ul') ? sibling.querySelector('ul').lastElementChild : null;
            if (lastChild) {
                prevInput = lastChild.querySelector('input');
                if (prevInput) return prevInput;
            }

            prevInput = sibling.querySelector('input');
            if (prevInput) return prevInput;
            sibling = sibling.previousSibling;
        }

        const parent = currentListItem.parentNode.closest('li');
        if (parent) {
            prevInput = parent.querySelector('input');
            return prevInput;
        }

        return null;
    }
})();
