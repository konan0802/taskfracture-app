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
    cursor.execute("SELECT * FROM tasks")
    return cursor.fetchall()



def get_task_by_id(task_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
    return cursor.fetchone()


def add_task(task):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO tasks (name, estimated_hours, actual_hours, status, parent_task_id) VALUES (%s, %s, %s, %s, %s)",
        (task['name'], task['estimated_hours'], task['actual_hours'], task['status'], task['parent_task_id'])
    )
    db.commit()


def update_task(task):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "UPDATE tasks SET name = %s, estimated_hours = %s, actual_hours = %s, status = %s, parent_task_id = %s WHERE id = %s",
        (task['name'], task['estimated_hours'], task['actual_hours'], task['status'], task['parent_task_id'], task['id'])
    )
    db.commit()


def delete_task(task_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    db.commit()
