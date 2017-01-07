// Edited from api docs example: https://developers.google.com/maps/documentation/javascript/examples/polyline-simple


function initMap() {
        
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 30.2672, lng: -97.7431},
            mapTypeId: 'terrain'
        });

        var flightPlanCoordinates = [
        {lat: 30.3198929, lng: -97.7132339},
        {lat: 30.2191334, lng: -97.74392},
        {lat: 30.2440758, lng: -97.72989},
        {lat: 30.3324318, lng: -97.70332},
        {lat: 30.1903133, lng: -97.7448654},
        {lat: 30.3402977, lng: -97.6911},
        {lat: 30.19001, lng: -97.76748},
        {lat: 30.2709427, lng: -97.74436},
        {lat: 30.22862, lng: -97.73968},
        {lat: 30.27262, lng: -97.74069},
        {lat: 30.1899281, lng: -97.76757},
        {lat: 30.3402157, lng: -97.69125},
        {lat: 30.333065, lng: -97.7049},
        {lat: 30.1978474, lng: -97.752655},
        {lat: 30.2687969, lng: -97.74642},
        {lat: 30.28901, lng: -97.73457},
        {lat: 30.3073254, lng: -97.72447}
        ];
        
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            trokeColor: '#FF0000',
            trokeOpacity: 1.0,
            trokeWeight: 2
        });

        flightPath.setMap(map);
}
