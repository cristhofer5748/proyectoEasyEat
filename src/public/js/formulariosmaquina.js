
if(navigator.geolocation){

    var success = function(position){
    var latitud = position.coords.latitude,
        longitud = position.coords.longitude;
        document.getElementById('latitud').value = latitud;
        document.getElementById('longitud').value = longitud;
    }
    navigator.geolocation.getCurrentPosition(success, function(msg){
    console.error( msg );
    });
    }
  