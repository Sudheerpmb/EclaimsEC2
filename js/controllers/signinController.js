function getClientName(uuid) {
  let url = `${env.node_api_url}batchJobs/insuranceProviders/getByUUID?uuid=${uuid}`;
  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    type: "GET",
    success: function (response) {
      if(response.length==0){
        {
          toastr.error("Invalid url");
          window.location = env.app_url + "404.html";
        }
      }
      window.clientId = response[0].clientName;
      setToStore("clientIDNM", clientId);
      document.getElementById("tataEmg").src = 'images/' + clientId + '.jpg';
      if (!clientId) {
        toastr.error("Invalid url");
        window.location = env.app_url + "404.html";
      }
    },
    error: function (err) {
      console.log(err);
      toastr.error("Error Occure, Please contact adminstrator");
    },
  });
}
$(function () {
  /**
   * Login and Authenticate
   */

  $("#signin").validate({
    rules: {
      signin_email: {
        required: true,
        email: true,
      },
      signin_password: {
        required: true,
      },
    },
    messages: {
      signin_email: "Please enter a valid email address",
    },
    submitHandler: function (form) {
      $.ajax({
        async: true,
        crossDomain: true,
        url: env.node_api_url + "batchJobs/getTokenEclaims",
        type: "POST",
        processData: false,
        contentType: false,
        contentType: "application/json",
        data:JSON.stringify({
          "username": form.signin_email.value,
          "password": form.signin_password.value,
        }),
        success: function (response) {
          console.log(response);
          var user = {};
          user.firstName = response.firstName;
          user.lastName = response.lastName;
          user.email = response.email;
          user.mobile = response.mobile;
          user.dob = response.dob ? response.dob : "";
          user.gender = response.gender ? response.gender : "";
          user.clientId = clientId;

          var userjson = JSON.stringify(user);
          setToStore("googleLogin", 0);
          setToStore("otpVerified", true);
          setToStore("user", userjson);
          setToStore("token", response.eclaimToken);
          setToStore("eclaimsToken", response.eclaimToken);
          window.location = env.app_url + "index.html";
        },
        error: function (err) {
          console.log(err);
          toastr.error("Incorrect Username or Password");
        },
      });

      return false;
    },
  });

  /**
   *
   * Reset Password
   */
  $("#resetPassword").validate({
    rules: {
      resetEmail: {
        required: true,
        email: true,
      },
    },
    messages: {
      resetEmail: "Please enter a valid email address",
    },
    submitHandler: function (form) {
      $.ajax({
        async: true,
        crossDomain: true,
        url:env.node_api_url +"auth/EclaimsforgotPassWord",
        type: "POST",
        data: {"email":form.resetEmail.value},
        success: function (response) {
          alert(response);
          location.reload();
        },
        error: function (err) {
          console.log(err);
          toastr.error("Error Occure, Please contact adminstrator");
        },
      });

      return false;
    },
  });

  /**
   *
   * Register User.
   */

  $("#registration").validate({
    rules: {
      firstname: "required",
      lastname: "required",
      mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      email: {
        required: true,
        email: true,
      },
      dob: {
        required: true,
      },
      gender: {
        required: true,
      },
      password: {
        required: true,
        minlength: 5,
      },
      password_again: {
        equalTo: "#id_pwd",
      },
    },
    messages: {
      customername: "Please enter your customer name",
      mobile: {
        required: "Please enter your mobile number",
        digits: "Mobile should be a number",
        minLength: "Please provide a valid mobile number",
      },
      email: "Please enter a valid email address",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
      },
      password_again: {
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Please enter the same password as above",
      },
    },
    submitHandler: function (form, event) {
      event.preventDefault();
      var body = {
        firstName: form.elements.firstname.value,
        lastName: form.elements.lastname.value,
        email: form.elements.email.value,
        phoneNumber: form.elements.mobile.value,
        gender: form.elements.gender.value,
        dob: form.elements.dob.value,
        password: form.elements.password.value,
      };
      $.ajax({
        async: true,
        crossDomain: true,
        url: env.node_api_url + "auth/customers/register",
        type: "POST",
        data: body,
        success: function (data) {
          alert("Customer Registered Successfully");
          location.reload();
        },
        error: function (err) {
          console.log(err);
          toastr.error("Whoops! This didn't work. Please contact us.");
        },
      });
    },
  });
});
