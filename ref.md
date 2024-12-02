info about winter sports:
https://wiki.openstreetmap.org/wiki/Winter_sports

reference of available ski lift types:
https://wiki.openstreetmap.org/wiki/Key:aerialway

query:
https://api.openskimap.org/search?query=val%20cenis

how to get the lift id?

id can be RunFeature | LiftFeature | SkiAreaFeature;

info > infoControl > index > state

Val Cenis: Escargot ID
ea52c5b45de339c0165ca1a728b2a837738ea74f

https://api.openskimap.org/features/329195112.geojson
https://api.openskimap.org/features/59238b7dacb5d16796acf61c8f2c69618808b491.geojson

"https://api.openskimap.org/features/" + entityID + ".geojson"

get details using ski lift id
https://www.openstreetmap.org/way/29877377#map=17/47.408730/12.713059
https://api.openstreetmap.org/api/0.6/way/29877377

openstreetmap api
https://api.openstreetmap.org/api/0.6/node/ea52c5b45de339c0165ca1a728b2a837738ea74f
https://www.openstreetmap.org/api/0.6/map?bbox=<left>,<bottom>,<right>,<top>

curl "https://overpass-api.de/api/interpreter?data=[out:json];node['aerialway'](around:5000,47.4425,12.7426);out;"

curl for all lifts in certain area
https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22aerialway%22%5D%28around%3A5000%2C45.2855%2C6.9284%29%3Bway%5B%22aerialway%22%5D%28around%3A5000%2C45.2855%2C6.9284%29%3Brelation%5B%22aerialway%22%5D%28around%3A5000%2C45.2855%2C6.9284%29%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B

[out:json][timeout:25];
(
// Search for nodes with the key "aerialway" within 5000 meters of the given coordinates (45.2855, 6.9284)
node["aerialway"](around:5000, 45.2855, 6.9284);

// Search for ways with the key "aerialway" within 5000 meters of the given coordinates
way["aerialway"](around:5000, 45.2855, 6.9284);

// Search for relations with the key "aerialway" within 5000 meters of the given coordinates
relation["aerialway"](around:5000, 45.2855, 6.9284);
);

// Output the main elements
out body;

// Retrieve all referenced nodes for these elements

> ;

// Output the skeleton of the data for faster processing
out skel qt;

steps

1. get bounding box on name:
   https://nominatim.openstreetmap.org/search?format=json&q=leogang

2. convert bounding box from nominatim; switch [1] and [2]
   then use overpass.turbo.eu with this data: (or convert it into a url request)

[out:json][timeout:25];
(
way["aerialway]
// Define the bounding box from Nominatim's output
(47.402, 12.623, 47.442, 12.683);
);
out body;

;
out skel qt;

.. and we got a list with lifts and details

3. show lift by id
   https://www.openstreetmap.org/way/48199277
