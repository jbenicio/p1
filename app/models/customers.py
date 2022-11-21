import datetime
from app import db, ma


"""Definição da classe/tabela dos usuários e seus campos"""
class Customers(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cnpj = db.Column(db.String(20), unique=True, nullable=False)
    comercial_name = db.Column(db.String(100), nullable=False)
    legal_name = db.Column(db.String(100), nullable=False)
    
    #posts = db.relationship('Posts', backref='users', lazy=True)
    #commentaries = db.relationship('Commentaries', backref='users', lazy=True)

    def __init__(self, cnpj, comercial_name, legal_name):
        self.cnpj = cnpj
        self.comercial_name = comercial_name
        self.legal_name = legal_name
        
"""Definindo o Schema do Marshmallow para facilitar a utilização de JSON"""
class CustomersSchema(ma.Schema):
    class Meta:
        fields = ('customer_id','cnpj', 'comercial_name', 'legal_name' )


user_schema = CustomersSchema()
users_schema = CustomersSchema(strict=True, many=True)
