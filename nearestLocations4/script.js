// PROCESS
var homePage = document.getElementById("homePage");
var authPage = document.getElementById("authPage");
var invalidUser = document.getElementById("invalidUser");
var baseUrl = 'https://eztravelapi2.europassistance.in'
// var baseUrl = 'https://localhost:3000'
var ssoAPIUrl = 'https://api.entrustuat.in'
var ssoUrl = 'https://entrustuat.in'
var retrieveFlag = "App2"
const user = {
    "clientId": localStorage.getItem('clientID'),
    "redirectUri": localStorage.getItem('redirectURL'),
    "userId": localStorage.getItem('userId'),
    "token": localStorage.getItem('oAuthtoken')
}
const encuser = {
    encryptedData: CryptoJS.AES.encrypt(
        JSON.stringify(user),
        '!hrv7PSJxkzTy#g!+=KzsbLcmU4fW4tgZEr_4WkR'
    ).toString()
};
fetch(`${ssoAPIUrl}/api/auth/oauth2/validateToken`, {
    method: 'POST',
    headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    body: JSON.stringify(encuser)
}).then((authData) => {
    return authData.json()
}).then((data) => {
    if(data.code == 200) {
        authPage.style.display = "none";
        homePage.style.display = "block";
    }
    else {
        invalidUser.style.display = "block";
        window.location.href = ssoUrl;
    }
})

fetch(`${baseUrl}/batchJobs/nearestLocations/getLocationCountries?retrieveFlag=${retrieveFlag}`).then((countrydata) => {
    return countrydata.json()
}).then((CountryObjectData) => {
    CountryObjectData = CountryObjectData.filter(function(event){
        return event.country != null;
    });
    let countries = `<option value="">Select Country</option>`
    CountryObjectData.map((cntry) => {
        countries += `<option value="${cntry.country}">${cntry.country}</option>`
    });
    document.getElementById("country").innerHTML = countries
})

function getStates() {
    var selectedCountry = document.getElementById('country').value;
    fetch(`${baseUrl}/batchJobs/nearestLocations/getLocationStates?country=${selectedCountry}&retrieveFlag=${retrieveFlag}`).then((statesdata) => {
        return statesdata.json()
    }).then((StateObjectData) => {
        StateObjectData = StateObjectData.filter(function(event){
            return event.state != null;
        });
        let states = `<option value="">Select State</option>`
        StateObjectData.map((stte) => {
            states += `<option value="${stte.state}">${stte.state}</option>`
        });
        document.getElementById("state").innerHTML = states
    })
}

function getCities() {
    var selectedCountry = document.getElementById('country').value;
    var selectedState = "";
    fetch(`${baseUrl}/batchJobs/nearestLocations/getLocationCities?country=${selectedCountry}&state=${selectedState}&retrieveFlag=${retrieveFlag}`).then((citiesdata) => {
        return citiesdata.json()
    }).then((CityObjectData) => {
        CityObjectData = CityObjectData.filter(function(event){
            return event.city != null;
        });
        let cities = `<option value="">Select City</option>`
        CityObjectData.map((cty) => {
            cities += `<option value="${cty.city}">${cty.city}</option>`
        });
        document.getElementById("city").innerHTML = cities
    })
}

function myFuntion() {
    console.log("Button Clicked")
    var cityy = document.getElementById('city').value;
    var statee = document.getElementById('state').value;
    var countryy = document.getElementById('country').value;

    var city = cityy.trim();
    var state = statee.trim();
    var country = countryy.trim();


    console.log(city, state, country)
    fetch(`${baseUrl}/batchJobs/nearestLocations/getLocations?city=${city}&state=${state}&country=${country}&retrieveFlag=${retrieveFlag}`).then((data) => {
        console.log(data, 'datra')
        return data.json()
    }).then((ObjectData) => {
        console.log(ObjectData, 'ObjectData')
        if (ObjectData.length == 0) {
            alert("There is no data with given data")
        }
        let locationData = ""
        ObjectData.map((values) => {
            locationData += ` <tr>
        <td>${values.provider}</td>
        <td style="text-align: right;">${values.phone}</td>
        <td>${values.address}</td>
        <td>${values.country ? values.country : ''}</td>
        <td>${values.state ? values.state : ''}</td>
        <td>${values.city ? values.city : ''}</td>
      </tr>`
        });
        document.getElementById("tableBody").innerHTML = locationData
    })
}


function logout() {
    let tokenn = localStorage.getItem('token')
    localStorage.removeItem('clientID')
    localStorage.removeItem('redirectURL')
    localStorage.removeItem('userId')
    localStorage.removeItem('oAuthtoken')
    localStorage.removeItem('token')
    fetch(`${ssoAPIUrl}/api/auth/oauth2/DestroySession`, {
        method: 'POST',
        headers: {
          Authorization: tokenn,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
    }).then(() => {        
        window.location.href = ssoUrl;
    })
}