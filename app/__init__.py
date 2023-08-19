from flask import Flask
import mysql.connector

app = Flask(__name__)

def get_db():
    """データベース接続を取得する関数"""
    return mysql.connector.connect(
        host="",
        user="",
        password="",
        database=""
    )

from app import routes
