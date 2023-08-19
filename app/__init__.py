from flask import Flask
import mysql.connector
import os

app = Flask(__name__)


def get_db():
    """データベース接続を取得する関数"""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "pass"),
        database=os.getenv("DB_NAME", "taskfracture")
    )


from app import routes
