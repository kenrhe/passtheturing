from flask import render_template, request, send_from_directory, jsonify
from config import app, db

import os
import string

# app.register_blueprint(app_browse)

#===================================
# Routes ####
#===================================
@app.route("/submit", methods=["GET"])
def submit():
    query = str(request.args.get("query"))
    query_clean = query.translate(None, string.punctuation).lower().strip()

    a = db.dialogue.find_one({"query_clean": query_clean})
    b = db.dialogue.find_one({"query_clean": query_clean})['responses'][0][2]

    if a == None:
        if b == None:
            response = "I'm not sure as to what you are saying. Can you try another phrase?"
            id = None
        else:
            response = b["query_clean"]
    else:
        response = a["responses"][0][0]
        id = a["responses"][0][1]

    return jsonify(success=True, response=response, id=str(id))

@app.route("/upvote", methods=["GET"])
def upvote():
    id = str(request.args.get("id"))
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
