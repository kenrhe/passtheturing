from flask import render_template, request, send_from_directory, jsonify
from config import app, db
import twilio

import os
import string
import sys

#===================================
# Routes ####
#===================================

@app.route('/submit', methods=["GET"])
def submit():
    query = str(request.args.get('query'))

    resp = _submit(query)
    response = resp["response"]
    _id = resp["_id"]
    isDefault = resp["isDefault"]

    return jsonify(success=True, response=response, id=_id, isDefault=isDefault)

def _submit(query):
    query_clean = query.translate(None, string.punctuation).lower().strip()

    a = db.dialogue.find_one({"query_clean": query_clean})
    b = db.dialogue.find_one({"responses.0.2" : query_clean})

    print(b)

    if a == None:
        a = db.dialogue.find_one({"$text": {"$search": query_clean}})
        if b:
            response = b["query"]
            id = b["query"]
            isDefault=False

        elif (a == None):
            response = "wat"
            response = db.dialogue.find_one({"query": b})
        if a == None:
            response = "What do you mean?"
            id = None
            isDefault = True

        else:
            response = a['responses'][0][0]
            id = a['responses'][0][1]
            isDefault = False

    else:
        response = a['responses'][0][0]
        id = a['responses'][0][1]
        isDefault = False

    return {"_id" : id, "response" : response, "isDefault" : isDefault}

@app.route('/sms/request', methods=["POST"])
def sms_request():
    query = str(request.form['Body'])
    sys.stderr.write(str(query))
    resp = _submit(query)
    return resp['response']

def send_sms(to_number, body):
    account_sid = app.config['TWILIO_ACCOUNT_SID']
    auth_token = app.config['TWILIO_AUTH_TOKEN']
    twilio_number = app.config['TWILIO_NUMBER']
    client = twilio.rest.Client(account_sid, auth_token)
    client.messages.create(to_number,
                           from_=twilio_number,
                           body=body)    

@app.route('/upvote', methods=["GET"])
def upvote():
    id = str(request.args.get('id'))
    a = db.dialogue.find_one({"response.2": id})

    if a:
        a.update({}, {"$set": {"response.1": existing + 1}})

    return jsonify(success=True)

@app.route('/downvote', methods=["GET"])
def downvote():
    id = str(request.args.get('id'))
    a = db.dialogue.find_one({"response.1": id})

    if a:
        a.update({}, {"$set": {"response.1": existing - 1}})

    return jsonify(success=True)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
