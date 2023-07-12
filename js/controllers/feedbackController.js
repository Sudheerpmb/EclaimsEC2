$(function () {
  // Function to send email
  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  var user = JSON.parse(getFromStore("user"));
  function sendEmail(email, body) {
    // Implement your logic to send email here
    // console.log("Sending email to: " + email);
    // console.log("Email body: " + body);
    $.ajax({
      url: env.node_api_url + "api/communicate/sendEmails_new",
      type: "POST",
      data: {
        "email": email,
        "name": " ",
        "subject": "eclaims-feedback",
        "body": body
      },
      headers: {
        Authorization: "Bearer " + access_token
      },
      success: function (data) {

        // // All requests completed successfully
        // alert('Feedback posted successfully');
        window.location = env.app_url + "index.html";

      },
      error: function (err) {
        console.log(err);
        alert('Whoops! This didn\'t work. Please contact us.');
      }
    });
  }

  // Function to toggle forms based on the client ID
  function toggleForms(clientId) {
    if (clientId === "RELIANCE") {
      $("#reliance").show();
    } else {
      $("#Other").show();
    }
  }

  // Show/hide forms on page load
  let client = getFromStore("clientIDNM");
  var clientId = client; // Set the client ID here
  toggleForms(clientId);

  // Form validation for feedbackRel form
  $("#feedback").validate({
    rules: {
      Claimtype: "required",
      // fb: "required",
      // tb: "required",
    },
    messages: {
      Claimtype: "Please select a rating",
      fb: "Please select a rating",
      tb: "Please select a rating",
    },
    submitHandler: function (form) {
      var body = {
        "How would you rate the ease of submitting your travel claim?": form.elements.Claimtype.value,
        "How satisfied are you with the level of communication regarding your travel claim?": form.elements.fb.value,
        "Overall were you satisfied with how your claim was handled?": form.elements.tb.value,

      };

      var bodyhtml = "";
      for (var key in body) {
        bodyhtml += "Question: " + key + "<br>";
        bodyhtml += "Answer: " + body[key] + "<br>";
      }

      // Send email
      sendEmail("rsaini@europ-assistance.in", bodyhtml);
      sendEmail("dbagve.extern@europ-assistance.in", bodyhtml);
      sendEmail(user.email, "Thank you for your valuable feedback");

      alert('Feedback submitted successfully');
      form.reset();
    }
  });

  // Form validation for feedbackOther form
  $("#feedbackOther").validate({
    rules: {
      Claimtype: "required",
      // ability: {
      //   required: true
      // },
      // tb: "required",
      // fb: "required",
      // experience: "required"
    },
    messages: {
      Claimtype1: "Please select a task", 
      ability: "Please select an option",
      fb1: "Please select a rating",
    },
    submitHandler: function (form,event) {
      event.preventDefault();

      var body = {
        "For which task did you use this application?": form.elements.Claimtype1.value,
        "Were you able to complete the desired task?": form.elements.ability.value,
        " Reason for not completing the task?": typeof form.elements.reasons == 'undefined' ? "" : form.elements.reasons.value,
        "How was your overall experience with the application?": form.elements.fb1.value,
        "How can we improve your experience?": form.elements.experience.value,
      };

      var bodyhtml = "";
      for (var key in body) {
        bodyhtml += "Question: " + key + "<br>";
        bodyhtml += "Answer: " + body[key] + "<br>";
      }

      // Send email
      // sendEmail("rsaini@europ-assistance.in", bodyhtml);
      sendEmail("dbagve.extern@europ-assistance.in", bodyhtml);
      sendEmail(user.email, "Thank you for your valuable feedback");


      alert('Feedback submitted successfully');
      form.reset();
    }
  });
});




// $(function () {

//   $("#feedback").validate({
//     rules: {
//       Claimtype: "required",
//       // ability: {
//       //   required: true
//       // },
//       // tb:"required",
//       // fb: "required",
//       // experience: "required"
//     },
//     messages: {
//     },
//     submitHandler: function (form, event) {
//       event.preventDefault();
//       var body = {
//         "How would you rate the ease of submitting your travel claim.": form.elements.Claimtype.value,
//         // "Were you able to complete the desired task?": form.elements.ability.value,
//         // "Reason for not completing the task": typeof form.elements.reasons == 'undefined' ? "" : form.elements.reasons.value,
//         "How satisfied are you with the level of communication regarding your travel claim.": form.elements.fb.value,
//         "Overall were you satisfied with how your claim was handled.": form.elements.tb.value,
//         // "How can we improve your experience?": form.elements.experience.value,

