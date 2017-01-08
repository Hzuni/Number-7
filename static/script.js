// Edited from api docs example: https://developers.google.com/maps/documentation/javascript/examples/polyline-simpe

$(function() {
   console.log("Hi I'm Hasun"); 


   $.get( "/get", function(data){
       for( i = 0; i < data.duval.length; i++){
           console.log(data.duval[i]);
       }
   });

});

