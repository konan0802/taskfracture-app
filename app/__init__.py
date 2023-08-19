from flask import Flask
import mysql.connector
import os

app = Flask(__name__)

from app import routes
