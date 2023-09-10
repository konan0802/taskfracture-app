import React from "react";

export default function ChildTask({
  task,
  addChildTask,
  updateTaskName,
  parentId,
  index,
  newTaskRef,
  focusedTaskId,
  setFocusedTaskId,
}) {
  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addChildTask(parentId, null, index + 1);
    }
  };

  return (
    <li className="task-item">
      <div className="task-child-div">
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
    </li>
  );
}
