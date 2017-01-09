// Edited from api docs example: https://developers.google.com/maps/documentation/javascript/examples/polyline-simpe


function getter(){
   $.ajax({
       url: '/get',
       success: function(data) {
               console.log(data.duval);
       },
       complete: function(){
           setTimeout(getter, 30000);
       }
   });
}




$(function() {
   
    console.log("Hi I'm Hasun"); 
    getter();



});

