// PROCESS

var ssoUrl = 'https://entrustuat.in'
var ssoAPIUrl = 'https://api.entrustuat.in'
var applicationUrl = 'https://eclaimsuat.europassistance.in/nearestLocations2'
// var applicationUrl = 'http://localhost/nearestLocations'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token')
const oAuthtoken = urlParams.get('oAuthtoken')

const clientID = urlParams.get('clientID')
const redirectURL = urlParams.get('redirectURL')
const userId = urlParams.get('userId')

var authPage = document.getElementById("authPage");
var invalidUser = document.getElementById("invalidUser");

const user = {
    "clientId": clientID,
    "redirectUri": redirectURL,
    "userId": userId,
    "token": oAuthtoken
}
console.log(user, 'user')

const encuser = {
    encryptedData: CryptoJS.AES.encrypt(
        JSON.stringify(user),
        '!hrv7PSJxkzTy#g!+=KzsbLcmU4fW4tgZEr_4WkR'
    ).toString()
};

console.log(encuser, 'encuser')

fetch(`${ssoAPIUrl}/api/auth/oauth2/validateToken`, {
    method: 'POST',
    headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    body: JSON.stringify(encuser)
}).then((authData) => {
    return authData.json()
}).then((data) => {
    console.log(data, 'auto data')
    if(data.code == 200) {
        localStorage.setItem('clientID', clientID)
        localStorage.setItem('redirectURL', redirectURL)
        localStorage.setItem('userId', userId)
        localStorage.setItem('oAuthtoken', oAuthtoken)
        localStorage.setItem('token', token)
        console.log("login Sucess")
        window.location.href = applicationUrl;
    }
    else {
        invalidUser.style.display = "block";
        window.location.href = ssoUrl;
    }
})