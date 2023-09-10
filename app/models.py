import mysql.connector
import os


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "pass"),
        database=os.getenv("DB_NAME", "taskfracture")
    )


def sync_tasks(parent_tasks_data):
    db = get_db()
    cursor = db.cursor()
    task_ids = []

    for index, parent_task in enumerate(parent_tasks_data):
        cursor.execute(
            """INSERT INTO parent_tasks (id, name, status, `order`) 
               VALUES (%s, %s, %s, %s) 
               ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), `order`=VALUES(`order`)""",
            (parent_task['id'], parent_task.get('name', None),
             parent_task.get('status', 0), index)
        )
        parent_task_id = cursor.lastrowid or parent_task['id']
        task_ids.append(parent_task_id)

        for child_index, sub_task in enumerate(parent_task.get('children', [])):
            cursor.execute(
                """INSERT INTO sub_tasks (id, name, estimated_hours, actual_hours, status, parent_task_id, `order`) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s) 
                   ON DUPLICATE KEY UPDATE name=VALUES(name), estimated_hours=VALUES(estimated_hours), 
                                           actual_hours=VALUES(actual_hours), status=VALUES(status), 
                                           parent_task_id=VALUES(parent_task_id), `order`=VALUES(`order`)""",
                (sub_task['id'], sub_task.get('name', None), sub_task.get('estimated_hours', 0),
                 sub_task.get('actual_hours', 0), sub_task.get('status', 0), parent_task_id, child_index)
            )
            sub_task_id = cursor.lastrowid or sub_task['id']
            task_ids.append(sub_task_id)

    db.commit()
    cursor.close()
    db.close()

    return task_ids


def get_tasks():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT
                'parent' AS task_type,
                p.id     AS task_id,
                p.name   AS name,
                p.status AS status,
                NULL     AS estimated_hours,
                NULL     AS actual_hours,
                p.order  AS parent_order,
                NULL     AS child_order,
                NULL     AS parent_task_id
            FROM
                parent_tasks p
            UNION ALL
            SELECT
                'child'           AS task_type,
                c.id              AS task_id,
                c.name            AS name,
                c.status          AS status,
                c.estimated_hours AS actual_hours,
                c.actual_hours    AS actual_hours,
                p.order           AS parent_order,
                c.order           AS child_order,
                c.parent_task_id  AS parent_task_id
            FROM
                sub_tasks c
            JOIN parent_tasks p ON c.parent_task_id = p.id
            ORDER BY
                parent_order ASC,
                child_order ASC;"""
    )

    rows = cursor.fetchall()
    parent_tasks = {}
    for row in rows:
        if row['task_type'] == 'parent':
            parent_task = {
                'id': row['task_id'],
                'name': row['name'],
                'isParent': True,
                'order': row['parent_order'],
                'children': []
            }
            parent_tasks[row['task_id']] = parent_task
        else:
            sub_task = {
                'id': row['task_id'],
                'name': row['name'],
                'isParent': False,
                'order': row['child_order']
            }
            parent_tasks[row['parent_task_id']]['children'].append(sub_task)

    return list(parent_tasks.values())
