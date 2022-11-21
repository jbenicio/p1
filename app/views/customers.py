from werkzeug.security import generate_password_hash
from app import db
from flask import request, jsonify
from ..models.customers import Customers, user_schema, users_schema
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


"""Cadastro de customers """
def post_customer():
    cnpj = request.json['cnpj']
    comercial_name = request.json['comercial_name']
    legal_name = request.json['legal_name']

    

    # user = user_by_username(name)
    # if user:
    #     result = user_schema.dump(user)
    #     return jsonify({'message': 'user already exists', 'data': {}})

    # pass_hash = generate_password_hash(password)
    customer = Customers(cnpj,comercial_name, legal_name)

    try:
        #print(user_schema.dump(user))
        db.session.add(customer)
        db.session.commit()
        result = user_schema.dump(customer)
        return jsonify({'customer_id': result.data['customer_id']}), 201
    except exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': 'Erro ao criar Cliente.'}), 500

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