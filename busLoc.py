#!/usr/bin/env python

import json
from flask import Flask, jsonify, make_response
from flask import render_template
import urllib


def retrieve_json():
    urllib.urlretrieve('https://data.texas.gov/download/cuc7-ywmd/text%2Fplain', 'vehiclepositions.json')

f = open('/home/hasun/Number-7/vehiclepositions.json')
s = f.read()
pos = json.loads(s)
entities = pos['entity']
app = Flask(__name__)

no_sevs = []

for e in entities:
    busNO = str(e['vehicle']['trip']['route_id']).strip()
    if len(busNO) > 0:
        if int(busNO) == 7:
            no_sevs.append({
                'id'  : e['vehicle']['vehicle']['id'],
                'lat' : e['vehicle']['position']['latitude'], 
                'lng' : e['vehicle']['position']['longitude'],
                'stop_id' : e['vehicle']['stop_id']})



@app.route('/get', methods=['GET'])
def get_tasks():
    return jsonify({'duval':no_sevs})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/')
def index():
    return render_template('./main.html')
   
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')











