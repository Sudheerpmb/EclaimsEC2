function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });

    // var userDetails = JSON.parse(getFromStore("user"));
    // var clientId = userDetails.clientId;
    var clientId = getFromStore("clientHash");
    clearStore();
    window.location = env.app_url + "signin-signup.html?clientId=" + clientId;

}

function onLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init();
    });
}



function sendOtp(mode) {
    var eclaims_token = getFromStore("eclaimsToken");
    var access_token = getFromStore("token");
    var user = JSON.parse(getFromStore("user"))
    if (mode == 'Email') {
        var url = env.api_url + "/api/Customer/SendOTP?eclaimToken=" + eclaims_token + "&mode=" + mode;
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "POST",
            data: "",
            headers: {
                Authorization: "Bearer " + access_token
            },
            success: function (data) {
                let json = JSON.parse(data);

                setToStore("otp", json.otp);
                let googleLogin = getFromStore("googleLogin")
                if (parseInt(googleLogin)) {
                    sendmail(user.email, 'No-reply-otp', `your otp is ${json.otp}`)
                }
                toastr.success('OTP sent successfully');
            },
            error: function (err) {
                console.log(err);
                toastr.error('Whoops! This didn\'t work. Please contact us.');
            }
        });
    }
    else {
        var url = env.node_api_url + "auth/communicate/sendOtpSmsOnly?phoneNumber=91" + user.mobile;
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "GET",
            processData: false,
            contentType: false,
            headers: {
                Authorization: "Bearer " + eclaims_token
            },
            success: function (data) {
                setToStore("otp", data.otp);
                toastr.success('OTP sent successfully');
            },
            error: function (err) {
                console.log(err);
                toastr.error('Whoops! This didn\'t work. Please contact us.');
            }
        });
    }
}

function checkIfOtpverified() {
    if (getFromStore("otpVerified") == "true") {
        window.location = env.app_url + "eligibility.html";
    }

}
function sendmail(email, subject, body) {
    alert("email has been send to your Regestered mail")
    var eclaims_token = getFromStore("eclaimsToken");
    $.ajax({
        async: true,
        crossDomain: true,
        url: env.node_api_url + 'api/communicate/sendEmails_new',
        type: "POST",
        data: JSON.stringify({
            "email": email,
            "name": " ",
            "subject": `${subject} `,
            "body": `${body}`
        }),
        contentType: "application/json",
        processData: false,
        headers: {
            Authorization: "Bearer " + eclaims_token
        },
        success: function (data) {
            console.log("mail sent")
        },
        error: function (err) {
            console.log(err);
            $("#ajaxStart").removeAttr("disabled", false);
            $("#ajaxStart").html("Continue");
            toastr.error('Whoops! This didn\'t work. Please contact us.');
        }
    })

}

function uploadPolicy() {

    setToStore("nonExistingCustomer", true);
    window.location = env.app_url + 'coverage.html';
}


//function validateOtp(otp1,otp2,otp3,otp4,otp5,otp6){
function validateOtp(otp) {
    //otp = ""+otp1+otp2+otp3+otp4+otp5+otp6;

    if (otp == getFromStore("otp")) {
        setToStore("otpVerified", true);
        window.location = env.app_url + "eligibility.html";
    } else {
        toastr.error("Invalid OTP");
        return false;
    }


}
// 

