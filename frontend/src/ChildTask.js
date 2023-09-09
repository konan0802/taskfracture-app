import React from "react";

export default function ChildTask({
  task,
  addChildTask,
  parentId,
  index,
  focusedTaskId,
  newTaskRef,
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
        ></input>
      </div>
    </li>
  );
}
