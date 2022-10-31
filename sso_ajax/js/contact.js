$(document).ready(function () {
  $("#contact-modal").modal("show");
  $("#contactForm").submit(function (event) {
    submitForm();
    return false;
  });

  $("#otpForm").submit(function (event) {
    submitForm_();
    return false;
  });
});
// function to handle form submit
function submitForm() {
  var x = $("#contactForm").serializeArray();
  let data = JSON.stringify( {
    email: x[0].value,
    password: x[1].value,
  });
  $.ajax({
    async: true,
    crossDomain: true,
    type: "POST",
    contentType: "application/json",
    processData: false,
    url: "http://13.127.236.87:3003/api/users/encryptData",
    data: JSON.stringify( {
      text: data,
    }),
    success: function (response) {
      $.ajax({
        type: "POST",
        url: "http://13.127.236.87:3003/api/users/login",
        cache: false,
        data: {
          encryptedData: response.msg,
        },
        success: function (response) {
          $("#contact-modal").modal("hide");
          $("#contact-modal_").modal("show");
        },
        error: function (response) {
          // console.log(response.responseJSON.msg)
          alert(response.responseJSON.msg);
        },
      });
    },
    error: function () {
      alert("Error");
    },
  });
}
function submitForm_() {
  var x = $("#otpForm").serializeArray();
  let data = {
    email: x[0].value,
    otp: x[1].value,
  };
  $.ajax({
    type: "POST",
    async: true,
    crossDomain: true,
    contentType: "application/json",
    processData: false,
    url: "http://13.127.236.87:3003/api/users/encryptData",
    cache: false,
    data: {
      text: data,
    },
    success: function (response) {
      $("#contact-modal").modal("hide");
      $("#contact-modal_").modal("show");
      $.ajax({
        type: "POST",
        url: "http://13.127.236.87:3003/api/users/consumeLogInOtpEmail",
        cache: false,
        data: {
          encryptedData: response.msg,
        },
        success: function (response) {
          let text = response.data.toString();
          $.ajax({
            type: "POST",
            url: "http://13.127.236.87:3003/api/users/decryptData",
            cache: false,
            data: {
              text: text,
            },
            success: function (response) {
              response.msg.userData.id = response.msg.userData._id;
              console.log(response);
              $("#contact-modal_").modal("hide");
              $.ajax({
                type: "POST",
                url: "https://wrapperapi.europassistance.in/api/Customer/GoogleLogin",
                cache: false,
                data: response.msg.userData,
                success: function (res) {
                  let response = JSON.parse(res);
                  var user = {};
                  user.firstName = response.firstName;
                  user.lastName = response.lastName;
                  user.email = response.email;
                  user.mobile = response.mobile;
                  user.clientId = getFromStore("clientIDNM");
                  setToStore("user", JSON.stringify(user));
                  setToStore("eclaimsToken", response.eclaimToken);
                  setToStore("token", response.access_token);
                  window.location =
                    "https://eclaimsuat.europassistance.in/index.html";
                },
                error: function () {
                  alert("Error");
                },
              });
            },
            error: function () {
              alert("Error");
            },
          });
        },
        error: function () {
          alert("Error");
        },
      });
    },
    error: function (response) {
      // console.log(response.responseJSON.msg)
      alert(response.responseJSON.msg);
    },
  });
}
