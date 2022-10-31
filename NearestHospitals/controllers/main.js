let json;

var rad = function (x) {
    return x * Math.PI / 180;
};

var getDistance = function (p1, p2) {
    var R = 6378137;
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};
let ks = []
let tempPath = [];
let gMap;
var pathUtils = function (i) {
    // tempPath = ks;
    let myCheck = `myCheck${i}`

    var checkBox = document.getElementById(myCheck);

    if (checkBox.checked == true) {
        ks[i].setMap(gMap)
    }
    else {
        ks[i].setMap(null);

    }

}
function initMap() {
    let cordi = { lat: -33.8732, lng: 151.2061 }
    let limit=5;
    let prevC='';
    let prevP='';
    $.ajax({
        async: true,
        crossDomain: true,
        url: `https://eztraveluat.europassistance.in:3000/api/nearestlocations?lattitude=${cordi.lng}&longitude=${cordi.lat}`,
        type: "GET",
        contentType: false,
        processData: false,
        headers: {
            Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjhmN2IzM2FlNDgzM2YwZGNkOTAyMyIsInJvbGUiOiJjdXN0b21lciIsImV4cCI6MTY4Mzk2NDk0OSwiaWF0IjoxNjUyNDI4OTQ5fQ.qCEv1EOxIjtX5hof29XGh6tUfBadOC3Gs7-WG_kGtFE'
        },
        success: function (data) {
            // alert("done1")
            createMarkers(data);
            function createMarkers(data) {
                json = data;
                // alert(json)
                const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                const directionsService = new google.maps.DirectionsService();

                var map;
                var myStyles = [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ];
                var bounds = new google.maps.LatLngBounds();
                var mapOptions = {
                    mapTypeId: 'roadmap',
                    styles: myStyles
                };

                let cordin = { lat: -33.8568, lng: 151.3153 }

                var markers = [[]];
                var infoWindowContent = [];
                var shortV = Number.MAX_VALUE;
                var shortI = 0;
                for (var i = 0; i < json.length; i++) {
                    // alert(`${i} ${json[i].name}`);
                    if (i == 0) {
                        markers = []
                    }
                    let mar = json[i].location.coordinates;
                    let temp = mar[0];
                    mar[0] = mar[1]
                    mar[1] = temp
                    let p2 = { lat: mar[0], lng: mar[1] }
                    let unit = 'Meeters'
                    let dist = getDistance(cordi, p2).toFixed(3)
                    // alert(dist<shortV)
                    if (dist < shortV) {
                        shortI = i
                        shortV = dist
                    }
                    if (dist > 1000) {
                        unit = 'KM';
                        dist = dist / 1000;
                    }

                    mar.unshift(`${json[i].name}`)
                    markers.push(mar)
                    infoWindowContent.push(
                        `<h5 style="color:#656464"><u>${json[i].name}</u> </h5>
                    <h6 style="color:#2d0542f0">Distance: ${dist} ${unit}</h6>`
                    )
                }
                let cons = markers;
                cordin.lat = markers[shortI][1];
                cordin.lng = markers[shortI][2];

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 7,
                    center: cordi,
                    styles: myStyles
                });
                var infoWindow = new google.maps.InfoWindow(), marker, i;
                for (i = 0; i < markers.length; i++) {
                    // alert(infoWindowContent[i-1])
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0]
                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            infoWindow.setContent(infoWindowContent[i]);
                            infoWindow.open(map, marker);
                            click_(markers[i], directionsRenderer, directionsService, cordi);
                        }
                    })(marker, i));


                }


                directionsRenderer.setMap(map);
                directionsService.route(
                    {
                        origin: cordi,
                        destination: cordin,
                        travelMode: 'DRIVING',
                    },
                    (response, status) => {
                        if (status == "OK") {
                            directionsRenderer.setDirections(response);
                        } else {
                            window.alert("Directions request failed due to " + status);
                        }
                    }
                );




                const iconBase = "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
                const icons = {
                    parking: {
                        icon: iconBase + "parking_lot_maps.png",
                    },
                    library: {
                        icon: iconBase + "library_maps.png",
                    },
                    info: {
                        icon: iconBase + "info-i_maps.png",
                    },
                    beach: {
                        icon: 'https://img.icons8.com/nolan/100/map-pin.png'
                    }
                };

                marker = new google.maps.Marker({
                    map: map,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    icon: icons["beach"].icon,
                    position: cordi
                });
                // marker = new google.maps.Marker({
                //     map: map,
                //     draggable: true,
                //     animation: google.maps.Animation.DROP,
                //     position: cordin
                // });



                var click_ = function (marker, directionsRenderer, directionsService, cordi) {
                    window.location = `https://www.google.com/maps?q=${marker[1]},${marker[2]}`;
                    return;
                    let cordin = { lat: marker[1], lng: marker[2] }
                    directionsRenderer.setMap(map);
                    directionsService.route(
                        {
                            origin: cordi,
                            destination: cordin,
                            travelMode: 'DRIVING',
                            provideRouteAlternatives: true
                        },
                        (response, status) => {
                            if (status == "OK") {
                                directionsRenderer.setMap(null);
                                for (i = 0; i < ks.length; i++) {
                                    ks[i].setMap(null);
                                }
                                ks = []
                                let html = ''
                                let randomCol = ["#FF5733", "#6DC700", "#1A1AE8", "#F503FD", "#EEFD03", "#04F0EC"];
                                for (var i = 0; i < response.routes.length; i++) {
                                    var randomColor = randomCol[(Math.floor(Math.random() * 16777215) % 6)];
                                    // alert(randomColor)
                                    var dr = new google.maps.DirectionsRenderer({
                                        suppressMarkers: true,
                                        polylineOptions: {
                                            strokeColor: randomColor
                                        }
                                    });
                                    dr.setDirections(response);
                                    // Tell the DirectionsRenderer which route to display
                                    dr.setRouteIndex(i);
                                    dr.setMap(map);
                                    ks.push(dr)
                                    gMap = map;
                                    tempPath.push(dr)
                                    let steps = '';
                                    for (var j = 0; j < response.routes[i].legs[0].steps.length; j++) {
                                        steps += ('For  <u>' + response.routes[i].legs[0].steps[j].distance.text + '</u> ' + response.routes[i].legs[0].steps[j].instructions);
                                        if (j < response.routes[i].legs[0].steps.length - 1) {
                                            steps += ' then '
                                        }

                                    }
                                    html += `<div style="margin:15px;">
                                <input type="checkbox" class="form-check-input"style="transform: scale(1.4);margin-bottom:10px" id="myCheck${i}" onclick="pathUtils(${i})">
                                <strong><span style="color:blue;margin:15px">Route:${i}:</span></strong><br>
                                 <span style="color:#7E7FFF !important ;margin-top:10px">The distance is ${response.routes[i].legs[0].distance.value / 1000} KM</span>  <br>
                                 <span style="color:#7E7FFF !important"> It will take ${(response.routes[i].legs[0].duration.value / 60).toFixed(3)}Min</span>                                 
                                 </div>
                                 <br>
                                 <div style="margin:10px;">
                                 <p style="color:red">Directions:</p>
                                 <span style="color:#22A3E8">${steps}</span></div>
                                 <hr>`
                                    $('#leftbarI').width('20vw');
                                    $('#leftBarButtoni').css("left", "20vw");
                                    $('#barContent').show()
                                    bar_flag = 1;


                                    // Code ommited to display distance and duration
                                }
                                document.getElementById("barContent").innerHTML = html;

                                // directionsRenderer.setDirections(response);
                            } else {
                                window.alert("Directions request failed due to " + status);
                            }
                        }
                    );

                }
            }
            var onChangeHandler = function () {
                DisplayPoint(map);
            };
            var onChangeHandlerOnSubmit = function () {
                limit=5;
                onChangeHandlerOnpin();
            }
            var onChangeHandlerOnpin = function () {
                DisplayPointpin(map);
            }
            $('#hospitalType').on('change', function (e) {
                onChangeHandlerOnpin()
                // alert(this.value);
            });
            $('#hospitalLimit').on('click', function (e) {
                var pin = document.getElementById('Pincode').value;
                var city = document.getElementById('city').value;
                city = city.charAt(0).toUpperCase() + city.slice(1)
                if(!city&&!pin){
                    return ;
                }
                limit+=5;
                onChangeHandlerOnpin()
                // alert(this.value);
            });
            // document.getElementById('hospitalType').addEventListener('change', onChangeHandlerOnpin);
            document.getElementById('geocod').addEventListener('click', onChangeHandler);
            document.getElementById('revGeoCod').addEventListener('click', onChangeHandlerOnSubmit);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(changeToCurrent);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
            function changeToCurrent(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                // var latLng = new google.maps.LatLng(lat, lng);
                // marker.setPosition(latLng);
                // map.panTo(latLng);
            }

            function DisplayPointpin(map) {
                var type = document.getElementById('hospitalType').value
               
                var pin = document.getElementById('Pincode').value;
                var city = document.getElementById('city').value;
                city = city.charAt(0).toUpperCase() + city.slice(1)
                if(!city&&!pin){
                    return ;
                }
                if (type == 'All')
                    type = ''
                let urlgeo = ''
                if (pin === "")
                    urlgeo = `https://eztraveluat.europassistance.in:3000/eclaims/locationssearch?city=${city}&type=${type}&limit=${limit}`
                else
                    urlgeo = `https://eztraveluat.europassistance.in:3000/eclaims/locationssearch?zip=${pin}&type=${type}&limit=${limit}`
                $.ajax({
                    async: true,
                    crossDomain: true,
                    url: urlgeo,
                    type: "GET",
                    // data:newForm,
                    processData: false,
                    contentType: false,
                    headers: {
                        Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjhmN2IzM2FlNDgzM2YwZGNkOTAyMyIsInJvbGUiOiJjdXN0b21lciIsImV4cCI6MTY4Mzk2NDk0OSwiaWF0IjoxNjUyNDI4OTQ5fQ.qCEv1EOxIjtX5hof29XGh6tUfBadOC3Gs7-WG_kGtFE'
                    },
                    success: function (data) {

                        // let json = data[0]
                        if (data[0])
                            createMarkers(data);
                        else
                            alert("No hospitals found in the pin and the city you have entered")
                        // var latLng = new google.maps.LatLng(json.location.coordinates[1], json.location.coordinates[0]);
                        // marker.setPosition(latLng);
                        // map.panTo(latLng);
                    }
                })
            }

            function DisplayPoint(map) {

                var lat = document.getElementById('lat').value;
                var lng = document.getElementById('long').value;
                var latLng = new google.maps.LatLng(lat, lng);
                marker.setPosition(latLng);
                map.panTo(latLng);
                urlgeo = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyAP8r76dTUNFtejkwPtBv49YmDNfO8fQPs'
                $.ajax({
                    async: true,
                    crossDomain: true,
                    url: urlgeo,
                    type: "GET",
                    // data:newForm,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        let adress = data.results[0].formatted_address;
                        // alert(data.results[0].geometry.location.lat);
                        document.getElementById("Address").innerHTML = adress;
                        // document.getElementById("lng").innerHTML = data.results[0].geometry.location.lng;
                    }
                });

            }
        }
    })

}