from flask import Flask, jsonify
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
ma = Marshmallow(app)


from .models import users, customers, expenses, revenues
#lembrar das cat acima
from .views import users, helper
from .routes import routes

with app.app_context():
        db.create_all()
        # db.session.add(users.Users(username="fgaj", password="fgaj", name="fgaj", email="fgaj@google.com"))
        # db.session.commit()
        # users = db.session.execute(db.select(users.Users)).scalars()
