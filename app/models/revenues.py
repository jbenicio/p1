import datetime
from app import db, ma


"""Definição da classe/tabela dos usuários e seus campos"""
class Revenues(db.Model):
    revenue_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Float(20), nullable=False)
    invoice_id = db.Column(db.String(60), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    accrual_date = db.Column(db.Date, nullable=False)
    transaction_date = db.Column(db.String(60), nullable=False)
    
    #posts = db.relationship('Posts', backref='users', lazy=True)
    #commentaries = db.relationship('Commentaries', backref='users', lazy=True)

    def __init__(self, amount, invoice_id, description, accrual_date, transaction_date):
        self.amount = amount
        self.invoice_id = invoice_id
        self.description = description
        self.accrual_date = accrual_date
        self.transaction_date = transaction_date

"""Definindo o Schema do Marshmallow para facilitar a utilização de JSON"""
class RevenuesSchema(ma.Schema):
    class Meta:
        fields = ('revenue_id','amount', 'invoice_id', 'description', 'accrual_date', 'transaction_date' )


user_schema = RevenuesSchema()
users_schema = RevenuesSchema(strict=True, many=True)
