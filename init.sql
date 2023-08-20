CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ユニークなタスクID',
  `name` varchar(255) DEFAULT NULL COMMENT 'タスク名',
  `estimated_hours` float DEFAULT NULL COMMENT '見積もり工数',
  `actual_hours` float DEFAULT NULL COMMENT '実績工数',
  `status` int(11) NOT NULL COMMENT '0: Not Started, 1: In Progress, 2: Completed',
  `parent_task_id` int(11) DEFAULT NULL COMMENT '親タスクのID',
  `order` int(11) DEFAULT NULL COMMENT 'タスクの順序',
  PRIMARY KEY (`id`),
  KEY `parent_task_id` (`parent_task_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='タスクの情報';