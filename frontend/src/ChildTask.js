import React from "react";

export default function ChildTask({ task, focusedTaskId, newTaskRef }) {
  return (
    <li className="task-item">
      <div className="task-child-div">
        <input
          ref={task.id === focusedTaskId ? newTaskRef : null}
          value={task.name}
          placeholder="Task Name"
        ></input>
      </div>
    </li>
  );
}
