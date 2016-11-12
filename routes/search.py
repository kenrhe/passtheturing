from flask import Blueprint, render_template, request, redirect
from config import db

from browse import city

app_search = Blueprint('search', __name__)

@app_search.route('/search', methods=['GET', 'POST'])
def search():
    item = {}

    if request.method == 'POST':
        form = request.form
        search = form['text'].strip().lower().split(",")
        try:
            if len(search) > 1:
                print "found city + state search"
                city = search[0].strip().replace(" ", "-")
                state = search[1].strip().replace(" ", "-")
                print city
                print state
                city_data = db.cities.find_one({"city" : city, "state" : state})
            else:
                city_data = db.cities.find_one({"city" : form['text'].lower().strip().replace(" ", "-") })

            return redirect('/' + city_data['_id'])
        except TypeError:
            item['error'] = 'Hey, we were unable to find that city.. please contact us for more assistnace.'

        

    return render_template('search.html', **item)