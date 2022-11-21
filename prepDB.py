import mysql.connector
from mysql.connector import errorcode

print("Conectando...")
try:
      conn = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='admin'
      )
except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('Existe algo errado no nome de usuário ou senha')
      else:
            print(err)

cursor = conn.cursor()

cursor.execute("DROP DATABASE IF EXISTS `mediumapi`;")

cursor.execute("CREATE DATABASE `mediumapi`;")

cursor.execute("USE `mediumapi`;")

# TABLES = {}
# TABLES['users'] = ('''
#       CREATE TABLE `users` (
#         `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
#       `name` varchar(20) NOT NULL,
#       `username` varchar(8) NOT NULL,
#       `password` varchar(100) NOT NULL,
#       `email` varchar(100) NOT NULL,
#       `created_on` date NOT NULL,
#       PRIMARY KEY (`id`)
#       ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;''')

# for tabela_nome in TABLES:
#       tabela_sql = TABLES[tabela_nome]
#       try:
#             print('Criando tabela {}:'.format(tabela_nome), end=' ')
#             cursor.execute(tabela_sql)
#       except mysql.connector.Error as err:
#             if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
#                   print('Já existe')
#             else:
#                   print(err.msg)
#       else:
#             print('OK')


# commitando se não nada tem efeito
conn.commit()

cursor.close()
conn.close()