import mysql.connector
import os


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "pass"),
        database=os.getenv("DB_NAME", "taskfracture")
    )


def sync_tasks(tasks_data):
    db = get_db()
    cursor = db.cursor()
    new_task_ids = []

    # Gather all task IDs sent from the client
    for task in tasks_data:
        new_task_ids.append(task['id'])
        for sub_task in task.get('children', []):
            new_task_ids.append(sub_task['id'])

    # Get all existing task IDs
    cursor.execute("SELECT id FROM tasks")
    existing_task_ids = [row[0] for row in cursor.fetchall()]

    # Identify deleted tasks
    deleted_task_ids = set(existing_task_ids) - set(new_task_ids)

    # Delete removed tasks from the database
    for task_id in deleted_task_ids:
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))

    # Insert or update tasks
    index = 0
    for _, task in enumerate(tasks_data):
        cursor.execute(
            """INSERT INTO tasks (id, name, is_parent, status, `order`) 
               VALUES (%s, %s, TRUE, %s, %s) 
               ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), `order`=VALUES(`order`)""",
            (task['id'], task.get('name', None), task.get('status', 0), index)
        )
        index += 1
        parent_task_id = cursor.lastrowid or task['id']

        for _, sub_task in enumerate(task.get('children', [])):
            cursor.execute(
                """INSERT INTO tasks (id, name, is_parent, status, parent_task_id, `order`) 
                   VALUES (%s, %s, FALSE, %s, %s, %s) 
                   ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), 
                                           parent_task_id=VALUES(parent_task_id), `order`=VALUES(`order`)""",
                (sub_task['id'], sub_task.get('name', None), sub_task.get(
                    'status', 0), parent_task_id, index)
            )
            index += 1

    db.commit()
    cursor.close()
    db.close()

    return new_task_ids


def get_tasks():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT
                id,
                name,
                is_parent,
                status,
                `order`,
                parent_task_id
            FROM
                tasks
            ORDER BY
                `order` ASC"""
    )

    rows = cursor.fetchall()
    tasks = {}
    for row in rows:
        if row['is_parent']:
            parent_task = {
                'id': row['id'],
                'name': row['name'],
                'isParent': True,
                'children': []
            }
            tasks[row['id']] = parent_task
        else:
            sub_task = {
                'id': row['id'],
                'name': row['name'],
                'isParent': False,
            }
            tasks[row['parent_task_id']]['children'].append(sub_task)

    return list(tasks.values())
