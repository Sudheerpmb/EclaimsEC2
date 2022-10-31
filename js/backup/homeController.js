$(function () {
  /**
   * Login and Authenticate
   */
  $("#changePassword").validate({
    rules: {
      currentPassword: {
        required: true
      },
      newPassword: {
        required: true,
        minlength: 5
      },
      confirmPassword: {
        required: true,
        minlength: 5,
        equalTo: "#new_Password"
      }
    },
    messages: {
      currentPassword: "Please enter the current password",
      newPassword: {
        required: "Please enter the new password",
        minlength: "Your password must be at least 5 characters long"
      },
      confirmPassword: {
        required: "Please enter the confirm password",
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Please enter the same password as above"
      }
    },
    submitHandler: function (form) {

      //event.preventDefault();

      var access_token = getFromStore("token");
      var eclaim_token = getFromStore("eclaimsToken");


      $.ajax({
        async: true,
        crossDomain: true,
        url: env.api_url + "/api/Customer/ChangePassword",
        type: "POST",
        data: {
          "eclaimToken": eclaim_token,
          "currentPassword": form.currentPassword.value,
          "newPassword": form.newPassword.value
        },
        headers: {
          Authorization: "Bearer " + access_token
        },
        success: function (response) {
          responseMessage = JSON.parse(response);

          if (responseMessage.name == "MoleculerClientError") {
            alert("Incorrect Password, Please try again.");
          }

          if (responseMessage.status) {
            alert(responseMessage.response);
            window.location = env.app_url + "index.html";
          }


        },
        error: function (err) {
          console.log(err);
          toastr.error('Error Occured');
        }
      });

      return false;
    }
  });


});
function getButtons(clientId){
  // alert(clientId)
  var eclaim_token = getFromStore("eclaimsToken");
  $.ajax({
    async: true,
    crossDomain: true,
    url:  env.node_api_url+'api/geteclaimsbuttonlistByClient/?clientId='+clientId,
    type: "GET",
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaim_token
    },
    success: function (data) {
      html='a[pple';
      data.forEach(function(item) {
       html+=` <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
       <div class="section"> <a href="${item.link}"><img src=${item.image} alt="" />
           <h5 style="color:${item.color}">${item.name}</h5>
           <h6>${item.tagline}</h6>
         </a> </div>
     </div>`
    });
    document.getElementById("Ditems").innerHTML = html;
    }
  })
}
function getClaimTypes() {
  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  $.ajax({
    async: true,
    crossDomain: true,
    // url: env.app_url+"data/claimTypes.json",
    url: "https://eztraveluat.europassistance.in:3000/eclaims/masters/getMasters",
    type: "POST",
    data: JSON.stringify({
      "projectName": "EzTravel",
      "generalMasterName": "Claim Type"
    }),
    // dataType: "JSON",
    contentType: "application/json",
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaims_token
    },
  }).success(function (response) {
    var claimTypes = response;
    var result = '';
    Object.values(claimTypes).forEach(value => {
      result += `<div class="coverage"><a href="claimform.html?id=${value.name}"><h5>${value.subName}</h5>
                            <p>${value.narratio}</p></a></div>`;
    });
    document.getElementById("claimContainer").innerHTML = result;
  });
}

