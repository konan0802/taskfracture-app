import mysql.connector
import os


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "pass"),
        database=os.getenv("DB_NAME", "taskfracture")
    )


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
                NULL     AS child_order
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
                c.order           AS child_order
            FROM
                sub_tasks c
            JOIN parent_tasks p ON c.parent_task_id = p.id
            ORDER BY
                parent_order ASC,
                child_order ASC;"""
    )
    return cursor.fetchall()

def put_task():
