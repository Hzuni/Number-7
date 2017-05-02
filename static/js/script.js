var roads_API_Key = 'AIzaSyC7-dOoZ935wU7cldbCpu97aVCr8RLDjGo';
var map;
var busses = [];            // Array of bus types to be defined later.
var bus_mrkrs_len = 0;

// stack of 148 color codes taken from table of color names suppourted by all browsers at: http://www.w3schools.com/colors/colors_names.asp
var clr_stck = ["#C0C0C0", "#808080", "#000000", "#FF0000", "#800000", "#FF0000", "#808000", "#00FF00", "#008000",
"#000FFF", "#008080", "#0000FF", "#000080", "#FF00FF", "#800080"];



google.maps.event.addListenerOnce(map, 'idle', function(){
    
    getter();

});



function initMap() {
    var uluru = {lat: 30.2672, lng: -97.7431};
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
    });
    getter();
}


function Bus(id, lat, lang, marker, path, ts_info){
    this.id = id;
    this.lat = lat;
    this.lang = lang;
    this.marker = marker;
    this.path = path;
    this.snapped_path = new google.maps.Polyline();
    this.color = null;

}


function find_by_id(unq_id, element){

    if (element.id == unq_id){
        return true;
    } else{

        return false;
    }
}


function runSnapToRoad(bus){
   var pathValues = [];
   for ( var i = 0; i < bus.path.length; i++){
       pathValues.push(bus.path[i].toUrlValue());
   }
    $.ajax({
        url: 'https://roads.googleapis.com/v1/snapToRoads',
        data: {
            interpolate: true,
            key: roads_API_Key,
            path: pathValues.join('|')},

        success: function(data){
           var snappedCoordinates = [];
           for (var i = 0; i < data.snappedPoints.length; i++) {
               var latlng = new google.maps.LatLng(
                   data.snappedPoints[i].location.latitude,
                   data.snappedPoints[i].location.longitude);
               snappedCoordinates.push(latlng);
               }


           if (bus.color == null){
               bus.color = clr_stck.pop();
           }

           bus.snapped_path.setMap(null);
           bus.snapped_path = null;
           snappedCoordinates.push(bus.path[bus.path.length -1]);
           
           var snappedPolyLine = new google.maps.Polyline({
                path: snappedCoordinates,
                map: map,
                geodesic: true,
                strokeColor: bus.color,
                strokeWeight: 2
            });
            bus.snapped_path = snappedPolyLine;
        },
        error: function(xhr, status, error){
            console.log(xhr.responseText);
           
        }
    });
    
}


function getter(){
   $.ajax({
       url: '/get',
       success: function(data) {
            
           var ts_info = new google.maps.InfoWindow();
           if(busses.length == 0){
               bus_mrkrs_len = data.duval.length;
               console.log("Number of Busses at Load Time", data.duval.length);

               for( var i = 0; i < bus_mrkrs_len; i++) {

                   var busLatLng =  new google.maps.LatLng(data.duval[i].lat, data.duval[i].lng); 
                   var pathCords = [];
                   pathCords.push(busLatLng);
                   
                   
                   var bus_marker = new google.maps.Marker({
                       position: {lat: data.duval[i].lat, lng: data.duval[i].lng},
                       map: map,
                       title: 'Bus Id: ' + data.duval[i].id + ' Time: ' + data.duval[i].timeStamp
                   });


                   bus_marker.addListener('dblclick', function() {
                        ts_info.setContent(data.duval.timeStamp);
                        ts_info.open(map, bus_marker);
                   });
                   
                   path = [];
                   path.push(busLatLng);

                   busses.push(new Bus(data.duval[i].id,data.duval[i].lat, data.duval[i].lng, bus_marker, path, ts_info));
               }

           }
            else {
                var fnd_cnt = 0;
                console.log("Length of duval array passed from flask:", data.duval.length);

                for( var i = 0; i < data.duval.length; i++) {
                    var bus_fnd = busses.findIndex(find_by_id.bind(null, data.duval[i].id));
                    if (bus_fnd != -1) {
                        
                        if( (data.duval[i].lat != busses[bus_fnd].lat) || (data.duval[i].lng !=  busses[bus_fnd].lng )){
                            /* Only change the update bus data if the bus has moved */
                            var newLatLng = new google.maps.LatLng(data.duval[i].lat, data.duval[i].lng);
                            
                            busses[bus_fnd].marker.setMap(null);
                            busses[bus_fnd].marker.setPosition(newLatLng);
                            busses[bus_fnd].marker.setMap(map);

                            busses[bus_fnd].marker.setTitle('Bus Id: ' + data.duval[i].id + ' Time: ' + data.duval[i].timeStamp);
                            
                            busses[bus_fnd].path.push(newLatLng); 
                            runSnapToRoad(busses[bus_fnd]); 
                            fnd_cnt += 1;
                        }

                   } else {
                       var busLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng };
                       var pathCords = [];
                       pathCords.push(busLatLng);

                       var bus_marker = new google.maps.Marker({
                           position: busLatLng,
                           map: map,
                           title: data.duval[i].id
                       });
                       
                       busses.push(new Bus(data.duval[i].id, bus_marker, path));
                       /*Still haven't accounted for busses which stop running instead
                       am currently just keeping a marker on the map for them. */
                   }
                }
                console.log("Number of Busses found this round: ", fnd_cnt);
            }

       },
       complete: function(){
           setTimeout(getter, 15000);
           // need to include a last updated field
       }
   });
}

