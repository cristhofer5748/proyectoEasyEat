restaFechas = function(f1,f2)
 {
 var aFecha1 = f1.split('/');
 var aFecha2 = f2.split('/');
 var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
 var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
 var dif = fFecha2 - fFecha1;
 var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
 return dias;
 }


function initMap() {
var hoy = new Date();
    let fecha = hoy.getDay()+'/'+ (hoy.getMonth()+1)+'/'+ hoy.getFullYear();
 
  fetch("http://localhost:8080/rutasdemaquinas")
  .then((res) => res.json())
  .then((data) => {
    const myLatLng = { lat: 15.783471, lng: -90.230759 };
  const map = new google.maps.Map(document.getElementById("map"), {
    mapId: '3b4917ee32ca31af',
    center: myLatLng,
    zoom: 8
  });
    for(let i = 0; i<data.length;i++){
    let colormarcador =((restaFechas(data[i].fecharevision,fecha))+1)
    console.log(colormarcador)
  const contentString =
  `<h2 id="firstHeading" class="firstHeading">Numero de Ruta</h2>` +
  `<h3>${data[i].id}</h3>`+
  `<h2 id="firstHeading" class="firstHeading">Lugar de Maquina</h2>` +
  `<h3>${data[i].lugar}</h3>`+
  '<div id="bodyContent">' +
  `<h2><b>Empleado</b></h2>` +
  `<h3>${data[i].nombre}</h3>`+
  `<h2><b>Dias Transcuridos</b></h2>` +
  `<h3>${colormarcador}</h3>`+
  `<button class="btn btn-primary btn-block botonguardar">Fijar Ruta</button>`+
  `</div>`;
const infowindow = new google.maps.InfoWindow({
  content: contentString,
});
var icono ;

if(colormarcador>=0 && colormarcador <5){
  icono = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
}else if(colormarcador>=5 && colormarcador <9){
  icono = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
}else if(colormarcador>=9){
  icono = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
}
const marker = new google.maps.Marker({
  position: { lat: data[i].latitud, lng: data[i].longitud },
  map,
  title: `${data[i].lugar} Ruta No. ${data[i].id}`,
  icon: icono
});

marker.addListener("click", () => {
  infowindow.open(map, marker);
});
    }
   
  })
  .catch((error)=>{
      console.log(error)
  })
  }



