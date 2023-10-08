import React, { useState, useEffect, memo } from "react";
import { ReactSortable } from "react-sortablejs";
import ChildTask from "./ChildTask";

const ParentTask = ({
  task,
  addParentTask,
  updateTaskInfo,
  addChildTask,
  updateChildTasks,
  deleteTask,
  index,
  newTaskRef,
  focusedTaskId,
  setFocusedTaskId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  function getStatusClassName(status) {
    switch (status) {
      case 0:
        return "status-todo";
      case 1:
        return "status-doing";
      case 2:
        return "status-done";
      case 3:
        return "status-today";
      default:
        return "";
    }
  }
  const statusClass = getStatusClassName(task.status);

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

  const handleRightClick = (event) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const handleSetStatus = (status) => {
    updateTaskInfo(task.id, "taskStatus", status);
    setShowMenu(false);
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
      <div className={`task-parent-div ${statusClass}`}>
        <input
          class="task-parent-name"
          ref={task.id === focusedTaskId ? newTaskRef : null}
          value={task.name}
          placeholder="タスク名"
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedTaskId(task.id)}
          onChange={(e) => updateTaskInfo(task.id, "taskName", e.target.value)}
          rows="1"
        ></input>
        <span
          class="task-parent-estimated"
          type="number"
          step="0.5"
          min="0"
          //onKeyDown={handleKeyDown}
          onChange={(e) =>
            updateTaskInfo(task.id, "taskEstimated", e.target.value)
          }
          rows="1"
        >
          {task.estimated_hours}
        </span>
        <span class="task-parent-h">h</span>
        <span
          class="task-parent-actual"
          type="number"
          step="0.5"
          min="0"
          //onKeyDown={handleKeyDown}
          onChange={(e) =>
            updateTaskInfo(task.id, "taskActual", e.target.value)
          }
          rows="1"
        >
          {task.actual_hours}
        </span>
        <span class="task-parent-h">h</span>
      </div>
      {showMenu && (
        <div
          className="context-menu"
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
        >
          <div onClick={() => handleSetStatus(0)} className="context-menu-item">
            ToDo
          </div>
          <div onClick={() => handleSetStatus(3)} className="context-menu-item">
            Today
          </div>
          <div onClick={handleDelete} className="context-menu-item">
            Delete
          </div>
        </div>
      )}
      <ReactSortable
        className="task-child-list"
        list={task.children || []}
        setList={(newChildren) => updateChildTasks(task.id, newChildren)} // Use the function here
      >
        {(task.children || []).map((childTask, childIndex) => (
          <ChildTask
            key={childTask.id}
            task={childTask}
            addChildTask={addChildTask}
            deleteTask={deleteTask}
            parentId={task.id}
            index={childIndex}
            newTaskRef={newTaskRef}
            focusedTaskId={focusedTaskId}
            setFocusedTaskId={setFocusedTaskId}
            updateTaskInfo={updateTaskInfo}
          />
        ))}
      </ReactSortable>
    </li>
  );
};

export default memo(ParentTask);
