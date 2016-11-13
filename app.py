from flask import render_template, request, send_from_directory, jsonify
from config import app, db
from ai import get_response
from twilio import twiml

import twilio
import os
import string
import sys
import time

#===================================
# Routes ####
#===================================

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=["GET"])
def submit():
    query = str(request.args.get('query'))

    resp = get_response(query)
    response = resp["response"]
    _id = resp["_id"]
    isDefault = resp["isDefault"]

    return jsonify(success=True, response=response, id=_id, isDefault=isDefault)

@app.route('/sms/request', methods=["POST"])
def sms_request():
    query = str(request.form['Body'])
    resp = get_response(query)

    response = twiml.Response()
    response.message(resp['response'])

    time.sleep(2)

    return str(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
