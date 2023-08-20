from flask import Blueprint
from app.web import views  # Webのビジネスロジック

web = Blueprint('web', __name__)

@web.route('/')
def index():
    return views.index_view()

@web.route('/tasks')
def tasks():
    return views.tasks_view()
