from flask.views.web import web
from flask.views.web import views


@web.route('/')
def index():
    return views.index_view()
