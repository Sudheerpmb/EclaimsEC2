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
          html += ` <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="section"> <a href="JavaScript:void(0);" onclick="getCustomerRecentClaim()"><img
                src="images/file.jpg" alt="" />
              <h5 style="color:#023783;">Upload documents</h5>
              <h6>to your claims</h6>
            </a> </div>
        </div>`
        }
        else if(item.name == 'Change Password'){
          html +=  `<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="section" style="padding-bottom:13px !important;"> <a href="#" data-target="#changePwdModal"
              data-toggle="modal"><img src="images/file.jpg" alt="" />
              <h5 style="color:#037ebe;">&nbsp;<br>Change Password</h5>
            </a> </div>
        </div>`
        }
        else {
          html += ` <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
       <div class="section"> <a href="${item.link}"><img src=${item.image} alt="" />
           <h5 style="color:${item.color}">${item.name}</h5>
           <h6>${item.tagline}</h6>
         </a> </div>
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
  $.ajax({
    async: true,
    crossDomain: true,
    // url: env.app_url+"data/claimTypes.json",
    url: env.node_api_url+"eclaims/masters/getMastersClientWise",
    type: "POST",
    data: JSON.stringify({
      "projectName": "EzTravel",
      "generalMasterName": "Claim Type",
      "clientName":getFromStore("clientIDE").toUpperCase()

    }),
    // dataType: "JSON",
    contentType: "application/json",
    processData: false,
    headers: {
      Authorization: "Bearer " + eclaims_token
    },
  }).success(function (response) {
    var claimTypes = response;
    for(var i=0;i<response.length;i++){
      for(var j=i;j<response.length;j++){
        if(parseInt(response[i].order)>parseInt(response[j].order)){
          let temp=response[i];
          response[i]=response[j]
          response[j]=temp;
        }
      }
    }
    var result = '';
    Object.values(claimTypes).forEach(value => {
      result += `<div class="coverage0_"><a href="claimform.html?id=${value.name}"><h5>${value.subName}</h5>
                            <p>${value.narratio}</p></a></div>`;
    });
    document.getElementById("claimContainer").innerHTML = result;
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
    }).success(function (response) {
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
    })
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

  var url = env.node_api_url+"api/cases/getCaseDetailsEclaims?caseNumber=" + claimId;

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

        $("#claim_id").html(json.ClaimId);
        $("#pnumber").html(json.policy.policyNumber);
        // $("#status").html(Status);
        $("#claimDate").html(new Date(json.CreationDate).toLocaleDateString('en-GB'));
        // if (json.policy.policyIssuedDate)
        //   $("#policyIssueDate").html(new Date(json.policy.policyIssuedDate).toLocaleDateString('en-GB'))
        // else
        // $("#policyIssuelabel").hide()
          // $("#policyIssueDate").html(`NA`)
        var urlTo = env.node_api_url+'eclaims/documents/list?claimtype=' + type;


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
            let allUploadData = data[0].Documents;
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
                result += ` <div id="${allUploadData[i].Name+'___'}" style="display: flex;justify-content: space-between;color:blue">
                <div onclick="scrollWin()">
              
                <i class="fa fa-plus-square" id="${allUploadData[i].Name+'__'}" onclick="addDiv('${allUploadData[i].Name}')"  style="font-size:18px;cursor: pointer;"aria-hidden="true;"></i>
                <a href="javascript:;"  data-id= ${allUploadData[i].Name} class="myLink"  data-toggle="tooltip" title="${allUploadData[i].Name}" > ${allUploadData[i].Name}</a> 
                </div>
                <div class="col-xs-6" style="float: right !important;">
                <div class="button-wrapper" style="width: 100px !important;text-align: center;padding:5px;">
                     <span class="label">Upload</span>
                     <input type="file" id="${allUploadData[i].Name}" name="${allUploadData[i].Name}"  onchange="showname('${allUploadData[i].Name}','${allUploadData[i].Name + '_'}')" accept="image/jpeg,image/png,application/pdf"
                 data-msg-accept="File type should be PDF, jpeg or png." class="upload upload-box" placeholder="Attach">
                 <label id ="${allUploadData[i].Name + '_'}" style="display:none">  </label>
                 </div></div></div>
               `;
                toBeUploaded.push(allUploadData[i].Name);
              }
              else {
                alreadyUp += ` <div style="display: flex;justify-content: space-between;color:#DD31FF">
                <div onclick="scrollWin()">
                <i class="fa fa-plus-square" id="${allUploadData[i].Name+'__'}" onclick="addDiv('${allUploadData[i].Name}')"  style="font-size:18px;cursor: pointer;"aria-hidden="true;"></i>
                <span  data-id= ${allUploadData[i].Name} class="myLink" > ${allUploadData[i].Name}</span>
                </div>
                <div class="col-xs-6" style="float: right !important;text-align:center;width:11vw;padding-left: 10px;">
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


function submitClaims_() {
  // alert("hi11")
  var eclaim_token = getFromStore("eclaimsToken");
  var tcID_l=getFromStore("CTrvelCaseId");
  var arr = [];
  var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
  var submitedDoc = ``
  var email = `<strong>CLAIM REFERENCE:  ${claimId}</strong><br>
  Thank you for your following enclosures sent to us. {Policy_Copy_}
  <br/><span>In order for us to proceed with our assessment we will require the following additional information/documentation:</span>`
  
  $(".upload").each(function () {
    var fd = new FormData();
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
    else {
      if (scm.includes("Other Document")) {
        if (typeof $(this)[0].files[0] !== 'undefined')
          submitedDoc += `<br><strong><li>${scm}</li></strong>`
      }
      else {
        submitedDoc += `<br><strong><li>${scm}</li></strong>`
      }

    }
    let kj = $(this)[0].files[0];

    fd.append('imgUploader', $(this)[0].files[0]);
    if (typeof $(this)[0].files[0] !== 'undefined'){
      // alert( env.node_api_url+'api/uploadDocuments?docTypeId='+scm+ '&travelCaseId='+tcID_l)
      $.ajax({
          async: true,
          crossDomain: true,
          url: env.node_api_url+'api/uploadDocuments?docTypeId='+scm+ '&travelCaseId='+tcID_l,
          type: "POST",
          data: fd,
          // dataType: "JSON",
          contentType: false,
          processData: false,
          headers: {
              Authorization: "Bearer " +eclaim_token
          },
          success: function (data) {
              // alert(`${scm} inserted`)
          }
      })
  }

  });


  // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
  email += `We look forward to hearing from you in due course.<br/>
  Yours sincerely,<br/>
  Claims Team<br/>
  eclaims<br/> 	
  Europ Assistance India`
  email = email.replace('{Policy_Copy_}', submitedDoc);
  // alert(email);

  // https://eztraveluat.europassistance.in:3000/eclaims/itemByCaseNumber?CaseNumber=


  // $.ajax({
  //   async: true,
  //   crossDomain: true,
  //   url: env.node_api_url+'eclaims/itemByCaseNumber?CaseNumber=' + claimId,
  //   type: "GET",
  //   // data: fd,
  //   // dataType: "JSON",
  //   contentType: false,
  //   processData: false,
  //   headers: {
  //     Authorization: "Bearer " + eclaim_token
  //   },
  //   success: function (data) {
  //     var travelData = data;
  //     $.ajax({
  //       async: true,
  //       crossDomain: true,
  //       url: env.node_api_url+'eclaims/addAttachmentToClaims/multiple?travelCaseId=' + travelData[0].travelCaseRef,
  //       type: "POST",
  //       data: fd,
  //       // dataType: "JSON",
  //       contentType: false,
  //       processData: false,
  //       headers: {
  //         Authorization: "Bearer " + eclaim_token
  //       },
  //       success: function (data) {
  //         var user_F = JSON.parse(getFromStore("user"));
  //         sendmail(user_F.email, `${claimId} updated`, email);
  //         window.location = env.app_url + "index.html";
  //       }
  //     })
  //   }
  // })

  var user_F = JSON.parse(getFromStore("user"));
  sendmail(user_F.email, `${claimId} updated`, email);
  
 alert('The document has been successfully uploaded');
    window.location = env.app_url + "index.html";
 
}

$("#submitClaim12").click(function () {
  // alert("hi")
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
      // alert($(this)[0].files[0]);
    }
    let kj = $(this)[0].files[0];

    fd.append(scm, $(this)[0].files[0]);

  });
  // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
  let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
  email += `We look forward to hearing from you in due course.<br/>
  Yours sincerely,<br/>
  Claims Team<br/>
  eclaims<br/> 	
  Europ Assistance India`
  // alert(tkId)
  // alert(fd);
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url+'eclaims/addAttachmentToClaims/multiple?travelCaseId=' + tkId,
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
          url: env.node_api_url+'api/communicate/sendEmails_new',
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

  var userDetails = JSON.parse(getFromStore("user"));
  var eclaims_token = getFromStore("eclaimsToken");
  var access_token = getFromStore("token");
  var user = JSON.parse(getFromStore("user"))
  var url = env.node_api_url + "eclaims/cases/getClaimI?user_name=" + userDetails.email;

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
        var claimsHtml = `<div class="coverage " style="color:red">
        <div class="clm-row">
           <h5>Claim Id</h5>
        </div>
        <div class="clm-row"> 
            <h5>Claim Date</h5>
         </div>
        <div class="clm-row">
           <h5>Customer Name</h5> 
        </div>
        <div class="clm-row">
        <h5>Policy No</h5> 
     </div>
     <div class="clm-row">
     <h5>Type</h5> 
  </div>
  <div class="clm-row">
  <h5>Status</h5> 
</div>
      </div>`;
      let contacts = new Map()
      let claimCount=0;
        Object.values(json).forEach(value => {
          if (value.CaseNumber.substring(0, 2) == user.clientId.substring(0, 2).toUpperCase() && !contacts.has(value.CaseNumber)) {
            contacts.set(value.CaseNumber,1)
            let insuProvider='NA'
            if(value.insuranceProvider)
            insuProvider= value.insuranceProvider.toUpperCase()
            claimCount++;
            claimsHtml += `  <div class="coverage ">
                                <div class="clm-row">
                                   <h6><a style="color:blue;cursor:pointer" onclick="myFunctionGetTravel('${value.CaseNumber}')">${value.CaseNumber}</a></h6>
                                </div>
                                <div class="clm-row"> 
                                    <h6>${new Date(value.CreationDate).toLocaleDateString('en-GB')}</h6>
                                 </div>
                                <div class="clm-row">
                                
                                   <h6>${value.customers.FirstName.charAt(0).toUpperCase() + value.customers.FirstName.slice(1) + ' ' + value.customers.LastName.charAt(0).toUpperCase() + value.customers.LastName.slice(1)}</h6> 
                                </div>
                                <div class="clm-row">
                                <h6>${value.travelPolicy[0]?value.travelPolicy[0].policyNumber:'NA'}</h6> 
                             </div>
                             <div class="clm-row">
                             <h6>${ value.travelCases.subClaimType}</h6> 
                          </div>
                          <div class="clm-row">
                             <h6>${value.travelCases.claimSatus }</h6> 
                          </div>
                              </div>`;
          }
        });
        if(claimCount==0){
          claimsHtml=`<h5>No Claims Found</h5>`
        }
        document.getElementById("claimsListContainer").innerHTML = claimsHtml;



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
function myFunctionGetTravel(claimId){
  var eclaims_token = getFromStore("eclaimsToken");
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url+'eclaims/itemByCaseNumber?CaseNumber=' + claimId,
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
      // alert('hi')
      setToStore('CTrvelCaseId',travelData[0].travelCaseRef)
      window.location = env.app_url + 'claimdetails.html?claimId='+claimId;
    }
  })

}
function sendmail(email, subject, body) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: env.node_api_url+'api/communicate/sendEmails_new',
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


function logout() {
  var userDetails = JSON.parse(getFromStore("user"));
  var clientId = userDetails.clientId;
  clearStore();
  window.location = env.app_url + "signin-signup.html?clientId=" + clientId;
}
