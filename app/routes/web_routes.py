from app.views.web import web
from app.views.web import views


@web.route('/')
def index():
    return views.index_view()


@web.route('/tasks')
def tasks():
    return views.tasks_view()
