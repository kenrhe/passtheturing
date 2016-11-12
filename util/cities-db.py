from pymongo import MongoClient
import pymongo
import sys

def clean(word):
    return word.lower().strip().replace(' ', '-')

uri = 'mongodb://admin:travelapp123@ds011238.mlab.com:11238/travelapplication'
mc = MongoClient(uri)
db = mc.travelapplication

us_cities = open('us-cities-sample.csv').read()
lines = us_cities.split('\r')
print "len: " + str(len(lines))

cities = []

test = False
#print info
for line in lines:
    info = line.split(',')
    print info
    if info[0] == 'id':
        continue
    city = clean(info[1])
    state_code = clean(info[3])
    state = clean(info[4])
    country_code = 'us'

    z = info[5].split(',')
    zip_codes = z if type(z) is list else [z]
    try:
        lat = float(info[7])
        lon = float(info[8])
    except ValueError:
        lat = 0.0
        lon = 0.0
    try:
        population = int(info[10])
    except ValueError:
        population = 0

    if (test):
        # print info
        print "name = %s" % city
        print "state code = %s" % state_code
        print "state = %s" % state
        print "zip = %s" % str(zip_codes)
        print "lat = %f" % lat
        print "lon = %f" % lon
        print "population = %i" % population
        print "############################"
    else:

        query = 'us/'+ state_code +'/'+ city
        json = {
            '_id' : query,
            'city' : city,
            'state_code' : state_code,
            'state' : state,
            'zip_codes' : zip_codes,
            'loc' : {
                'type' : 'Point',
                'coordinates' : [lon, lat]
            },
            'population' : population
        }
        db.cities.insert(json)
        # except:
        #     print "not valid"
    #count = count + 1