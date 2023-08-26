import mysql.connector
import os


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "pass"),
        database=os.getenv("DB_NAME", "taskfracture")
    )


def get_all_tasks():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT
                p.id              AS parent_id,
                p.name            AS parent_name,
                p.estimated_hours AS parent_estimated_hours,
                p.actual_hours    AS parent_actual_hours,
                p.status          AS parent_status,
                p.order           AS parent_order,
                s.id              AS sub_id,
                s.name            AS sub_name,
                s.estimated_hours AS sub_estimated_hours,
                s.actual_hours    AS sub_actual_hours,
                s.status          AS sub_status,
                s.order           AS sub_order
           FROM parent_tasks p
           LEFT JOIN sub_tasks s ON p.id = s.parent_task_id
           ORDER BY p.order ASC, s.order ASC;"""
    )
    return cursor.fetchall()


def get_task_by_id(task_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """SELECT *
           FROM parent_tasks
           WHERE id = %s
           UNION
                SELECT *
                FROM sub_tasks
                WHERE id = %s;""",
        (task_id, task_id)
    )
    return cursor.fetchone()


def add_parent_task(task):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO parent_tasks (name, estimated_hours, actual_hours, status, order) VALUES (%s, %s, %s, %s, %s)",
        (task['name'], task['estimated_hours'], task['actual_hours'], task['status'], task['order'])
    )
    db.commit()


def add_sub_task(task):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO sub_tasks (name, estimated_hours, actual_hours, status, parent_task_id, order) VALUES (%s, %s, %s, %s, %s, %s)",
        (task['name'], task['estimated_hours'], task['actual_hours'], task['status'], task['parent_task_id'], task['order'])
    )
    db.commit()


def update_task(task):
    db = get_db()
    cursor = db.cursor()
    # ここで親タスクか子タスクかを判断し、適切なテーブルを更新するロジックを追加することができます。
    db.commit()


def delete_task(task_id):
    db = get_db()
    cursor = db.cursor()
    # 親タスクを削除する場合、関連する子タスクも削除するロジックを追加できます。
    cursor.execute(
        """DELETE FROM parent_tasks WHERE id = %s;
           DELETE FROM sub_tasks WHERE id = %s;""",
        (task_id, task_id)
    )
    db.commit()
