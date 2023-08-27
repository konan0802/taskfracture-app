// Immediately Invoked Function Expression (IIFE) to limit scope
(function () {
    // DOM elements
    const taskParentList = document.getElementById('task-parent-list');
    Sortable.create(taskParentList);

    // Event listeners
    document.addEventListener('DOMContentLoaded', loadTasks);
    document.addEventListener('dblclick', handleDoubleClick);

    function handleDoubleClick(event) {
        if (!taskParentList.contains(event.target)) {
            addParentTask();
        }
    }

    // General function to add a task (either parent or child)
    function addTask(taskList, targetElement, taskName, isParent, keyDownHandler) {
        const newTask = document.createElement('li');
        const taskDiv = Object.assign(document.createElement('div'), {
            className: isParent ? 'task-parent-div' : 'task-child-div'
        });
        const newTaskName = Object.assign(document.createElement('input'), {
            value: taskName,
            placeholder: 'Task Name'
        });
        newTaskName.addEventListener('keydown', keyDownHandler);
        taskDiv.appendChild(newTaskName);
        newTask.appendChild(taskDiv);

        if (isParent) {
            const newChildTaskList = Object.assign(document.createElement('ul'), {
                className: 'task-child-list'
            });
            newTask.appendChild(newChildTaskList);
            Sortable.create(newChildTaskList);
        }

        if (targetElement) {
            taskList.insertBefore(newTask, targetElement.nextSibling);
        } else {
            taskList.appendChild(newTask);
        }

        newTaskName.focus();
    }

    function addParentTask(targetElement, taskName = null) {
        addTask(taskParentList, targetElement, taskName, true, handleKeydownOnParent);
    }

    function addNewChildTask(taskListElement, targetElement = null, taskName = null) {
        addTask(taskListElement, targetElement, taskName, false, handleKeydownOnChild);
    }

    function findNextInput(currentLi) {
        let nextInput = null;

        const childList = currentLi.querySelector('ul');
        if (childList) {
            nextInput = childList.querySelector('input');
            if (nextInput) return nextInput;
        }

        let sibling = currentLi.nextSibling;
        while (sibling) {
            nextInput = sibling.querySelector('input');
            if (nextInput) return nextInput;
            sibling = sibling.nextSibling;
        }

        let parent = currentLi.parentNode.closest('li');
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

    function findPreviousInput(currentLi) {
        let prevInput = null;

        let sibling = currentLi.previousSibling;
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

        const parent = currentLi.parentNode.closest('li');
        if (parent) {
            prevInput = parent.querySelector('input');
            return prevInput;
        }

        return null;
    }

    function handleKeydownOnParent(event) {
        if (event.isComposing) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            addParentTask(event.target.parentNode);
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

    async function loadTasks() {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        let parentTaskDom = null;
        data.tasks.forEach(task => {
            if (task.task_type === 'parent') {
                parentTaskDom = addParentTask(null, task.name);
            } else {
                addNewChildTask(parentTaskDom.querySelector('.task-child-list'), null, task.name);
            }
        });
    }
})();
