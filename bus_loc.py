import json
from flask import Flask, jsonify, make_response
from flask import render_template
import urllib
import time
import threading
import datetime 
import pytz
from pytz import timezone
from threading import Lock
import sys
import os
from flask import send_from_directory

no_sevs = []
fmt = '%H:%M:%S'
austin_tm = timezone('US/Central')

app = Flask(__name__)

def retrv_no_sevs():
    ns_lock.acquire()
    global no_sevs
    try:
        no_sevs = []
        urllib.urlretrieve('https://data.texas.gov/download/cuc7-ywmd/text%2Fplain', 'vehiclepositions.json')
        f = open('/home/hasun/Number-7/vehiclepositions.json')
        s = f.read()
        pos = json.loads(s)
        entities = pos['entity']

        for e in entities:
            busNO = str(e['vehicle']['trip']['route_id']).strip()
            if len(busNO) > 0:
                if int(busNO) == 7:
                    utc_dt = datetime.datetime.utcfromtimestamp(e['vehicle']['timestamp'])
                    no_sevs.append({
                        'id'  : e['vehicle']['vehicle']['id'],
                        'lat' : e['vehicle']['position']['latitude'], 
                        'lng' : e['vehicle']['position']['longitude'],
                        'stop_id' : e['vehicle']['stop_id'],
                        'timeStamp' : pytz.utc.localize(utc_dt).astimezone(austin_tm).strftime(fmt)
                        })

    finally:
        print 'rtrvr releasing lock'
        sys.stdout.flush()
        ns_lock.release()
        

def refreshBusData():
    while True:
       retrv_no_sevs()
       time.sleep(15)


@app.route('/get', methods=['GET'])
def get_tasks():
    ns_lock.acquire() 
    try:
        no_sevs
        s = jsonify({'duval':no_sevs})
    finally:
        print 'getr releasing lock'
        ns_lock.release()
    return s

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)



@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                                   'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
def index():
    return render_template('./main.html')
   
if __name__ == '__main__':
    ns_lock = Lock()
    retrv_no_sevs()
    thread = threading.Thread( target =  refreshBusData, args = () )
    thread.daemon = True
    thread.start()
    app.run(debug=True, host='0.0.0.0', use_reloader=False)