//       }
//       var bodyhtml = "";
//       bodyhtml += "Question: How would you rate the ease of submitting your travel claim.<br>";
//       bodyhtml += "Answer: " + form.elements.Claimtype.value;
//       // bodyhtml += "<br>Question: Were you able to complete the desired task?<br>";
//       // bodyhtml += "Answer: " + form.elements.ability.value;
//       // bodyhtml += "<br>Question: Reason for not completing the task<br>";
// bodyhtml += "Answer: " + typeof form.elements.reasons == 'undefined' ? "" : form.elements.reasons.value;
//       bodyhtml += "<br>Question: How satisfied are you with the level of communication regarding your travel claim.<br>";
//       bodyhtml += "Answer: " + form.elements.fb.value;
//       bodyhtml += "<br>Question: Overall were you satisfied with how your claim was handled.<br>";
//       bodyhtml += "Answer: " + form.elements.tb.value;
//       // bodyhtml += "<br>Question: How can we improve your experience?<br>";
//       // bodyhtml += "Answer: " + form.elements.experience.value;

// var eclaims_token = getFromStore("eclaimsToken");
// var access_token = getFromStore("token");
// var user = JSON.parse(getFromStore("user"));
//       // $.ajax({
//       //   url: env.node_api_url + "api/communicate/sendEmails_new",
//       //   type: "POST",
//       //   data: {
//       //     "email": user.email,
//       //     "name": " ",
//       //     "subject": "eclaims-feedback",
//       //     "body": "Thank you for your valuable feedback"
//       //   },
//       //   headers: {
//       //     Authorization: "Bearer " + access_token
//       //   },
//       //   success: function (data) {
//       //     alert('Feedback posted successfully');
//       //     window.location = env.app_url + "index.html";
//       //   },
//       //   error: function (err) {
//       //     console.log(err);
//       //     alert('Whoops! This didn\'t work. Please contact us.');
//       //   }
//       // });
//       // $.ajax({
//       //   url: env.node_api_url + "api/communicate/sendEmails_new",
//       //   type: "POST",
//       //   data: {
//       //     "email": "rsaini@europ-assistance.in",
//       //     "name": " ",
//       //     "subject": "eclaims-feedback",
//       //     "body": bodyhtml
//       //   },
//       //   headers: {
//       //     Authorization: "Bearer " + access_token
//       //   },
//       //   success: function (data) {
//       //     // alert('Feedback posted successfully');
//       //     window.location = env.app_url + "index.html";
//       //   },
//       //   error: function (err) {
//       //     console.log(err);
//       //     // alert('Whoops! This didn\'t work. Please contact us.');
//       //   }
//       // });
//       function sendEmail(email, body) {
//         $.ajax({
//           url: env.node_api_url + "api/communicate/sendEmails_new",
//           type: "POST",
//           data: {
//             "email": email,
//             "name": " ",
//             "subject": "eclaims-feedback",
//             "body": body
//           },
//           headers: {
//             Authorization: "Bearer " + access_token
//           },
//           success: function(data) {
//             successCounter++;
//             if (successCounter === emailCount) {
//               // All requests completed successfully
//               alert('Feedback posted successfully');
//               window.location = env.app_url + "index.html";
//             }
//           },
//           error: function(err) {
//             console.log(err);
//             alert('Whoops! This didn\'t work. Please contact us.');
//           }
//         });
//       }
//       // Usage
//         var emailCount = 3; // Total number of email addresses
//         var successCounter = 0; // Counter for successful API requests
//       // Usage
//       sendEmail("rsaini@europ-assistance.in", bodyhtml);
//       sendEmail(user.email, "Thank you for your valuable feedback");
//       sendEmail("dbagve.extern@europ-assistance.in",bodyhtml);

//     }
//   })
// }); 



