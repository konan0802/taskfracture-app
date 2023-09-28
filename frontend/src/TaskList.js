import React, { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import ParentTask from "./ParentTask";
import { fetchData, updateData } from "./TaskApi";

export default function TaskList() {
  const [parentTasks, setParentTasks] = useState([]);
  const parentTasksRef = useRef(parentTasks);
  const [taskIdCounter, setTaskIdCounter] = useState(0);
  const newTaskRef = React.useRef(null);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [taskOrder, setTaskOrder] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");

  const addParentTask = (name = "", index = parentTasks.length) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: true,
      children: [],
    };
    const newParentTasks = [...parentTasks];
    newParentTasks.splice(index, 0, newTask);
    setParentTasks(newParentTasks);
    setTaskIdCounter(newTaskId);
    setFocusedTaskId(newTaskId);
  };

  const addChildTask = (parentId, name = "", index = 0) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: false,
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

  const deleteTask = (taskId) => {
    const newParentTasks = parentTasks
      .map((parentTask) => {
        if (parentTask.id === taskId) {
          return null;
        }
        parentTask.children = parentTask.children.filter(
          (child) => child.id !== taskId
        );
        return parentTask;
      })
      .filter((task) => task !== null);
    setParentTasks(newParentTasks);
  };

  const updateTaskName = (taskId, newName) => {
    const newParentTasks = [...parentTasks];
    for (const parentTask of newParentTasks) {
      if (parentTask.id === taskId) {
        parentTask.name = newName;
        setParentTasks(newParentTasks);
        return;
      }
      for (const childTask of parentTask.children) {
        if (childTask.id === taskId) {
          childTask.name = newName;
          setParentTasks(newParentTasks);
          return;
        }
      }
    }
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
    parentTasksRef.current = parentTasks;
  }, [parentTasks]);

  useEffect(() => {
    // 30秒（30000ミリ秒）ごとにデータをアップデート
    const intervalId = setInterval(() => {
      updateData(parentTasksRef.current);
    }, 10000);

    // コンポーネントがアンマウントされたときにタイマーをクリア
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    fetchData().then((data) => {
      if (data && Array.isArray(data.tasks)) {
        // Calculate the new taskIdCounter value based on fetched data
        const maxTaskId =
          data.tasks && data.tasks.length === 0
            ? 0
            : Math.max(
                ...(data.tasks?.map((task) => task.id) || []),
                ...(data.tasks?.flatMap(
                  (task) => task.children?.map((child) => child.id) || []
                ) || [])
              );
        setTaskIdCounter(maxTaskId); // Update the taskIdCounter

        // Update parentTasks
        setParentTasks(data.tasks);

        // Update taskOrder
        const newTaskOrder = [];
        data.tasks.forEach((parentTask) => {
          newTaskOrder.push(parentTask.id);
          parentTask.children.forEach((childTask) => {
            newTaskOrder.push(childTask.id);
          });
        });
        setTaskOrder(newTaskOrder);

        // Reset the focusedTaskId if needed (this is optional)
        //setFocusedTaskId(null);

        setFetchStatus("success");
      } else {
        console.error("Fetched data is not an array or data is null");
        setFetchStatus("error");
      }
    });
  }, []);

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
      list={parentTasks || []}
      setList={setParentTasks}
    >
      {parentTasks.map((task, index) => (
        <ParentTask
          key={task.id}
          task={task}
          addParentTask={addParentTask}
          addChildTask={addChildTask}
          updateChildTasks={updateChildTasks}
          deleteTask={deleteTask}
          index={index}
          newTaskRef={newTaskRef}
          focusedTaskId={focusedTaskId}
          setFocusedTaskId={setFocusedTaskId}
          updateTaskName={updateTaskName}
        />
      ))}
    </ReactSortable>
  );
}
