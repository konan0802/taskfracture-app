CREATE TABLE tasks (
    id              INT          AUTO_INCREMENT PRIMARY KEY COMMENT 'ユニークなタスクID',
    name            VARCHAR(255)                            COMMENT 'タスク名',
    estimated_hours FLOAT                                   COMMENT '見積もり工数',
    actual_hours    FLOAT                                   COMMENT '実績工数',
    status          INT          NOT NULL                   COMMENT '0: Not Started, 1: In Progress, 2: Completed',
    parent_task_id  INT                                     COMMENT '親タスクのID',
    FOREIGN KEY(parent_task_id) REFERENCES tasks(id)
) CHARACTER SET utf8mb4 COMMENT='タスクの情報';
