import sys
from flask import jsonify
import app.model.database as db


def get_tasks():
    tasks = db.get_all_tasks()
    #print(tasks, flush=True)
    return jsonify({'tasks': tasks})


def add_task(new_task):
    db.add_task(new_task)
    return jsonify({'message': 'Task added successfully!'})
