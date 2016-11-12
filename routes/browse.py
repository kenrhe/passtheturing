# from config import db
from flask import Blueprint, render_template, request, redirect
from config import db

app_browse = Blueprint('browse', __name__)

@app_browse.route('/browse')
def browse():
	return render_template('browse.html')

@app_browse.route('/us/<state>/<city>')
def city(state, city):
	city = db.cities.find_one({"_id" : 'us/' + state + '/' + city })
	return render_template('city.html', city=city)

@app_browse.route('/locations')
def locations():
    cities = db.cities.find()
    return render_template('locations.html', cities=cities)