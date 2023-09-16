import React, { useState } from "react";

export default function ChildTask({
  task,
  addChildTask,
  deleteTask,
  updateTaskName,
  parentId,
  index,
  newTaskRef,
  focusedTaskId,
  setFocusedTaskId,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addChildTask(parentId, null, index + 1);
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowMenu(false);
  };

  return (
    <li className="task-item" onContextMenu={handleRightClick}>
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
      {showMenu && (
        <div className="context-menu">
          <div onClick={handleDelete} className="context-menu-item">
            Delete
          </div>
          <div onClick={handleCloseMenu} className="context-menu-item">
            Cancel
          </div>
        </div>
      )}
    </li>
  );
}
