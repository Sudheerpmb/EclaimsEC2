function setToStore(key,value){
    localStorage.setItem(key,value);
}

function getFromStore(key){
   return localStorage.getItem(key);
}
function removeFromStore(key){
  localStorage.removeItem(key);
}

function clearStore(){
    localStorage.clear();
}

function isAuthenticated(){
   
    let access_token = getFromStore("token");
    let eclaims_token = getFromStore("eclaimsToken");
    if(!access_token || !eclaims_token){
        alert("Not logged in");
        window.location = env.app_url+'signin-signup.html';
    }
    return false;
}

function httpRequest(url,data){

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://172.16.5.28:82/eclaimsPortal/api/Customer/SendOTP?eCliamToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYjY4NTRkNTNiMDA1NTI1OTM4ZGU2MyIsInJvbGUiOiJjdXN0b21lciIsImV4cCI6MTU3NzU2MTMxNCwiaWF0IjoxNTcyMzc3MzE0fQ.ZRb3rRp90Qr4GUUQsv5hzrEPJSYsN9PDbd6aKDhNNdw",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer fl4CR-2knZmuWY361fvIUuZLwFgxNKBY3UTsNNQcPz2qJSBb1MmZsYMAtPBHwV2PVrhCRQe5_i4tEaP6TePiQeYdMNPsX6ZdI88DVNYCMwrnvMryicd4fW50_8OTkKu1HHB6Xv9qBf62gFwCCVQmzKU5eY8-HLj_A4IlrTpZFdXKRlrWP4-zS6AsA_wY-CQVKvwA4-nsYsmzmca--NLatsEQP3EE0AhRNljePjngTEYrf7wmJWZ8S8XEbMbyyr8JvAjcEkQ_J2bmzYR9scD7pNoMmH2lL2zDIhe1gJFhn6euPQaz6jjt40B9uGQf3l8cRgJyAF5Yvh95KO_olLtp5DazLKYNfF_lOuAi-I5A7o0Z4lXI4UYB-aVZuMc054XDkckPIOpwxQ6b0YKtXBK6DX58Ts_P3AuPHyQR9DNoRzh-ePpOayRiEcu_FnT9FxLi-AgM4GRrLpv4pYpVOPzyF_xUTROWG5lS3Tpiz5nyoZSppr1UhouKrpIl0FA2sdOjYYTPkXp7C4lxlMdB0MvrtU9-m97TgZHBO20iHAsz71GWI8L8Gbj4-Mr-t6ZBHdTaEuz-t4-v0ZBRsQaTs83zdKVxcSJV1XFY1UTBiEETBnTHXnyFNeZsPit5YAXKo_Mm",
          "User-Agent": "PostmanRuntime/7.18.0",
          "Accept": "*/*",
          "Cache-Control": "no-cache",
          "Postman-Token": "f48322e4-9ead-48af-b068-412dc150d551,b7cfef8b-b66f-4ccf-9749-42501476ccdc",
          "Host": "172.16.5.28:82",
          "Accept-Encoding": "gzip, deflate",
          "Content-Length": "0",
          "Connection": "keep-alive",
          "cache-control": "no-cache"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });



//   return  $.ajax({
//         async:true,
//         crossDomain:true,
//         url:  url+'?eCliamToken='+getFromStore("eclaimsToken"), 
//         type: "POST",
//         headers:{
//            "Authorization":"Bearer "+getFromStore("token")
//         },
//         success: function(response) {
//             console.log(response);
//           return response;
//         },
//         error :function(err){
//             console.log(err);
//             return err;
         
//         }
//     });  

}