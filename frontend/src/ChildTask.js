import React, { useState, useEffect, memo } from "react";

const ChildTask = ({
  task,
  addChildTask,
  deleteTask,
  updateTaskInfo,
  parentId,
  index,
  newTaskRef,
  focusedTaskId,
  setFocusedTaskId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      addChildTask(parentId, null, index + 1);
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("click", handleCloseMenu);
    }

    return () => {
      document.removeEventListener("click", handleCloseMenu);
    };
  }, [showMenu]);

  return (
    <li className="task-item" onContextMenu={handleRightClick}>
      <div className="task-child-div">
        <input
          class="task-child-name"
          ref={task.id === focusedTaskId ? newTaskRef : null}
          value={task.name}
          placeholder="タスク名"
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedTaskId(task.id)}
          onChange={(e) => updateTaskInfo(task.id, "taskName", e.target.value)}
          rows="1"
        ></input>
        <input
          class="task-child-estimated"
          type="number"
          step="0.5"
          min="0"
          value={task.estimated_hours}
          //onKeyDown={handleKeyDown}
          onChange={(e) =>
            updateTaskInfo(task.id, "taskEstimated", e.target.value)
          }
          rows="1"
        ></input>
        <span class="task-child-h">h</span>
        <input
          class="task-child-actual"
          type="number"
          step="0.5"
          min="0"
          value={task.actual_hours}
          //onKeyDown={handleKeyDown}
          onChange={(e) =>
            updateTaskInfo(task.id, "taskActual", e.target.value)
          }
          rows="1"
        ></input>
        <span class="task-child-h">h</span>
      </div>
      {showMenu && (
        <div
          className="context-menu"
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
        >
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
};

export default memo(ChildTask);
