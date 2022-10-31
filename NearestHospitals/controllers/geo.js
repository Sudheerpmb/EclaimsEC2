$(function () {
    $("#revGeoCod").click(function () {
        let sname = document.getElementById('name').value;
        let street = document.getElementById('street').value;
        let pincode = document.getElementById('Pincode').value;
        let city = document.getElementById('city').value;
        let adress = sname + ' ' + street + ' ' + pincode + ' ' + city;
        // urlgeo='https://maps.googleapis.com/maps/api/geocode/json?latlng=17.4933,78.3914&key=AIzaSyAP8r76dTUNFtejkwPtBv49YmDNfO8fQPs'
        let url='https://maps.googleapis.com/maps/api/geocode/json?address='+adress+'&key=AIzaSyCHE63tfw3AxMsCuRYUF6oqXd8Feu-cXts'
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "GET",
            // data:newForm,
            processData: false,
            contentType: false,
            success: function (data) {
                // alert(data.results[0].geometry.location.lat);
                document.getElementById("lati").innerHTML = data.results[0].geometry.location.lat;
                document.getElementById("lng").innerHTML = data.results[0].geometry.location.lng;
            }
        });
    });

});