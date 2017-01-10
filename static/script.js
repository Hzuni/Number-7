// Edited from api docs example: https://developers.google.com/maps/documentation/javascript/examples/polyline-simpe

var map;
var busses_mrkr = [];
var bus_mrkrs_len = 0;


function initMap() {
    var uluru = {lat: 30.2672, lng: -97.7431};
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
    });
    getter();
}
    

function getter(){
   $.ajax({
       url: '/get',
       success: function(data) {
           // console.log(data.duval[0].lat, data.duval[0].lng);
           if(busses_mrkr.length == 0){
               bus_mrkrs_len = busses_mrkr.length
               console.log(data.duval.length);
               for( var i = 0; i < bus_mrkrs_len; i++){

                   var newLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng }         
                   busses_mrkr.push( new google.Marker({
                       position: newLatLng,
                       map: map,
                       title: data.duval[i].id
                   }));
               }
               console.log(busses_mrkr);
            }
            else {
                console.log("bus markers length isn't 0");
            }
                       
       },
       complete: function(){
           setTimeout(getter, 30000);
           // need to include a last updated field
       }
   });
}

