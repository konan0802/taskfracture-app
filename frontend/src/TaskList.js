import React, { useState, useEffect, useRef, useMemo } from "react";
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
      status: 0,
      estimated_hours: null,
      actual_hours: null,
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
      status: 0,
      estimated_hours: null,
      actual_hours: null,
    };
    const newParentTasks = [...parentTasks];
    const parentTask = newParentTasks.find((task) => task.id === parentId);
    parentTask.children.splice(index, 0, newTask);

    parentTask.status = 0;

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

  const updateTaskInfo = (taskId, key, value) => {
    const newParentTasks = [...parentTasks];
    for (const parentTask of newParentTasks) {
      if (parentTask.id === taskId) {
        if (key === "taskName") {
          parentTask.name = value;
        } else if (key === "taskStatus") {
          parentTask.status = value;
        }
        setParentTasks(newParentTasks);
        return;
      }
      for (const childTask of parentTask.children) {
        if (childTask.id === taskId) {
          if (key === "taskName") {
            childTask.name = value;
          } else if (key === "taskEstimated") {
            childTask.estimated_hours = parseFloat(value) || 0;
            parentTask.estimated_hours = parentTask.children.reduce(
              (sum, child) => sum + parseFloat(child.estimated_hours || 0),
              0
            );
          } else if (key === "taskActual") {
            childTask.actual_hours = parseFloat(value) || 0;
            parentTask.actual_hours = parentTask.children.reduce(
              (sum, child) => sum + parseFloat(child.actual_hours || 0),
              0
            );
          } else if (key === "taskStatus") {
            childTask.status = value;

            // 全ての子タスクが同じstatusを持っているか確認
            const allSameStatus = parentTask.children.every(
              (child) => child.status === value
            );
            if (allSameStatus) {
              parentTask.status = value;
            } else {
              parentTask.status = 0;
            }
          }
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

  // 子タスクの見積工数と実績工数の合計を計算する関数
  const calculateChildTasksTotals = () => {
    let totalEstimatedHours = 0;
    let totalActualHours = 0;

    parentTasks.forEach((parentTask) => {
      parentTask.children.forEach((childTask) => {
        if (childTask.status === 3) {
          totalEstimatedHours += parseFloat(childTask.estimated_hours || 0);
          totalActualHours += parseFloat(childTask.actual_hours || 0);
        }
      });
    });

    return {
      totalEstimatedHours,
      totalActualHours,
    };
  };

  // useMemoフックを使用して、parentTasksの値が変わるたびに合計値を再計算する
  const { totalEstimatedHours, totalActualHours } = useMemo(
    calculateChildTasksTotals,
    [parentTasks]
  );

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
        console.log(data.tasks);

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
    <div ckassName="">
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
            updateTaskInfo={updateTaskInfo}
          />
        ))}
      </ReactSortable>
      <div className="totals">
        <p className="totals-today">Today's Progress</p>
        <div className="totals-val">
          <p className="totals-est">{totalEstimatedHours} h</p>
          <p className="totals-arrow">⇒</p>
          <p className="totals-act">{totalActualHours} h</p>
        </div>
      </div>
    </div>
  );
}
