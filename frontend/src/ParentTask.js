import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import ChildTask from './ChildTask';

export default function ParentTask({ task }) {
  return (
    <li className="task-item">
      <div className="task-parent-div">
        <input value={task.name} placeholder='Task Name' ></input>
      </div>
      <ReactSortable className="task-child-list" list={task.children} setList={(newChildren) => ({ ...task, children: newChildren })}>
        {task.children.map((childTask) => (
          <ChildTask key={childTask.id} task={childTask} />
        ))}
      </ReactSortable>
    </li>
  );
}
