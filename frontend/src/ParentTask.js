import React from "react";
import { ReactSortable } from "react-sortablejs";
import ChildTask from "./ChildTask";

export default function ParentTask({
  task,
  addParentTask,
  updateTaskName,
  addChildTask,
  updateChildTasks,
  index,
  newTaskRef,
  focusedTaskId,
  setFocusedTaskId,
}) {
  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addParentTask(null, index + 1);
    }

    if (event.key === "Tab") {
      event.preventDefault();
      addChildTask(task.id);
    }
  };

  return (
    <li className="task-item">
      <div className="task-parent-div">
        <input
          ref={task.id === focusedTaskId ? newTaskRef : null}
          value={task.name}
          placeholder="Task Name"
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedTaskId(task.id)}
          onChange={(e) => updateTaskName(task.id, e.target.value)}
          rows="1"
        ></input>
      </div>
      <ReactSortable
        className="task-child-list"
        list={task.children}
        setList={(newChildren) => updateChildTasks(task.id, newChildren)} // Use the function here
      >
        {task.children.map((childTask, childIndex) => (
          <ChildTask
            key={childTask.id}
            task={childTask}
            addChildTask={addChildTask}
            parentId={task.id}
            index={childIndex}
            newTaskRef={newTaskRef}
            focusedTaskId={focusedTaskId}
            setFocusedTaskId={setFocusedTaskId}
            updateTaskName={updateTaskName}
          />
        ))}
      </ReactSortable>
    </li>
  );
}
