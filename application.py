'''
Authored by: Kenneth Rhee, Hak Joon Lee, Joe Goodman
Email: kennethhrhee@gmail.com, thejoonshow@gmail.com, goodman.a.joseph@gmail.com
'''

from routes.browse import app_browse
from routes.search import app_search
from flask import render_template, request, send_from_directory
from config import application, db
import os

application.register_blueprint(app_browse)
application.register_blueprint(app_search)

#===================================
# Routes ####
#===================================
@application.route('/')
def index():
	return render_template('index.html')

@application.route('/cities')
def cities():
    return render_template('cities.html')

@application.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port)