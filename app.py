'''
Authored by: Kenneth Rhee, Hak Joon Lee, Joe Goodman
Email: kennethhrhee@gmail.com, thejoonshow@gmail.com, goodman.a.joseph@gmail.com
'''

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

    a = db.dialogue.find_one({"query_clean" : query_clean})

    if a == None:
        response = "I have no idea what you're saying."
    else:
        response = a['responses'][0][0]

    return jsonify(success=True, response=response)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
