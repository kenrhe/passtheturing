'''
Authored by: Kenneth Rhee, Hak Joon Lee, Joe Goodman
Email: kennethhrhee@gmail.com, thejoonshow@gmail.com, goodman.a.joseph@gmail.com
'''

from flask import render_template, request, send_from_directory
from config import app, db

import os

# app.register_blueprint(app_browse)

#===================================
# Routes ####
#===================================
@app.route('/')
def index():
    a = list(db.dialogue.find({"$text" : {"$search" : "How are you"}}))
    print a
    return render_template('index.html')

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)