function getPolicy(policyNumber) {
    let payload = JSON.stringify({
        "ConsumerDetails":{"ConsumerId":"IT123","ConsumerPassword":"Pass@1234"},
        "PolicyDetailsInputDC":{"PolicyNo":policyNumber}
    });
    $.ajax({
                async: true,
                crossDomain: true,
                url: env.node_api_url + 'api/saveRelainceData',
                type: "POST",
                data: JSON.stringify( {
                    "provider": "RELIANCE",
                    "policyNumber":policyNumber
                }),
                headers: {
                    Authorization: "Bearer " +  getFromStore("eclaimsToken")
                },
                success: function (res) {
                    window.location = env.app_url + "coverage.html";
                    console.log(res);

                }
            })
}
async  function validatePolicy(insuranceProvider, policyNumber, incidentDate) {
   
    if (policyNumber == '') {
        toastr.error('Please Enter Policy Number');
        return false;
    }

    if (incidentDate == '') {
        toastr.error('Please Enter Incident Date');
        return false;
    }
    setToStore("PolicyNumber_", policyNumber);
    let incDate = incidentDate.split('-');
    var incCreateDate = incDate[2] + "-" + incDate[1] + "-" + incDate[0];
    var varDate = new Date(incCreateDate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (varDate > today) {
        toastr.error('Incident date cannot be a future date');
        return false;
    }
    insuranceProviderpath = insuranceProvider.split(" ").join("").toUpperCase();    
    var eclaims_token = getFromStore("eclaimsToken");
    var access_token = getFromStore("token");
    let cH=getFromStore('clientHash');
    var url = env.node_api_url +"eclaims/policyDetailAccordingToPolicyNumberAndDate";
        // alert('LE');
    $.ajax({
        async: true,
        crossDomain: true,
        url: url,
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify({
            "policyNumber" :policyNumber ,
            "providerUUID" : cH
        }),
        headers: {
            Authorization: "Bearer " + eclaims_token
        },
        success:  function (Result1) {
            let json = Result1;
            if (insuranceProvider == 'RELIANCEE') {
                if (json.length > 0) {
                    $.ajax({
                        async: true,
                        crossDomain: true,
                        url: env.node_api_url + 'api/saveRelainceData',
                        type: "POST",
                        data:{
                            "provider": "RELIANCE",
                            "policyNumber":policyNumber
                        },
                        headers: {
                            Authorization: "Bearer " +  getFromStore("eclaimsToken")
                        },
                        success: function (res) {
                            window.location = env.app_url + "coverage.html";
                            console.log(res);
        
                        }
                    })

                }
            }
            if (Result1 == "Details not found") {
                console.log(Result1);
                if (insuranceProvider == "EUROPASSISTANCE" || insuranceProvider == "RELIANCE") {
                    window.location = env.app_url + "coverage.html";
                }
                else {
                    toastr.error('invalid policy number');
                }
            }
            setToStore("incidentDate", incidentDate);

            if (json.length > 0) {
                var policyStartDate = new Date(json[0].policyStartDate);
                var policyEndDate = new Date(json[0].policyEndDate);
                var dateMomentObject = moment(incidentDate, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
                var incDate = dateMomentObject.toDate();
                $("#expired_block").hide();
                $("#policy_notfound_block").hide();

                if (policyStartDate < incDate && policyEndDate > incDate) {

                    var user = {};
                    user.firstName = json[0].customers.FirstName;
                    user.lastName = json[0].customers.LastName;
                    user.email = json[0].customers.Email;
                    user.mobile = json[0].customers.PhoneNumber;
                    user.policyNumber = json[0].policyNumber;
                    // user.customerRef = json[0].customers.customerRef;
                    // user.travelPolicyRef = json[0].travelPolicyRef;
                    var userjson = JSON.stringify(user);

                    setToStore("policyDetails", userjson);

                    window.location = env.app_url + "coverage.html";
                } else {
                    toastr.error(`incident date must be with in ${policyStartDate} and ${policyEndDate}`);
                    $("#expired_block").show();
                    $("#btn_continue").hide();
                }

            } else {
                if (env.ezTravel.indexOf(insuranceProvider) > -1) {
                    toastr.error("Policy doesnt exist.");
                    $("#expired_block").show();
                    $("#btn_continue").hide();
                } else {
                    toastr.info("Modify the policy details and try again or continue without policy.");
                    $("#expired_block").hide();
                    $("#policy_notfound_block").show();
                    $("#btn_continue").hide();
                }


            }
        },
        error: function (err) {

            console.log(err);
            toastr.error('Policy doesnt exist');

        }
    });


}