function getClaimDetails(claimId) {

  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");

  var userDetails = JSON.parse(getFromStore("user"));
  var clientId = userDetails.clientId;


  var newForm = new FormData();
  newForm.append("clientId", clientId);
  newForm.append("eclaimToken", eclaims_token);

  var url = "https://eztraveluat.europassistance.in:3000/api/cases/getCaseDetails?caseNumber=" + claimId;

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    type: "GET",
    processData: false,
    contentType: false,
    // data: newForm,
    headers: {
      Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNDk0NDcxOCwiaWF0IjoxNjE5NzYwNzE4fQ.4q_42wHXeAC4OMMFMuScB57LEwvZd53y0XoKhIdFcqs"
    },
    success: function (data) {
      // var json = JSON.parse(data[0]);
      var json = data[0];
      if (json != null) {
        var Status;
        if (json.Status == 0) {
          Status = "Open";
          window.status = "Open";
        }
        var type = json.travelCases.claimType;
        var travelTdocs = json.travelCases.documents;

        $("#claim_id").html(json.ClaimId);
        $("#pnumber").html(json.policy.policyNumber);
        // $("#status").html(Status);
        $("#claimDate").html(new Date(json.CreationDate).toLocaleDateString('en-GB'));
        $("#policyIssueDate").html(new Date(json.policy.policyIssuedDate).toLocaleDateString('en-GB'))
        var urlTo = 'https://eztraveluat.europassistance.in:3000/eclaims/documents/list?claimtype=' + type;


        $.ajax({
          async: true,
          crossDomain: true,
          url: urlTo,
          type: "GET",
          processData: false,
          contentType: false,
          // data: newForm,
          headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNDk0NDcxOCwiaWF0IjoxNjE5NzYwNzE4fQ.4q_42wHXeAC4OMMFMuScB57LEwvZd53y0XoKhIdFcqs"
          },
          success: function (data) {
            let toBeUploaded = [];
            let result = '';
            let allUploadData = data[0].Documents;
            for (var i = 0; i < allUploadData.length; i++) {
              let flag = 1;
              for (var j = 0; j < travelTdocs.length; j++) {
                let trDoc = travelTdocs[j].documentName.split("_")[0];
                // alert(allUploadData.length+"------------"+allUploadData[i].Name+"-------"+trDoc+"-------"+travelTdocs.length)
                if (trDoc == allUploadData[i].Name) {
                  flag = 0;
                }
              }
              if (flag) {

                result += ` <div style="display: flex;justify-content: space-between;">
                <a href="javascript:;"  data-id= ${allUploadData[i].Name} class="myLink" > ${allUploadData[i].Name}</a> 
                
                <div class="col-xs-6" style="float: right !important;">
                <div class="button-wrapper" style="width: 100px !important;text-align: center;padding:5px;">
                     <span class="label">Upload</span>
                     <input type="file" name="${allUploadData[i].Name}"  accept="image/jpeg,image/png,application/pdf"
                 data-msg-accept="File type should be PDF, jpeg or png." class="upload upload-box" placeholder="Attach">
                 </div></div></div>
               `;
                toBeUploaded.push(allUploadData[i].Name);
              }
            }
            console.log(toBeUploaded);
            let x = 0;
            document.getElementById("uploadDocDiv").innerHTML = result;
          }
        })



      }
      console.log(json);

    },
    error: function (err) {
      console.log(err);
      toastr.error('Whoops! Something went wrong.');
    }
  });

}
function submitClaims_tw() {
  var fd = new FormData();
  alert("hi")
  $(".upload").each(function () {
    let scm = $(this).attr('name');
    let type = typeof $(this)[0].files[0];
    if (typeof $(this)[0].files[0] === 'undefined') {

    }
    else {
      let kj = $(this)[0].files[0];
      // alert(kj)
      fd.append(scm, $(this)[0].files[0]);
    }

  })
}


function submitClaims_() {
  // alert("hi11")
  var eclaim_token = getFromStore("eclaimsToken");
  var fd = new FormData();
  var arr = [];
  var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
  var email = `<strong>CLAIM REFERENCE:  ${claimId}</strong><br>
  Thank you for your following enclosures sent to us. <br><strong><li>Policy Copy</li></strong>
  <br/><span>In order for us to proceed with our assessment we will require the following additional information/documentation:</span>`
  $(".upload").each(function () {
    let scm = $(this).attr('name');

    if (typeof $(this)[0].files[0] === 'undefined' && !scm.includes("Other Document")) {
      html += `<div class="col-xs-12 pull-left" style="width: 100%;">
      <div class="col-xs-6 pull-left">
      <li style="margin-left:20px">${scm} &nbsp; 
      </li>`;
      email += `<strong> <li style="margin-left:20px">${scm} &nbsp; 
      </li></strong>`
      // alert(scm);
    }
    let kj = $(this)[0].files[0];

    fd.append(scm, $(this)[0].files[0]);

  });
  // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
  email += `We look forward to hearing from you in due course.<br/>
  Yours sincerely,<br/>
  Claim Team<br/>
  eclaims<br/> 	
  Europ Assistance India`
  // alert(tkId)
  // alert(fd);

  // https://eztraveluat.europassistance.in:3000/eclaims/itemByCaseNumber?CaseNumber=


  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://eztraveluat.europassistance.in:3000/eclaims/itemByCaseNumber?CaseNumber=' + claimId,
    type: "GET",
    // data: fd,
    // dataType: "JSON",
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaim_token
    },
    success: function (data) {
      var travelData = data;
      $.ajax({
        async: true,
        crossDomain: true,
        url: 'https://eztraveluat.europassistance.in:3000/eclaims/addAttachmentToClaims/multiple?travelCaseId=' + travelData[0].travelCaseRef,
        type: "POST",
        data: fd,
        // dataType: "JSON",
        contentType: false,
        processData: false,
        headers: {
          Authorization: "Bearer " + eclaim_token
        },
        success: function (data) {
          window.location = env.app_url + "index.html";
        }
      })
    }
  })
}

