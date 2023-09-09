import React from "react";
import { ReactSortable } from "react-sortablejs";
import ChildTask from "./ChildTask";

export default function ParentTask({
  task,
  addParentTask,
  addChildTask,
  index,
  newTaskRef,
  focusedTaskId,
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
        ></input>
      </div>
      <ReactSortable
        className="task-child-list"
        list={task.children}
        setList={(newChildren) => ({ ...task, children: newChildren })}
      >
        {task.children.map((childTask) => (
          <ChildTask
            key={childTask.id}
            task={childTask}
            focusedTaskId={focusedTaskId}
            newTaskRef={newTaskRef}
          />
        ))}
      </ReactSortable>
    </li>
  );
}
