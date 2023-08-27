from app.views.web import web
from app.views.web import views


@web.route('/')
def index():
    return views.index_view()