$("#submitClaim12").click(function () {
  alert("hi")
  var fd = new FormData();
  var arr = [];
  var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
  var email = `<strong>CLAIM REFERENCE:  ${claimId}</strong><br>
  Thank you for your following enclosures sent to us. <br><strong><li>Policy Copy</li></strong>
  <br/><span>In order for us to proceed with our assessment we will require the following additional information/documentation:</span>`
  $(".upload").each(function () {
    let scm = $(this).attr('name');

    if (typeof $(this)[0].files[0] === 'undefined' && !scm.includes("Other Document")) {
      html += `<div class="col-xs-12 pull-left" style="width: 100%;">
      <div class="col-xs-6 pull-left">
      <li style="margin-left:20px">${scm} &nbsp; 
      </li>`;
      email += `<strong> <li style="margin-left:20px">${scm} &nbsp; 
      </li></strong>`
      alert($(this)[0].files[0]);
    }
    let kj = $(this)[0].files[0];

    fd.append(scm, $(this)[0].files[0]);

  });
  // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
  email += `We look forward to hearing from you in due course.<br/>
  Yours sincerely,<br/>
  Claim Team<br/>
  eclaims<br/> 	
  Europ Assistance India`
  alert(tkId)
  alert(fd);
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://eztraveluat.europassistance.in:3000/eclaims/addAttachmentToClaims/multiple?travelCaseId=' + tkId,
    type: "POST",
    data: fd,
    // dataType: "JSON",
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNTIwMzc2NywiaWF0IjoxNjIwMDE5NzY3fQ.3ule65iQOmi9wGlb3tnnveK91frgtGUNCTtmGA3ErD8'
    },
    success: function (data) {
      let dat = data;
      // console.log(dat);
      let subject = `E-Claim Alerts: New Claim Added - ${claimId} `;
      bootbox.alert(display, function () {
        $.ajax({
          async: true,
          crossDomain: true,
          url: 'https://eztraveluat.europassistance.in:3000/api/communicate/sendEmails_new',
          type: "POST",
          data: JSON.stringify({
            "email": emailID,
            "name": " ",
            "subject": subject,
            "body": email
          }),
          // dataType: "JSON",
          contentType: "application/json",
          processData: false,
          headers: {
            Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNTIwMzc2NywiaWF0IjoxNjIwMDE5NzY3fQ.3ule65iQOmi9wGlb3tnnveK91frgtGUNCTtmGA3ErD8'
          },
          success: function (data) {
            window.location = env.app_url + "index.html";
          }
        })

      });
    }
  })

})
function getCustomerClaims() {


  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  var user = JSON.parse(getFromStore("user"))
  var url = env.node_api_url + "eclaims/cases/getClaimI";

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
      // var json = JSON.parse(data[0]);
      var json = data;


      if (json.length > 0) {
        var customerClaims = json[0].claims;
        var claimsHtml = '';

        Object.values(json).forEach(value => {
          if (value.CaseNumber.substring(0, 2) == user.clientId.substring(0, 2).toUpperCase()) {
            claimsHtml += `  <div class="coverage "><div class="clm-row"><h6><a href="claimdetails.html?claimId=${value.CaseNumber}">${value.CaseNumber}</a></h6></div>`;
            claimsHtml += `<div class="clm-row"> <h6>${new Date(value.CreationDate).toLocaleDateString()}</h6> </div></div>`;
          }
        });
        document.getElementById("claimsListContainer").innerHTML = claimsHtml;



      }

    },
    error: function (err) {
      console.log(err);
      toastr.error('Whoops! Something went wrong.');
    }
  });




}


function getCustomerRecentClaim() {


  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  let user = JSON.parse(getFromStore("user"));
  // alert(user.email)

  // var url = env.api_url + "/api/Customer/GetCustomerClaims?eclaimToken=" + eclaims_token;
  var url = env.node_api_url + "eclaims/customers/getCustomerListByEmail?email=" + user.email + "&phone=" + user.mobile;
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
      var json = data[0];

      if (json.claims.length > 0) {
        var claimDetails = json.claims.slice(-1)[0];
        window.location.href = env.app_url + "documentsuploadpage.html?claimId=" + claimDetails.CaseNumber +"&Id="+claimDetails.travelCaseRef+"&email="+user.email;
      } else {
        toastr.info('No claims available.');
      }




    },
    error: function (err) {
      console.log(err);
      toastr.error('Whoops! Something went wrong.');
    }
  });




}




function logout() {
  var userDetails = JSON.parse(getFromStore("user"));
  var clientId = userDetails.clientId;
  clearStore();
  window.location = env.app_url + "signin-signup.html?clientId=" + clientId;
}
