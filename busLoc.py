import json

f = open('/home/hasun/bus_locations/vehiclepositions.json')
s = f.read()
pos = json.loads(s)
entities = pos['entity']

for e in entities:
    busNO = str(e['vehicle']['trip']['route_id']).strip()
    if len(busNO) > 0:
        if int(busNO) == 7:
            print '{lat: %s, lng: %s},' % (e['vehicle']['position']['latitude'], e['vehicle']['position']['longitude'])






