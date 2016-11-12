'''
Authored by: Kenneth Rhee, Hak Joon Lee, Joe Goodman
Email: kennethhrhee@gmail.com, thejoonshow@gmail.com, goodman.a.joseph@gmail.com
'''

# from routes.browse import app_browse
# from routes.search import app_search
from flask import render_template, request, send_from_directory
# from config import app, db
from config import app
import os

# app.register_blueprint(app_browse)
# app.register_blueprint(app_search)

#===================================
# Routes ####
#===================================
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/cities')
def cities():
    return render_template('cities.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)