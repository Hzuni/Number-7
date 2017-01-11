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



function id_finder(unq_id, element){
    console.log(element.title, unq_id); 
    if (element.title == unq_id){

        return true;

    } else{

        return false;

    }
}


function getter(){
   $.ajax({
       url: '/get',
       success: function(data) {
           
           if(busses_mrkr.length == 0){
               
               bus_mrkrs_len = data.duval.length;
               console.log(data.duval.length);

               for( var i = 0; i < bus_mrkrs_len; i++){

                   var newLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng };
                   
                   busses_mrkr.push( new google.maps.Marker({
                       position: newLatLng,
                       map: map,
                       title: data.duval[i].id
                   }));

               }
               console.log(busses_mrkr);
            }
            else {
                var lst_cnt = 0;
                var fnd_cnt = 0;
                for( var i = 0; i < data.duval.length; i++) {
                    var bus_fnd = busses_mrkr.findIndex(id_finder.bind(null, data.duval[i].id));
                    console.log( bus_fnd);
                    
                    if (bus_fnd != -1) {
                        busses_mrkr[bus_fnd].setMap(null);
                        busses_mrkr[bus_fnd] = null;
                        console.log("drawing new map point");

                        var newLatLng =  { lat: data.duval[i].lat, lng: data.duval[i].lng };
                         
                        var u_mrkr = new google.maps.Marker({
                           position: newLatLng,
                           map: map,
                           title: data.duval[i].id
                        });

                        busses_mrkr[bus_fnd] = u_mrkr;
                        fnd_cnt += 1;

                   } else {

                       lst_cnt +=1;
                   }

                    
                }
    
            }
                       
       },
       complete: function(){
           setTimeout(getter, 30000);
           // need to include a last updated field
       }
   });
}

