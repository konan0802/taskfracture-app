from flask import render_template
import app.model.database as db


def index_view():
    return render_template('index.html')
