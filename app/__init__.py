from flask import Flask
from .routes import api_routes, web_routes

app = Flask(__name__)
app.config.from_object('config')

# 各ルーティングを登録
app.register_blueprint(api_routes.api, url_prefix='/api')
app.register_blueprint(web_routes.web)
