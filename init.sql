-- 親タスクを管理するテーブル
CREATE TABLE `parent_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ユニークな親タスクID',
  `name` varchar(255) DEFAULT NULL COMMENT '親タスク名',
  `estimated_hours` float DEFAULT NULL COMMENT '見積もり工数',
  `actual_hours` float DEFAULT NULL COMMENT '実績工数',
  `status` int(11) NOT NULL COMMENT '0: Not Started, 1: In Progress, 2: Completed',
  `order` int(11) DEFAULT NULL COMMENT 'タスクの順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='親タスクの情報';

-- 子タスクを管理するテーブル
CREATE TABLE `sub_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ユニークな子タスクID',
  `name` varchar(255) DEFAULT NULL COMMENT '子タスク名',
  `estimated_hours` float DEFAULT NULL COMMENT '見積もり工数',
  `actual_hours` float DEFAULT NULL COMMENT '実績工数',
  `status` int(11) NOT NULL COMMENT '0: Not Started, 1: In Progress, 2: Completed',
  `parent_task_id` int(11) DEFAULT NULL COMMENT '親タスクのID',
  `order` int(11) DEFAULT NULL COMMENT 'タスクの順序',
  PRIMARY KEY (`id`),
  KEY `parent_task_id` (`parent_task_id`),
  CONSTRAINT `sub_tasks_ibfk_1` FOREIGN KEY (`parent_task_id`) REFERENCES `parent_tasks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='子タスクの情報';
