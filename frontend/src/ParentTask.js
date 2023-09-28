import React, { useState, useEffect, memo } from "react";
import { ReactSortable } from "react-sortablejs";
import ChildTask from "./ChildTask";

const ParentTask = ({
  task,
  addParentTask,
  updateTaskName,
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
            updateTaskName={updateTaskName}
          />
        ))}
      </ReactSortable>
    </li>
  );
};

export default memo(ParentTask);
