
var roads_API_Key = 'AIzaSyDPdsPXbCWrvsQ3NSoCK_IPBicj8Ti-Tws';
var map;
var busses = [];            // Array of bus types to be defined later.
var bus_mrkrs_len = 0;

// stack of 148 color codes taken from table of color names suppourted by all browsers at: http://www.w3schools.com/colors/colors_names.asp

var clr_stck = ["#C0C0C0", "#808080", "#000000", "#FF0000", "#800000", "#FF0000", "#808000", "#00FF00", "#008000",
"#000FFF", "#008080", "#0000FF", "#000080", "#FF00FF", "#800080"];


function initMap() {
    var uluru = {lat: 30.2672, lng: -97.7431};
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
    });
    getter();
}


function Bus(id, marker, path){
    this.id = id;
    this.marker = marker;
    this.path = path;
}


function find_by_id(unq_id, element){

    // Checks the ids busses_mrkr to find the uniq_id.
    if (element.id == unq_id){
        return true;
    } else{

        return false;
    }
}


function runSnapToRoad(path){
   var pathValues = [];
   for ( var i = 0; i < path.getLenght(); i++){
       pathValues.push(path.getAt(i).toUrlValue());
   }
}


function getter(){
   $.ajax({
       url: '/get',
       success: function(data) {

           if(busses.length == 0){
               bus_mrkrs_len = data.duval.length;
               console.log("Number of Busses at Load Time", data.duval.length);

               for( var i = 0; i < bus_mrkrs_len; i++){

                   var busLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng };
                   var pathCords = [];
                   pathCords.push(busLatLng);

                   var bus_marker = new google.maps.Marker({
                       position: busLatLng,
                       map: map,
                       title: data.duval[i].id
                   });

                   var path = new google.maps.Polyline({
                       path: pathCords,
                       map: map,
                       strokeColor: clr_stck.pop(),
                       stokeOpacity: 1.0,
                       strokeWeight: 2
                   });

                   busses.push(new Bus(data.duval[i].id, bus_marker, path));
               }

           }
            else {
                var fnd_cnt = 0;
                console.log("Length of duval array passed from flask:", data.duval.length);

                for( var i = 0; i < data.duval.length; i++) {
                    var bus_fnd = busses.findIndex(find_by_id.bind(null, data.duval[i].id));
                    if (bus_fnd != -1) {
                        
                        var newLatLng = new google.maps.LatLng(data.duval[i].lat,
                        data.duval[i].lng)

                        console.log(newLatLng.toUrlValue());
                        busses[bus_fnd].marker.setMap(null);
                        busses[bus_fnd].marker.setPosition(newLatLng);
                        busses[bus_fnd].marker.setMap(map);

                        busses[bus_fnd].path.setMap(null);
                        busses[bus_fnd].path.getPath().push(newLatLng); 
                        // Adds a new point to the end of the path.
                        busses[bus_fnd].path.setMap(map);
                        fnd_cnt += 1;

                   } else {
                       var busLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng };
                       var pathCords = [];
                       pathCords.push(busLatLng);

                       var bus_marker = new google.maps.Marker({
                           position: busLatLng,
                           map: map,
                           title: data.duval[i].id
                       });

                       var path = new google.maps.Polyline({
                           path: pathCords,
                           strokeColor: '#FF0000',
                           stokeOpacity: 1.0,
                           strokeWeight: 2
                       });
                       busses.push(new Bus(data.duval[i].id, bus_marker, path));
                       /*Still haven't accounted for busses which stop running instead
                       am currently just keeping a marker on the map for them. */
                   }
                }
                console.log("Number of Busses found this Round", fnd_cnt);
            }

       },
       complete: function(){
           setTimeout(getter, 30000);
           // need to include a last updated field
       }
   });
}
