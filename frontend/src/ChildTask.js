import React from 'react';

export default function ChildTask({ task }) {
  return (
    <li className="task-item">
      <div className="task-child-div">
        <input value={task.name} placeholder='Task Name' ></input>
      </div>
    </li>
  );
}
