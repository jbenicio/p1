import datetime
from app import db, ma


"""Definição da classe/tabela dos usuários e seus campos"""
class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    cnpj = db.Column(db.String(60), unique=True, nullable=False)
    company_name = db.Column(db.String(60), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    
    #posts = db.relationship('Posts', backref='users', lazy=True)
    #commentaries = db.relationship('Commentaries', backref='users', lazy=True)

    def __init__(self, name, email, password, cnpj, company_name, phone_number):
        self.name = name
        self.email = email
        self.password = password
        self.cnpj = cnpj
        self.company_name = company_name
        self.phone_number = phone_number


"""Definindo o Schema do Marshmallow para facilitar a utilização de JSON"""
class UsersSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'name', 'email', 'password', 'cnpj', 'company_name' , 'phone_number')


user_schema = UsersSchema()
users_schema = UsersSchema(strict=True, many=True)
