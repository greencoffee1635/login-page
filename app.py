from flask import Flask, request, render_template, jsonify, redirect
from pymongo import MongoClient

import jwt
import datetime

app = Flask(__name__)
client = MongoClient('localhost', port=27017)
db = client.dbkino

@app.get('/')
def home():
    token = request.cookies.get('freepass')
    try:
        decoded_data = jwt.decode(token, '12345', "HS256")
        result = db.users.find_one({'user_id': decoded_data['id']})
        if result is None:
            return redirect('/login')

    except:
        # 만료되었습니다.
        return redirect('/login')

    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/api/login', methods=['POST'])
def login_check():
    user_id = request.form['user_id']
    user_pw = request.form['user_pw']

    user_find = db.users.find_one({'user_id': user_id})

    if user_find is None:
        return jsonify({'message': '로그인 정보가 없습니다.'})
    elif user_find['user_pw'] != user_pw:
        return jsonify({'message': '비밀번호가 일치하지 않습니다.'})
    else:
        payload = {
            'id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=18000)
        }

        token = jwt.encode(payload, '12345', "HS256")

        return jsonify({'message': '로그인 되었습니다.', 'token':token})

@app.route('/api/register', methods=['POST'])
def register():
    user_id = request.form['user_id']
    user_pw = request.form['user_pw']
    user_nick = request.form['user_nick']

    db.users.insert_one({"user_id": user_id, "user_pw":user_pw, "user_nick":user_nick})

    return jsonify({'message': 'ok!!'})

@app.route('/api/register/id_check', methods=['POST'])
def id_check():
    user_id = request.form['id_check']

    user_id = db.users.find_one({'user_id': user_id})

    if user_id is None:
        return jsonify({'message': '이 아이디는 사용 가능합니다.','is-available': True})
    else:
        return jsonify({'message': '이미 사용자가 있는 아이디입니다. 다른 아이디를 사용해주세요', 'is-available': False})

if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)