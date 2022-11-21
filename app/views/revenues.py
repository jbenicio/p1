from werkzeug.security import generate_password_hash
from app import db
from flask import request, jsonify
from ..models.revenues import Revenues, user_schema, users_schema
from sqlalchemy import exc

# """Retorna lista de revenues"""
# def get_users():
#     name = request.args.get('name')
#     if name:
#         users = Users.query.filter(Users.name.like(f'%{name}%')).all()
#     else:
#         users = Users.query.all()
#     if users:
#         result = users_schema.dump(users)
#         return jsonify({'message': 'successfully fetched', 'data': result.data})

#     return jsonify({'message': 'nothing found', 'data': {}})

# """Retorna usuário específico pelo ID no parametro da request"""
# def get_user(id):
#     user = Users.query.get(id)
#     if user:
#         result = user_schema.dump(user)
#         return jsonify({'message': 'successfully fetched', 'data': result.data}), 201

#     return jsonify({'error': "Usuário não existe."}), 404


"""Cadastro de revenues com validação de existência"""
def post_revenue(customerID):
    amount = request.json['amount']
    invoice_id = request.json['invoice_id']
    description = request.json['description']
    accrual_date = request.json['accrual_date']
    transaction_date = request.json['transaction_date']
    print(customerID)

    # user = user_by_username(name)
    # if user:
    #     result = user_schema.dump(user)
    #     return jsonify({'message': 'user already exists', 'data': {}})

    # pass_hash = generate_password_hash(password)
    revenue = Revenues(amount,invoice_id, description, accrual_date, transaction_date)

    try:
        #print(user_schema.dump(user))
        db.session.add(revenue)
        db.session.commit()
        result = user_schema.dump(revenue)
        return jsonify({'revenue_id': result.data['revenue_id']}), 201
    except exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': 'Erro ao criar receita.'}), 500

"""Atualiza revenue baseado no ID, caso o mesmo exista."""
def update_user(id):
    username = request.json['username']
    password = request.json['password']
    name = request.json['name']
    email = request.json['email']
    user = Users.query.get(id)

    if not user:
        return jsonify({'message': "user don't exist", 'data': {}}), 404

    pass_hash = generate_password_hash(password)

    if user:
        try:
            user.username = username
            user.password = pass_hash
            user.name = name
            user.email = email
            db.session.commit()
            result = user_schema.user_id
            return jsonify({'message': 'successfully updated!!!!!!', 'data': result}), 201
        except exc.SQLAlchemyError:
            return jsonify({'error': 'Erro ao criar usuário.'}), 500

"""Deleta revenue com base no ID da request"""
def delete_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({'message': "user don't exist", 'data': {}}), 404

    if user:
        try:
            db.session.delete(user)
            db.session.commit()
            result = user_schema.dump(user)
            return jsonify({'message': 'successfully deleted', 'data': result.data}), 200
        except:
            return jsonify({'message': 'unable to delete', 'data': {}}), 500

def user_by_username(username):
    try:
        return Users.query.filter(Users.username == username).one()
    except:
        return None