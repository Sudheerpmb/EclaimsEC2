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
        url: env.node_api_url + "api/EclaimsChangePassWord",
        type: "POST",
        data: {
          "currentPassword": form.currentPassword.value,
          "newPassword": form.newPassword.value
        },
        headers: {
          Authorization: "Bearer " + access_token
        },
        success: function (response) {
          responseMessage = response;

          if (!responseMessage.status) {
            alert("Incorrect Password, Please try again.");
          }

          if (responseMessage.status) {
            alert("Password successfully updated");
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

function getButtons(clientId) {
  // alert(clientId)
  var eclaim_token = getFromStore("eclaimsToken");
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url + 'api/geteclaimsbuttonlistByClient/?clientId=' + clientId,
    type: "GET",
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaim_token
    },
    success: function (data) {
      html = '';
      data.forEach(function (item) {
        if (item.name == 'Upload Documents') {
          html += ` 
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div class="section"> 
              <a href="JavaScript:void(0);" onclick="getCustomerRecentClaim()"><img
                src="images/file.jpg" alt="" />
               <h5 style="color:#023783;">Upload documents</h5>
                <h6>to your claims</h6>
              </a> 
            </div>
          </div>`
        }
        else if (item.name == 'Change Password') {
          html += `
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
            <div class="section" style="padding-bottom:13px !important;">
              <a href="#" data-target="#changePwdModal"
                data-toggle="modal"><img src="images/file.jpg" alt="" />
                <h5 style="color:#0000FF;">&nbsp;<br>Change Password</h5>
              </a>
            </div>
          </div>`
        }
        else {
          html += `
              <div class="col-md-4 col-sm-6 col-12">
                <div class="section">
                  <a href="${item.link}">
                    <img src="${item.image}" alt="" />
                    <h5 style="color: ${item.color}">${item.name}</h5>
                    <h6>${item.tagline}</h6>
                  </a>
                </div>
              </div>`}
      });
      document.getElementById("Ditems").innerHTML = html;
    }
  })
}


  function getClaimTypes() {
    var eclaims_token = getFromStore("eclaimsToken");
    var access_token = getFromStore("token");
    var clientIde = getFromStore("clientIDE").toUpperCase();

    // Function to fetch and display claim types based on the selected radio button name
    function displaySubClaimTypesBasedOnRadioName(radioName) {
      $('#loader').show();
      $.ajax({
        async: true,
        crossDomain: true,
        url: env.node_api_url + "eclaims/masters/getMastersEclaims",
        type: "POST",
        data: JSON.stringify({
          "projectName": "EzTravel",
          "generalMasterName": "Claim Type",
          "name": radioName,
          "clientName": getFromStore("clientIDE").toUpperCase()

        }),
        contentType: "application/json",
        processData: false,
        headers: {
          Authorization: "Bearer " + eclaims_token
        },
        success: function (claimTypesResponse) {
          setTimeout(function () {
            $('#loader').hide();
          }, 800);
          // Sort claim types within claimTypesResponse
          claimTypesResponse.sort(function (a, b) {
            return parseInt(a.order) - parseInt(b.order);
          });

          // Append claim types to the claimContainer
          var claimTypesHTML = '';
          claimTypesResponse.forEach(function (value) {
            claimTypesHTML += `
            <div class="coverage0_">
              <a href="claimform.html?id=${value.name}" data-subname="${value.subName}">
                <h5>${value.subName}</h5>
                <p>${value.narratio}</p>
              </a>
            </div>`;

          });

          document.getElementById("claimContainer").innerHTML = claimTypesHTML;
          $('.coverage0_').on('click', 'a', function (event) {
            event.preventDefault();

            // Get the subName from the data attribute
            var subName = $(this).data('subname');

            // Store the subName in localStorage
            localStorage.setItem('clickedSubName', subName);
            var href = $(this).attr('href');
            if (getFromStore('type') === 'scan' || getFromStore('type') === 'tinyURL' && getFromStore('validation')==='Valid') {
              $.ajax({
                async: true,
                crossDomain: true,
                url: env.node_api_url + 'eclaims/searchCaseNumberPolicyNumber?searchString=' + getFromStore('certNumber'),
                type: "GET",
                processData: false,
                contentType: false,
                headers: {
                  Authorization: "Bearer " + getFromStore("eclaimsToken")
                },
                success: function (data) {
                  var json = data;
                  if (json.length > 0) {
                    var givenPolicyNumber = getFromStore('certNumber');
                    var givenClaimType = radioName // Replace with your actual claim type
                    var givenSubClaimType = getFromStore('clickedSubName'); // Replace with your actual sub-claim type

                    // Check if the given policy number, claim type, and sub-claim type exist in the response
                    var claimAlreadyExists = json.some(function (claim) {
                      return claim.certifiacteNumber === givenPolicyNumber &&
                        claim.claimType === givenClaimType &&
                        claim.subclaimType === givenSubClaimType;
                    });

                    if (claimAlreadyExists) {
                      $('#claimModal').modal('show');
                    } 
                    else {
                      // Redirect to the claimform.html page
                      window.location.href = href;
                    }
                  }
                },
                error: function (err) {
                  console.log(err);
                  toastr.error('Whoops! Something went wrong.');
                }
              })
            } 
            else {
              window.location.href = href;
            }
          });
        },
        error: function (error) {
          console.error("Error fetching claim types based on radio name:", error);
        },
      });
    }

    // Fetch and append radio buttons to the radioButtonsContainer
    $.ajax({
      async: true,
      crossDomain: true,
      url: env.node_api_url + "eclaims/masters/getMastersEclaims",
      type: "POST",
      data: JSON.stringify({
        "projectName": "EzTravel",
        "generalMasterName": "Claim Type",
        "clientName": getFromStore("clientIDE").toUpperCase()
      }),
      contentType: "application/json",
      processData: false,
      headers: {
        Authorization: "Bearer " + eclaims_token
      },
      success: function (radioResponse) {
        var result = '';

        radioResponse.forEach(function (name) {
          result += `<input type="radio" name="claimTypeRadio" value="${name.name}" style="margin-right: 7px; font-size: 15px"><label><span style="margin-right: 10px; font-size: 20px">${name.name}</span></label>`;
        });

        // Append the radio buttons to the radioButtonsContainer
        document.getElementById("radioButtonsContainer").innerHTML = result;

        // Attach click event handler to radio buttons
        $('input[name="claimTypeRadio"]').on('click', function () {
          var radioName = $(this).val(); // Get the selected radio button's value
          displaySubClaimTypesBasedOnRadioName(radioName); // Call the function with the selected value
        });
      },
      error: function (error) {
        console.error("Error fetching radio button names from API:", error);
      },
    });

    // Fetch and handle insurance provider details (existing code)
    $.ajax({
      async: true,
      crossDomain: true,
      url: env.node_api_url + 'api/insuranceproviders/details',
      type: "GET",
      processData: false,
      contentType: false,
      headers: {
        Authorization: "Bearer " + eclaims_token
      },
      success: function (response) {
        let policycopyrequired = 0;
        for (var i = 0; i < response.length; i++) {
          if (clientIde == response[i].clientName) {
            if (response[i].policycopyrequired) {
              policycopyrequired = 1;
            }
            break;
          }
        }
        setToStore("policyCopyReq", policycopyrequired);

        // Append the second result (existing code)
        // You can place your existing code here to append the second result
        // based on your requirements.
      },
      error: function (error) {
        console.error("Error fetching insurance provider details:", error);
      },
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

  var url = env.node_api_url + "api/cases/getCaseDetailsEclaims?caseNumber=" + claimId;

  $.ajax({
    async: true,
    crossDomain: true,
    url: url,
    type: "GET",
    processData: false,
    contentType: false,
    // data: newForm,
    headers: {
      Authorization: "Bearer " + getFromStore("eclaimsToken")
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
        var subtype = json.travelCases.subClaimType;

        $("#claim_id").html(json.ClaimId);
        $("#pnumber").html(json.policy.policyNumber);
        setToStore("polNum", json.policy.policyNumber);

        // $("#status").html(Status);
        $("#claimDate").html(new Date(json.CreationDate).toLocaleDateString('en-GB'));
        // if (json.policy.policyIssuedDate)
        //   $("#policyIssueDate").html(new Date(json.policy.policyIssuedDate).toLocaleDateString('en-GB'))
        // else
        // $("#policyIssuelabel").hide()
        // $("#policyIssueDate").html(`NA`)
        var urlTo = env.node_api_url  + 'eclaims/documents/list?claimtype=' + type;
        if (subtype) {
          urlTo += '&claimSubType=' + encodeURIComponent(subtype); 
        }

        $.ajax({
          async: true,
          crossDomain: true,
          url: urlTo,
          type: "GET",
          processData: false,
          contentType: false,
          // data: newForm,
          headers: {
            Authorization: "Bearer " + getFromStore("eclaimsToken")
          },
          success: function (data) {
            let toBeUploaded = [];
            let result = '';
            let alreadyUp = '';
            let docName = '';
            let allUploadDatas = data[0].Documents;
            let allUploadData = [];
            for (let elem of allUploadDatas)
              if (elem.Eclaims)
                allUploadData.push(elem)
            for (var i = 0; i < allUploadData.length; i++) {
              let flag = 1;
              for (var j = 0; j < travelTdocs.length; j++) {
                let trDoc = travelTdocs[j].documentName.split("_")[0];
                // alert(allUploadData.length+"------------"+allUploadData[i].Name+"-------"+trDoc+"-------"+travelTdocs.length)
                if (trDoc == allUploadData[i].Name) {
                  flag = 0;
                  if (travelTdocs[j].doc_ori_name)
                    docName = travelTdocs[j].doc_ori_name;
                  else
                    docName = travelTdocs[j].documentName;
                  if (docName.length > 20) {
                    docName = docName.substring(0, 13) + '....' + docName.substring(docName.length - 6)

                  }

                }
              }
              if (flag) {
                // <-- <i class="fa fa-times-circle-o" id="${allUploadData[i].Name+'__P'}" onclick="subDiv('${allUploadData[i].Name}')"  style="font-size:18px;cursor: pointer;"aria-hidden="true;"></i>-->
                result += `
                <div class="row">
                    <div class = "col-sm-8 col-12" id="${allUploadData[i].Name + '___'}" style="display: flex;justify-content: space-between;color:blue">
                      <div onclick="scrollWin()">
                        <i class="fa fa-plus-square" id="${allUploadData[i].Name + '__'}" onclick="addDiv('${allUploadData[i].Name}')"  style="font-size:18px;cursor: pointer;"aria-hidden="true;"></i>
                        <a href="javascript:;"  data-id= ${allUploadData[i].Name} class="myLink"  data-toggle="tooltip" title="${allUploadData[i].Name}" > ${allUploadData[i].Name}</a> 
                      </div>
                    </div>
                    <div class="col-sm-4 col-12">
                      <div class="button-wrapper" style="width: 100px !important;text-align: center;padding:5px; float: right !important;">
                            <span class="label">Upload</span>
                            <input type="file" id="${allUploadData[i].Name}" name="${allUploadData[i].Name}"  onchange="showname('${allUploadData[i].Name}','${allUploadData[i].Name + '_'}')" accept="image/jpeg,image/png,application/pdf"
                        data-msg-accept="File type should be PDF, jpeg or png." class="upload upload-box" placeholder="Attach">
                        <label id ="${allUploadData[i].Name + '_'}" style="display:none">  </label>
                      </div>
                    </div>
                  </div>
                </div>
               `;
                toBeUploaded.push(allUploadData[i].Name);
              }
              else {
                alreadyUp += `
                <div class="row">
                  <div class = "col-sm-8 col-12" style="display: flex;justify-content: space-between;color:#DD31FF">
                    <div onclick="scrollWin()">
                      <i class="fa fa-plus-square" id="${allUploadData[i].Name + '__'}" onclick="addDiv('${allUploadData[i].Name}')"  style="font-size:18px;cursor: pointer;"aria-hidden="true;"></i>
                      <span  data-id= ${allUploadData[i].Name} class="myLink" > ${allUploadData[i].Name}</span>
                    </div>
                  </div>
                  <div class="col-sm-4 col-12" style="float: right !important;text-align:center;width:11vw;padding-left: 10px;">
                    <i class="fa fa-check" aria-hidden="true"></i>
                     <br>
                    <span>${docName}</span>
                  </div>
                </div><br/>`
              }
            }
            console.log(toBeUploaded);
            let x = 0;
            result = alreadyUp + result
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
  // alert("hi")
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


// function submitClaims_() {
//   // alert("hi11")
//   var eclaim_token = getFromStore("eclaimsToken");
//   var tcID_l = getFromStore("CTrvelCaseId");
//   var arr = [];
//   var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
//   var submitedDoc = ``
//   var email = `<strong>CLAIM REFERENCE: Helloo ${claimId}</strong><br>
//   Thank you for your following enclosures sent to us. {Policy_Copy_}
//   <br/><span>In order for us to proceed with our assessment we will require the following additional information/documentation:</span>`

//   $(".upload").each(function () {
//     var fd = new FormData();
//     let scm = $(this).attr('name');

//     if (typeof $(this)[0].files[0] === 'undefined' && !scm.includes("Other Document")) {
//       html += `<div class="col-xs-12 pull-left" style="width: 100%;">
//       <div class="col-xs-6 pull-left">
//       <li style="margin-left:20px">${scm} &nbsp; 
//       </li>`;
//       email += `<strong> <li style="margin-left:20px">${scm} &nbsp; 
//       </li></strong>`
//       // alert(scm);
//     }
//     else {
//       if (scm.includes("Other Document")) {
//         if (typeof $(this)[0].files[0] !== 'undefined')
//           submitedDoc += `<br><strong><li>${scm}</li></strong>`
//       }
//       else {
//         submitedDoc += `<br><strong><li>${scm}</li></strong>`
//       }

//     }
//     let kj = $(this)[0].files[0];

//     fd.append('imgUploader', $(this)[0].files[0]);
//     if (typeof $(this)[0].files[0] !== 'undefined') {
//       // alert( env.node_api_url+'api/uploadDocuments?docTypeId='+scm+ '&travelCaseId='+tcID_l)
//       $.ajax({
//         async: true,
//         crossDomain: true,
//         url: env.node_api_url + 'api/uploadDocuments?docTypeId=' + scm + '&travelCaseId=' + tcID_l,
//         type: "POST",
//         data: fd,
//         // dataType: "JSON",
//         contentType: false,
//         processData: false,
//         headers: {
//           Authorization: "Bearer " + eclaim_token
//         },
//         success: function (data) {
//           // alert(`${scm} inserted`)
//         }
//       })
//     }

//   });


//   // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
//   let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
//   email += `<br/><br/>We look forward to hearing from you in due course.<br/><br/>
//   Yours sincerely,<br/>
//   Claims Team<br/>
//   eclaims<br/> 	
//   Europ Assistance India`
//   email = email.replace('{Policy_Copy_}', submitedDoc);
//   // alert(email);

//   // https://eztraveluat.europassistance.in:3000/eclaims/itemByCaseNumber?CaseNumber=


//   // $.ajax({
//   //   async: true,
//   //   crossDomain: true,
//   //   url: env.node_api_url+'eclaims/itemByCaseNumber?CaseNumber=' + claimId,
//   //   type: "GET",
//   //   // data: fd,
//   //   // dataType: "JSON",
//   //   contentType: false,
//   //   processData: false,
//   //   headers: {
//   //     Authorization: "Bearer " + eclaim_token
//   //   },
//   //   success: function (data) {
//   //     var travelData = data;
//   //     $.ajax({
//   //       async: true,
//   //       crossDomain: true,
//   //       url: env.node_api_url+'eclaims/addAttachmentToClaims/multiple?travelCaseId=' + travelData[0].travelCaseRef,
//   //       type: "POST",
//   //       data: fd,
//   //       // dataType: "JSON",
//   //       contentType: false,
//   //       processData: false,
//   //       headers: {
//   //         Authorization: "Bearer " + eclaim_token
//   //       },
//   //       success: function (data) {
//   //         var user_F = JSON.parse(getFromStore("user"));
//   //         sendmail(user_F.email, `${claimId} updated`, email);
//   //         window.location = env.app_url + "index.html";
//   //       }
//   //     })
//   //   }
//   // })

//   var user_F = JSON.parse(getFromStore("user"));
//   sendmail(user_F.email, `${claimId} updated`, email);

//   alert('The document has been successfully uploaded');
//   window.location = env.app_url + "index.html";

// }
function submitClaims_() {
  var eclaim_token = getFromStore("eclaimsToken");
  var tcID_l = getFromStore("CTrvelCaseId");
  var arr = [];
  var html = `<h6><strong>We have saved your claims details, and your reference number is ${claimId}. However, you still need to provide the below mandatory documents</strong></h6>`;
  var submitedDoc = ``;
  var email = `<strong>CLAIM REFERENCE:${claimId}</strong><br>
  Thank you for your following enclosures sent to us. {Policy_Copy_}
  <br/><span>In order for us to proceed with our assessment, we will require the following additional information/documentation:</span>`;

  $(".upload").each(function () {
    var fd = new FormData();
    let scm = $(this).attr('name');

    if (typeof $(this)[0].files[0] === 'undefined' && !scm.includes("Other Document")) {
      html += `<div class="col-xs-12 pull-left" style="width: 100%;">
      <div class="col-xs-6 pull-left">
      <li style="margin-left:20px">${scm} &nbsp; 
      </li>`;
      email += `<strong> <li style="margin-left:20px">${scm} &nbsp; 
      </li></strong>`;
    } else {
      if (scm.includes("Other Document")) {
        if (typeof $(this)[0].files[0] !== 'undefined')
          submitedDoc += `<br><strong><li>${scm}</li></strong>`;
      } else {
        submitedDoc += `<br><strong><li>${scm}</li></strong>`;
      }
    }

    let kj = $(this)[0].files[0];

    fd.append('imgUploader', $(this)[0].files[0]);
    if (typeof $(this)[0].files[0] !== 'undefined') {
      $.ajax({
        async: true,
        crossDomain: true,
        url: env.node_api_url + 'api/uploadDocuments?docTypeId=' + scm + '&travelCaseId=' + tcID_l + '&uploadedFrom=' + 'Eclaims',
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        headers: {
          Authorization: "Bearer " + eclaim_token
        },
        success: function (data) {
          // alert(`${scm} inserted`)
        }
      });
    }
  });

  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id. Claim forms to be filled, signed & submitted along with the requested claim documents.</h6>`;
  email += `<br/><br/>We look forward to hearing from you in due course.<br/><br/>
  Yours sincerely,<br/>
  Claims Team<br/>
  eclaims<br/> 
  Europ Assistance India`;
  email = email.replace('{Policy_Copy_}', submitedDoc);
  
  // Check if all documents are uploaded
  var allDocumentsUploaded = $(".upload").toArray().every(function (elem) {
    return $(elem)[0].files.length > 0;
  });

  if (allDocumentsUploaded) {
    sendSeparateEmail();
  } else {
    var user_F = JSON.parse(getFromStore("user"));
    var userInfo = JSON.parse(getFromStore('emailObj'));
    if (getFromStore('clientIDNM') === 'RELIANCE' && userInfo) {
      sendmail(userInfo.email, `${claimId} updated`, email);
    } else if (getFromStore('type') === 'scan' ||getFromStore('type') === 'tinyURL') {
      let emailObj = JSON.parse(getFromStore("qrObj"));
      sendmail(emailObj.email, `${claimId} updated`, email);
    } else {
      sendmail(user_F.email, `${claimId} updated`, email);
    }
  }
  alert('The documents have been successfully uploaded');
  window.location = env.app_url + "index.html";

  function sendSeparateEmail() {
    // Define your separate email content and subject
    var user_F = JSON.parse(getFromStore("user"));
    var userInfo = JSON.parse(getFromStore("emailObj"));
    if (getFromStore('clientIDNM') === 'RELIANCE' && userInfo) {
      var separateEmailContent = `Dear ${userInfo.firstName+' '+ userInfo.lastName}<br/>CLAIM REFERENCE:${claimId}<br/><br/>Thank you for submitting the below mentioned all documents.<br/>Our team will get back to you if anything required from your end.<br/><br/>Yours sincerely,<br/>Claims Team<br/>Europ Assistance India`;
      var separateEmailSubject = `E-Claim Alerts: All Documents Received`;
      sendmail(userInfo.email, separateEmailSubject, separateEmailContent);
    } else {
      if (getFromStore('type') === 'scan' ||getFromStore('type') === 'tinyURL') {
        let emailObj = JSON.parse(getFromStore("qrObj"));
        var separateEmailContent = `Dear ${emailObj.name}<br/>CLAIM REFERENCE:${claimId}<br/><br/>Thank you for submitting the below mentioned all documents.<br/>Our team will get back to you if anything required from your end.<br/><br/>Yours sincerely,<br/>Claims Team<br/>Europ Assistance India`;
        var separateEmailSubject = `E-Claim Alerts: All Documents Received`;
        sendmail(emailObj.email, separateEmailSubject, separateEmailContent);
      }
      else{
        var separateEmailContent = `Dear ${user_F.firstName + ' '+ user_F.lastName }<br/>CLAIM REFERENCE:${claimId}<br/><br/>Thank you for submitting the below mentioned all documents.<br/>Our team will get back to you if anything required from your end.<br/><br/>Yours sincerely,<br/>Claims Team<br/>Europ Assistance India`;
        var separateEmailSubject = `E-Claim Alerts: All Documents Received`;
        sendmail(user_F.email, separateEmailSubject, separateEmailContent);
      }
    }

  }
}

$("#submitClaim12").click(function () {
  // alert("hi")
  var fd = new FormData();
  var arr = [];
  var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
  var email = `<strong>CLAIM REFERENCE:${claimId}</strong><br>
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
      // alert($(this)[0].files[0]);
    }
    let kj = $(this)[0].files[0];

    fd.append(scm, $(this)[0].files[0]);

  });

  // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
  email += `<br/>We look forward to hearing from you in due course.<br/>
  Yours sincerely,<br/>
  Claims Team<br/>
  eclaims hello<br/> 	
  Europ Assistance India`
  // alert(tkId)
  // alert(fd);
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url + 'eclaims/addAttachmentToClaims/multiple?travelCaseId=' + tkId,
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
          url: env.node_api_url + 'api/communicate/sendEmails_new',
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
// function getCustomerClaims() {

//   var userDetails = JSON.parse(getFromStore("user"));
//   var eclaims_token = getFromStore("eclaimsToken");
//   var access_token = getFromStore("token");
//   var user = JSON.parse(getFromStore("user"))
//   var url = env.node_api_url + "eclaims/cases/getClaimI?user_name=" + userDetails.email;

//   $.ajax({
//     async: true,
//     crossDomain: true,
//     url: url,
//     type: "GET",
//     processData: false,
//     contentType: false,
//     headers: {
//       Authorization: "Bearer " + eclaims_token
//     },
//     success: function (data) {
//       // var json = JSON.parse(data[0]);
//       var json = data;
      

//       if (json.length > 0) {
//         var customerClaims = json[0].claims;
//         var claimsHtml = `
//         <div class="coverage " style="color:red">
//             <div class="clm-row">
//               <h5>Claim Id</h5>
//             </div>
//             <div class="clm-row"> 
//                 <h5>Claim Date</h5>
//             </div>
//             <div class="clm-row">
//               <h5>Customer Name</h5> 
//             </div>
//             <div class="clm-row">
//               <h5>Policy No</h5> 
//             </div>
//             <div class="clm-row">
//               <h5>Type</h5> 
//             </div>
//             <div class="clm-row">
//               <h5>Status</h5> 
//             </div>
//           </div>`;
//         let contacts = new Map()
//         let claimCount = 0;
//         Object.values(json).forEach(value => {
//           if (value.CaseNumber.substring(0, 2) == getFromStore('prefix').substring(0, 2).toUpperCase() && !contacts.has(value.CaseNumber)) {
//             contacts.set(value.CaseNumber, 1)
//             let insuProvider = 'NA'
//             if (value.insuranceProvider)
//               insuProvider = value.insuranceProvider.toUpperCase()
//             claimCount++;
//             claimsHtml += `   <div class="coverage ">
//                                 <div class="clm-row">
//                                    <h6><a style="color:blue;cursor:pointer" onclick="myFunctionGetTravel('${value.CaseNumber}')">${value.CaseNumber}</a></h6>
//                                 </div>
//                                 <div class="clm-row"> 
//                                     <h6>${new Date(value.CreationDate).toLocaleDateString('en-GB')}</h6>
//                                  </div>
//                                 <div class="clm-row">
//                                     <h6>${value.customers.FirstName.charAt(0).toUpperCase() + value.customers.FirstName.slice(1) + ' ' + value.customers.LastName.charAt(0).toUpperCase() + value.customers.LastName.slice(1)}</h6> 
//                                 </div>
//                                 <div class="clm-row">
//                                     <h6>${value.travelPolicy[0] ? value.travelPolicy[0].policyNumber : 'NA'}</h6> 
//                                 </div>
//                                 <div class="clm-row">
//                                     <h6>${value.travelCases.subClaimType}</h6>
//                                 </div>
//                                 <div class="clm-row">
//                                   <h6>${value.travelCases.claimSatus}</h6>
//                                 </div>
//                               </div>`;
//           }
//         });
//         if (claimCount == 0) {
//           claimsHtml = `<h5>No Claims Found</h5>`
//         }
//         document.getElementById("claimsListContainer").innerHTML = claimsHtml;
//         // Add search functionality
//         var searchInput = document.getElementById("searchInput");
//         searchInput.addEventListener("input", function () {
//           var searchValue = this.value.toLowerCase();
//           var coverageItems = claimsListContainer.getElementsByClassName("coverage");
//           Array.from(coverageItems).forEach(function (item) {
//             var claimDetails = item.innerText.toLowerCase();

//             if (claimDetails.includes(searchValue)) {
//               item.style.display = "block";
//             } else {
//               item.style.display = "none";
//             }
//           });
//         });
//       }
//       else {
//         document.getElementById("claimsListContainer").innerHTML = `<h2>No claims has been found</h2>`;
//       }

//     },
//     error: function (err) {
//       console.log(err);
//       toastr.error('Whoops! Something went wrong.');
//     }
//   });




// }


function getCustomerClaims() {
  var userDetails = JSON.parse(getFromStore("user"));
  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  var user = JSON.parse(getFromStore("user"))
  var url = env.node_api_url + "eclaims/cases/getClaimI?user_name=" + userDetails.email;
  if (getFromStore('type') === "scan" || getFromStore('type') === "tinyURL") {
    var userInfo = JSON.parse(getFromStore("customerEmailForInvalid"));
     url = env.node_api_url + "eclaims/cases/getClaimI?user_name=" + userInfo.email
  }
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
      var json = data;
      
      if (json.length > 0) {
        
        var claimsHtml = `
        <div class="table-responsive">
          <table id= "claimsMainTable" class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Claim Id</th>
                <th>Claim Date</th>
                <th>Customer Name</th>
                <th>Policy No</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>`;
 
              Object.values(json).forEach(value => {
                // console.log(value.customers.Email+' '+value.customers.FirstName+" "+value.customers.LastName);
                if (value.CaseNumber.substring(0, 2) == getFromStore('prefix').substring(0, 2).toUpperCase()) {
                  let insuProvider = 'NA';
                  if (value.insuranceProvider)
                    insuProvider = value.insuranceProvider.toUpperCase();
      
                    claimsHtml += `
                    <tr>
                      <td onclick="myFunctionGetTravel('${value.CaseNumber}'); sentEmailInfo('${value.customers.Email}', '${value.customers.FirstName}', '${value.customers.LastName}')"><a style="color:blue;cursor:pointer">${value.CaseNumber}</a></td>
                      <td>${new Date(value.CreationDate).toLocaleDateString('en-GB')}</td>
                      <td>${value.customers.FirstName.charAt(0).toUpperCase() + value.customers.FirstName.slice(1) + ' ' + value.customers.LastName.charAt(0).toUpperCase() + value.customers.LastName.slice(1)}</td>
                      <td>${value.travelPolicy[0] ? value.travelPolicy[0].policyNumber : 'NA'}</td>
                      <td>${value.travelCases.subClaimType}</td>
                      <td>${value.travelCases.claimSatus}</td>
                    </tr>`;
                }
              });
  
              claimsHtml += `
            </tbody>
          </table>
        </div>`;
 
        document.getElementById("claimsListContainer").innerHTML = claimsHtml;
        // let itemsPerPage = 10;

        // Call the functions to create the pagination buttons and show the first page
        // createPageButtons();
        // showPage(0);
        // searchInput.addEventListener("input", function () {
        //   var searchValue = this.value.toLowerCase();
        
        //   // If the search input is empty, reset the table
        //   if (searchValue === '') {
        //     document.getElementById("claimsListContainer").innerHTML = claimsHtml;
        //     createPageButtons();
        //     showPage(0);
        //     return;
        //   }
        
        //   var tableRows = claimsListContainer.querySelectorAll("tbody tr");
        
        //   Array.from(tableRows).forEach(function (row) {
        //     var rowText = row.innerText.toLowerCase();
        
        //     if (rowText.includes(searchValue)) {
        //       row.style.display = "";
        //     } else {
        //       row.style.display = "none";
        //     }
        //   });
        
        //   // Count the number of visible rows
        //   var visibleRows = Array.from(tableRows).filter(function (row) {
        //     return row.style.display !== "none";
        //   }).length;
        
        //   // If no rows are visible, display a "No results found" message
        //   if (visibleRows === 0) {
        //     document.getElementById("claimsListContainer").innerHTML = `<h2>No results found</h2>`;
        //   }
        // });
        $('#claimsMainTable').DataTable(
          {
            ordering: false
          }
        );
      }
      else {
        document.getElementById("claimsListContainer").innerHTML = `<h2>No claims has been found</h2>`;
      }
    },
    error: function (err) {
      console.log(err);
      toastr.error('Whoops! Something went wrong.');
    }
  });

// Call createPageButtons to initialize the pagination
//  createPageButtons();
 }
 
// let itemsPerPage = 10;
// let currentPage = 0;
// let totalPages = 0; // Define totalPages globally

// function showPage(pageNumber) {
//   currentPage = pageNumber;
//   var tableRows = claimsListContainer.querySelectorAll("tbody tr");
//   var startItem = pageNumber * itemsPerPage;
//   var endItem = startItem + itemsPerPage;

//   Array.from(tableRows).forEach(function (row, index) {
//     if (index >= startItem && index < endItem) {
//       row.style.display = "";
//     } else {
//       row.style.display = "none";
//     }
//   });

//   // Update the current page button text
//   var currentPageButton = document.querySelector(".pagination-container button:nth-child(2)");
//   currentPageButton.innerText = `${currentPage + 1} of ${totalPages}`;

//   updateButtonStyles();
// }

// function createPageButtons() {
//   var tableRows = claimsListContainer.querySelectorAll("tbody tr");
//   var totalItems = tableRows.length;
//   totalPages = Math.ceil(totalItems / itemsPerPage); // Update totalPages

//   var paginationContainer = document.createElement("div");
//   paginationContainer.className = "pagination-container";

//   // Previous Button
//   var prevButton = document.createElement("button");
//   prevButton.innerText = "Previous";
//   prevButton.addEventListener("click", function () {
//     if (currentPage > 0) {
//       showPage(currentPage - 1);
//     }
//   });
//   setButtonStyles(prevButton); // Set styles for the button
//   paginationContainer.appendChild(prevButton);

//   // Current Page Button
//   var currentPageButton = document.createElement("button");
//   currentPageButton.innerText = `${currentPage + 1} of ${totalPages}`;
//   currentPageButton.addEventListener("click", function () {
//     // You can add functionality here if needed
//   });
//   setButtonStyles(currentPageButton); // Set styles for the button
//   paginationContainer.appendChild(currentPageButton);

//   // Next Button
//   var nextButton = document.createElement("button");
//   nextButton.innerText = "Next";
//   nextButton.addEventListener("click", function () {
//     if (currentPage < totalPages - 1) {
//       showPage(currentPage + 1);
//     }
//   });
//   setButtonStyles(nextButton); // Set styles for the button
//   paginationContainer.appendChild(nextButton);

//   document.getElementById("claimsListContainer").appendChild(paginationContainer);

//   // Set initial styles
//   updateButtonStyles();
// }

// function setButtonStyles(button) {
//   button.style.backgroundColor = "#5272F2"; // Blue background
//   button.style.color = "white"; // White text
//   button.style.border = "none"; // No border
//   button.style.padding = "10px 20px"; // Padding around text
//   button.style.textAlign = "center"; // Center text
//   button.style.textDecoration = "none"; // No underline
//   button.style.display = "inline-block"; // Display as inline block
//   button.style.fontSize = "15px"; // Font size
//   button.style.margin = "4px 2px"; // Margin around button
//   button.style.cursor = "pointer"; // Change cursor to pointer when hovering over button
//   button.style.transition = "background-color 0.3s ease"; // Transition background color
//   button.style.borderRadius = "12px"; // Rounded corners
// }

// function updateButtonStyles() {
//   var buttons = document.querySelectorAll(".pagination-container button");
//   buttons.forEach(function (button, index) {
//     if (index === 1) { // Check if the button is the current page button
//       button.style.backgroundColor = "#4CAF50"; // Green background for the current page
//       button.innerText = `${currentPage + 1} of ${totalPages}`; // Update text for the current page button
//     } else {
//       button.style.backgroundColor = "#5272F2"; // Blue background for other pages
//     }
//   });
// }

// function for QR and Bitlink in Claim Status
function getTableForQrAndBitlink(searchValue) {
  if (searchValue.trim() === '') {
    // If searchValue is empty, display a message
    document.getElementById("claimsListContainer").innerHTML = `<h2 class="text-center" style="color: red!important;font-size:13.6px;">Kindly Enter Certificate Number/Policy Number/Claim Number</h2>`;
    return;
  }
  var insuProvider = getFromStore('clientIDNM')
  $('#loader').show();
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url + `eclaims/searchCaseNumberPolicyNumber?searchString=${searchValue}&clientName=${insuProvider}`,
    type: "GET",
    processData: false,
    contentType: false,
    headers: {
      Authorization: "Bearer " + getFromStore("eclaimsToken")
    },
    success: function (data) {
      $('#loader').hide();
      var json = data;
      if (json.length > 0) {
        // Display the claim information
        var claimDetails = `
            <div class="table-responsive">
              <table id="claimsTable" class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Claim Number</th>
                    <th>Claim Date</th>
                    <th>Customer Name</th>
                    <th>Policy No</th>
                    <th>Sub Claim Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>`;

        Object.values(json).forEach(value => {
            claimDetails += `
                    <tr>
                      <td onclick="myFunctionGetTravel('${value.CaseNumber}');sendEmailForQrAndBitlink('${value.email}', '${value.CustomerName}')" style="color:blue;cursor:pointer">${value.CaseNumber}</td>
                      <td>${new Date(value.CreationDate).toLocaleDateString('en-GB')}</td>
                      <td>${value.CustomerName}</td>
                      <td>${value.PolicyNumber}</td>
                      <td>${value.subclaimType}</td>
                      <td>${value.currentClaimStatus}</td>
                    </tr>
                      `;
        });


            claimDetails += `
          </tbody>
        </table>
      </div>`;
        document.getElementById("claimsListContainer").innerHTML = claimDetails;
        $('#claimsTable').DataTable(
          {
            ordering: false
          }
        );
      }
      else {
        document.getElementById("claimsListContainer").innerHTML = `<h2 class="text-center" style="color: red!important;font-size:16px;">No Results has been found</h2>`;
      }
    },
    error: function (err) {
      console.log(err);
      toastr.error('Whoops! Something went wrong.');
    }
  })


}
 

function getCustomerRecentClaim() {


  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  let user = JSON.parse(getFromStore("user"));
  // alert(user.email)

  // var url = env.api_url + "/api/Customer/GetCustomerClaims?eclaimToken=" + eclaims_token;
  // var url = env.node_api_url + "eclaims/customers/getCustomerListByEmail?email=" + user.email + "&phone=" + user.mobile;
  var url = env.node_api_url + "eclaims/cases/getClaimI?user_name=" + user.email
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
      var json = data;

      if (json.length > 0) {
        var claimDetails = json.slice(-1)[0];
        setToStore("claimTypeIdM", claimDetails.travelCases.claimType)
        window.location.href = env.app_url + "claimdetails.html?claimId=" + claimDetails.CaseNumber;
        // window.location.href = env.app_url + "documentsuploadpage.html?claimId=" + claimDetails.CaseNumber + "&Id=" + claimDetails.travelCaseRef + "&email=" + user.email;
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
function sentEmailInfo(cusEmail,firstName,lastName){
let emailInfo ={};
emailInfo.email = cusEmail;
emailInfo.firstName = firstName;
emailInfo.lastName = lastName
console.log(emailInfo)
var userjson = JSON.stringify(emailInfo);
setToStore('emailObj',userjson);
}

function sendEmailForQrAndBitlink(cusEmail,name){
let emailInfo ={};
emailInfo.email = cusEmail;
emailInfo.name = name;
console.log(emailInfo)
var userjson = JSON.stringify(emailInfo);
setToStore('qrObj',userjson);
}

function myFunctionGetTravel(claimId) {

  var eclaims_token = getFromStore("eclaimsToken");
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url + 'eclaims/itemByCaseNumber?CaseNumber=' + claimId,
    type: "GET",
    // data: fd,
    // dataType: "JSON",
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaims_token
    },
    success: function (data) {
      var travelData = data;
      // alert('its me');  
      setToStore('CTrvelCaseId', travelData[0].travelCaseRef)
      window.location = env.app_url + 'claimdetails.html?claimId=' + claimId;
    }
  })

}
function sendmail(email, subject, body) {
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
      Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNTIwMzc2NywiaWF0IjoxNjIwMDE5NzY3fQ.3ule65iQOmi9wGlb3tnnveK91frgtGUNCTtmGA3ErD8'
    },
    success: function (data) {
      console.log("mail sent");
    },
    error: function (err) {
      console.log(err);
      $("#ajaxStart").removeAttr("disabled", false);
      $("#ajaxStart").html("Continue");
      toastr.error('Whoops! This didn\'t work. Please contact us.');
    }
  })

}


function logout() {
  var userDetails = JSON.parse(getFromStore("user"));
  var clientId = userDetails.clientId;
  clearStore();
  window.location = env.app_url + "signin-signup.html?clientId=" + clientId;
}
