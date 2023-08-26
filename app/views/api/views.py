from flask import jsonify, request
from app import models


def get_tasks():
    tasks = models.get_all_tasks()
    #print(tasks, flush=True)
    return jsonify({'tasks': tasks})


def add_task():
    new_task = request.json
    models.add_task(new_task)
    return jsonify({'message': 'Task added successfully!'})
