import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ParentTask from './ParentTask';

export default function TaskList() {
  const [parentTasks, setParentTasks] = useState([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);

  const addParentTask = (name) => {
    const newTaskId = taskIdCounter + 1;
    const newTask = {
      id: newTaskId,
      name,
      isParent: true,
      order: parentTasks.length,
      children: []
    };
    setParentTasks([...parentTasks, newTask]);
    setTaskIdCounter(newTaskId);
  };

  const handleDoubleClickOutside = (event) => {
    if (!event.target.closest('.task-item')) {
      addParentTask('New Parent Task');
    }
  };

  useEffect(() => {
    // グローバルなダブルクリックイベントリスナーを追加
    window.addEventListener('dblclick', handleDoubleClickOutside);

    // クリーンアップ: コンポーネントがアンマウントされる際にグローバルイベントリスナーを削除
    return () => {
      window.removeEventListener('dblclick', handleDoubleClickOutside);
    };
  }, [parentTasks, taskIdCounter]);

  return (
    <ReactSortable id="task-parent-list" list={parentTasks} setList={setParentTasks}>
      {parentTasks.map((task) => (
        <ParentTask key={task.id} task={task} />
      ))}
    </ReactSortable>
  );
}
