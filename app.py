'''
Authored by: Kenneth Rhee, Hak Joon Lee, Joe Goodman
Email: kennethhrhee@gmail.com, thejoonshow@gmail.com, goodman.a.joseph@gmail.com
'''

from flask import render_template, request, send_from_directory, jsonify
from config import app, db

import os

# app.register_blueprint(app_browse)

#===================================
# Routes ####
#===================================
@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        dict = {"success": True, "response": "Hi! That is totally amazing wow! Congratulations!"}
        return jsonify(**dict)

@app.route('/')
def index():
    # print db.dialogue.find()[0]
    # print "hello world"
    # return str(db.dialogue.find()[0])
    return render_template('index.html')

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)
