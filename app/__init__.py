from flask import Flask
from app.routes.api_routes import api as api_blueprint
from app.routes.web_routes import web as web_blueprint

app = Flask(__name__)
app.register_blueprint(api_blueprint, url_prefix='/api')
app.register_blueprint(web_blueprint)
