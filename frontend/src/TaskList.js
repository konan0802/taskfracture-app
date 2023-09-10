import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import ParentTask from "./ParentTask";

export default function TaskList() {
  const [parentTasks, setParentTasks] = useState([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);
  const newTaskRef = React.useRef(null);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [taskOrder, setTaskOrder] = useState([]);

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

  const addChildTask = (parentId, name, index = 0) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: false,
      order: index,
    };
    const newParentTasks = [...parentTasks];
    const parentTask = newParentTasks.find((task) => task.id === parentId);
    parentTask.children.splice(index, 0, newTask);
    setParentTasks(newParentTasks);
    setTaskIdCounter(newTaskId);
    setFocusedTaskId(newTaskId);
  };

  const updateChildTasks = (parentId, newChildren) => {
    const newParentTasks = [...parentTasks];
    const parentTask = newParentTasks.find((task) => task.id === parentId);
    parentTask.children = newChildren;
    setParentTasks(newParentTasks);
  };

  const handleDoubleClickOutside = (event) => {
    event.preventDefault();
    if (!event.target.closest(".task-item")) {
      addParentTask();
    }
  };

  const handleGlobalKeyDown = (event) => {
    if (focusedTaskId === null) return;

    const currentIndex = taskOrder.indexOf(focusedTaskId);
    if (currentIndex === -1) return;

    if (event.key === "ArrowUp" && currentIndex > 0) {
      setFocusedTaskId(taskOrder[currentIndex - 1]);
    } else if (
      event.key === "ArrowDown" &&
      currentIndex < taskOrder.length - 1
    ) {
      setFocusedTaskId(taskOrder[currentIndex + 1]);
    }
  };

  useEffect(() => {
    // APIからデータをフェッチしてparentTasksを更新する
    fetchData().then((data) => {
      setParentTasks(data);
    });
  }, []);

  useEffect(() => {
    // parentTasksが変更されたらAPIを通じてDBを更新する
    updateData(parentTasks);
  }, [parentTasks]);

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
        const length = newTaskRef.current?.value.length;
        if (length !== undefined) {
          newTaskRef.current.selectionStart = length;
          newTaskRef.current.selectionEnd = length;
        }
      }, 0);
    }
  }, [focusedTaskId]);

  useEffect(() => {
    const newTaskOrder = [];
    parentTasks.forEach((parentTask) => {
      newTaskOrder.push(parentTask.id);
      parentTask.children.forEach((childTask) => {
        newTaskOrder.push(childTask.id);
      });
    });
    setTaskOrder(newTaskOrder);
  }, [parentTasks]);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [focusedTaskId, taskOrder]);

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
          updateChildTasks={updateChildTasks}
          index={index}
          newTaskRef={newTaskRef}
          focusedTaskId={focusedTaskId}
          setFocusedTaskId={setFocusedTaskId}
        />
      ))}
    </ReactSortable>
  );
}
