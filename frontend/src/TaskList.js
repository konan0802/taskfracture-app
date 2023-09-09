import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import ParentTask from "./ParentTask";

export default function TaskList() {
  const [parentTasks, setParentTasks] = useState([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);
  const newTaskRef = React.useRef(null);
  const [focusedTaskId, setFocusedTaskId] = useState(null); // Add this line

  const addParentTask = (name, index = parentTasks.length) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: true,
      order: index,
      children: [],
    };
    const newParentTasks = [...parentTasks];
    newParentTasks.splice(index, 0, newTask);
    setParentTasks(newParentTasks);
    setTaskIdCounter(newTaskId);
    setFocusedTaskId(newTaskId); // Add this line
  };

  const addChildTask = (parentId, name) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: false,
      order: parentTasks.length,
    };
    const newParentTasks = [...parentTasks];
    const parentTask = newParentTasks.find((task) => task.id === parentId);
    parentTask.children.push(newTask);
    setParentTasks(newParentTasks);
    setTaskIdCounter(newTaskId);
    setFocusedTaskId(newTaskId); // Add this line
  };

  const handleDoubleClickOutside = (event) => {
    event.preventDefault();
    if (!event.target.closest(".task-item")) {
      addParentTask();
    }
  };

  useEffect(() => {
    window.addEventListener("dblclick", handleDoubleClickOutside);
    return () => {
      window.removeEventListener("dblclick", handleDoubleClickOutside);
    };
  }, [parentTasks, taskIdCounter]);

  useEffect(() => {
    if (focusedTaskId !== null) {
      setTimeout(() => {
        newTaskRef.current?.focus();
      }, 0);
    }
  }, [focusedTaskId]);

  return (
    <ReactSortable
      id="task-parent-list"
      list={parentTasks}
      setList={setParentTasks}
    >
      {parentTasks.map((task, index) => (
        <ParentTask
          key={task.id}
          task={task}
          addParentTask={addParentTask}
          addChildTask={addChildTask}
          index={index}
          newTaskRef={newTaskRef}
          focusedTaskId={focusedTaskId}
        />
      ))}
    </ReactSortable>
  );
}
