import datetime
from app import db, ma


"""Definição da classe/tabela dos usuários e seus campos"""
class Expenses(db.Model):
    expense_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Float(20), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    accrual_date = db.Column(db.Date, nullable=False)
    transaction_date = db.Column(db.String(60), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)

    #posts = db.relationship('Posts', backref='users', lazy=True)
    #commentaries = db.relationship('Commentaries', backref='users', lazy=True)

    def __init__(self, amount, description, accrual_date, transaction_date):
        self.amount = amount
        self.description = description
        self.accrual_date = accrual_date
        self.transaction_date = transaction_date
        
"""Definindo o Schema do Marshmallow para facilitar a utilização de JSON"""
class ExpensesSchema(ma.Schema):
    class Meta:
        fields = ('expense_id','amount', 'description', 'legal_name', 'accrual_date', 'transaction_date' )


user_schema = ExpensesSchema()
users_schema = ExpensesSchema(strict=True, many=True)
