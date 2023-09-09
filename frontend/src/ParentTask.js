import React from "react";
import { ReactSortable } from "react-sortablejs";
import ChildTask from "./ChildTask";

export default function ParentTask({ task, addParentTask, index, newTaskRef }) {
  const handleKeyDown = (event) => {
    // IMEがアクティブな場合は何もしない
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addParentTask(null, index + 1);
    }
    // Additional key events can be added here later
  };

  return (
    <li className="task-item">
      <div className="task-parent-div">
        <input
          ref={task.order === index ? newTaskRef : null}
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
          <ChildTask key={childTask.id} task={childTask} />
        ))}
      </ReactSortable>
    </li>
  );
}
