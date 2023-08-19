from app import app

@app.route('/')
def index():
    return "Welcome to TaskFracture!"

@app.route('/tasks')
def tasks():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return str(tasks)