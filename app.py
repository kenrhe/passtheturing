from flask import render_template, request, send_from_directory, jsonify
from config import app, db

import os
import string

# app.register_blueprint(app_browse)

#===================================
# Routes ####
#===================================
@app.route('/submit', methods=["GET"])
def submit():
    query = str(request.args.get('query'))
    query_clean = query.translate(None, string.punctuation).lower().strip()

    a = db.dialogue.find_one({"query_clean": query_clean})

    if a == None:
        response = "I'm not sure as to what you are saying. Can you try another phrase?"
        _id = None
    else:
        response = a['responses'][0][0]
        _id = a._id

    return jsonify(success=True, response=response, _id=_id)

@app.route('/upvote', methods=["GET"])
def upvote():
    id = str(request.arg.get('id'))
    a = db.dialogue.find_one({"_id": id})

    return jsonify(success=True)

@app.route('/downvote', methods=["GET"])
def downvote():
    id = str(request.arg.get('id'))
    a = db.dialogue.find_one({"id": id})

    return jsonify(success=True)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
