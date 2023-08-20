
from app import app
from app.database import get_db
from flask import render_template

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks')
def tasks():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return str(tasks)
