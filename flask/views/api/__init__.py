# app/views/api/__init__.py
from . import views
from flask import Blueprint

api = Blueprint('api', __name__)
