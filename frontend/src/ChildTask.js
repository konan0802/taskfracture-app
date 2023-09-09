import React from 'react';

export default function ChildTask({ task }) {
  return (
    <li className="task-item">
      <div className="task-child-div">
        {task.name}
      </div>
    </li>
  );
}
