$(function () {

    //getDocumentsList(); 
    getClaimAttachments();


    $("#uploadDoc").validate({
        submitHandler: function (form, event) {
            event.preventDefault();

            var access_token = getFromStore("token");
            var eclaim_token = getFromStore("eclaimsToken");
            var originals = getFromStore("originalDocsList");
            var userDetails = JSON.parse(getFromStore("user"));
            var clientId = userDetails.clientId;

            var newForm = new FormData();
            newForm.append("claimId", claimId);
            // newForm.append("description", form.elements.fileName.value);
            //newForm.append("document", $('input[type=file]')[0].files[0]); //form.elements.upload.value);
            newForm.append("eclaimToken", eclaim_token);
            newForm.append("clientId", clientId);
            var uploadedDocsListStore = [];
            if (getFromStore("uploadedDocsList") != null) {
                uploadedDocsListStore = getFromStore("uploadedDocsList").split(",");
            }
            for (var i = 0; i < $('input[type=file]').length; i++) {
                if (typeof $('input[type=file]')[i].files[0] != 'undefined') {
                    uploadedDocsListStore.push($('input[type=file]')[i].name);
                }
                newForm.append($('input[type=file]')[i].name, $('input[type=file]')[i].files[0]);
            }


            $.ajax({
                async: true,
                crossDomain: true,
                url: env.api_url + "/api/Claims/eClaimAddMultipleAttachmentToClaim",
                type: "POST",
                data: newForm,
                contentType: false,
                processData: false,
                headers: {
                    Authorization: "Bearer " + access_token
                },
                success: function (data) {
                    getClaimAttachments();
                    var json = JSON.parse(data);
                    if (json.status == "Success") {
                        var documentsListStore = getFromStore("documentsList").split(",");

                        var pendingDocs = arrayDiff(uploadedDocsListStore, documentsListStore);
                        var message = "";
                        var pendinghtml = "";
                        if (pendingDocs.length > 0) {
                            pendinghtml += "<ul>";
                            $.each(pendingDocs, function (index, value) {
                                pendinghtml += "<li>" + value + "</li>";
                            });
                            pendinghtml += "</ul>";
                        }


                        if (!getFromStore("nonExistingCustomer")) {
                            if (pendingDocs.length > 0) {
                                message += "We have saved your claims details and your reference number is " + claimId + " however, we would not be able to process your claim unless the below mandatory documents are provided <br/> " + pendinghtml + ".";
                                message += originals != "" ? "<br/><br/> You also need to share the originals of " + originals : "";
                            } else {
                                if (mode == "update") {
                                    message += "Thankyou for providing the mandatory documents.";
                                    message += originals != "" ? " Please do not forget to share the originals of " + originals : "";
                                    message += "<br/><br/> Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.";
                                } else {
                                    message += "Thankyou for providing the details. Your reference number is " + claimId + ".";
                                    message += " We are forwarding the claim to concern team for further action.";
                                    message += originals != "" ? " Please donot forgot to share the originals of " + originals : "";
                                    message += "<br/><br/> Acceptance or payment of the claim is subject to the Terms and Conditions mentioned in the policy document. You can track the status of your claim in the “Track Status” section.";

                                }
                            }
                        } else {
                            if (pendingDocs.length > 0) {
                                message += "We have saved your claims details and your reference number is " + claimId + " however, you still need to provide the below mandatory documents <br>" + pendinghtml;
                                message += originals != "" ? "<br/><br/> You also need to share the originals of " + originals : "";
                                message += " <br/><br/> Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.";
                            } else {
                                if (mode == "update") {
                                    message += "Thank you for providing the mandatory documents. We are forwarding these to the concerned team for further action. ";
                                    message += originals != "" ? " Please do not forget to share the originals of " + originals : "";
                                    message += "<br/><br/> Acceptance or payment of the claim is subject to the Terms and Conditions mentioned in the policy document. You can track the status of your claim in the “Track Status” section.";
                                } else {
                                    message += "Thankyou for providing the details. Your reference number is " + claimId + ".";
                                    message += originals != "" ? " Please do not forget to share the originals of " + originals : "";
                                    message += " <br/><br/>  Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.";
                                }
                            }
                        }
                        bootbox.alert(message, function () {
                            window.location = env.app_url + "index.html";
                        });
                        // 

                    }
                },
                error: function (err) {
                    console.log(err);
//                     alert('Whoops! This didn\'t work. Plxease contact us.');
                }
            });
            return false;



        }

    });

    function arrayDiff(array1, array2) {
        var newItems = [];
        jQuery.grep(array2, function (i) {
            if (jQuery.inArray(i, array1) == -1) {
                newItems.push(i);
            }
        });
        return newItems;
    }

    function getClaimAttachments() {

        var eclaims_token = getFromStore("eclaimsToken");
        var access_token = getFromStore("token");

        var userDetails = JSON.parse(getFromStore("user"));
        var clientId = userDetails.clientId;


        var newForm = new FormData();
        newForm.append("clientId", clientId);
        newForm.append("eclaimToken", eclaims_token);
        var claimTypeId = getFromStore("claimTypeIdM")


        // var url =  env.api_url+"/api/Claims/GetAttachmentList?claimNo="+claimId;
        var url = 'https://eztraveluat.europassistance.in:3000/eclaims/documents/list?claimtype=' + claimTypeId;
        //  removeFromStore("uploadedDocsList");
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "GET",
            // data:newForm,
            processData: false,
            contentType: false,
            headers: {
                Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZjFjMmQ2MjBjM2E2Mjc0NDk3YmZkOCIsInJvbGUiOiJhZ2VudCIsImV4cCI6MTYyNDk0NDcxOCwiaWF0IjoxNjE5NzYwNzE4fQ.4q_42wHXeAC4OMMFMuScB57LEwvZd53y0XoKhIdFcqs'
            },
            success: function (data) {
                var json = data[0];
                // var json = JSON.parse(data[0]);                
                var eventDetailId = json._id;
                // if(json.Success == true){
                var result = '';
                var html = "";
                // var uploaded_docs = JSON.parse(json.AttachmentList);
                var uploaded_docs = json.Documents;
                var uploadDocsList = [];
                Object.values(uploaded_docs).forEach(value => {

                    result += ` <div style="display: flex;justify-content: space-between;">
                    <a href="javascript:;"  data-id= ${value.Name} class="myLink" > ${value.Name}</a> 
                    
                    <div class="col-xs-6" style="float: right !important;">
                    <div class="button-wrapper" style="width: 100px !important;text-align: center;padding:5px;">
                         <span class="label">Upload</span>
                         <input type="file" name="${value.Name}"  accept="image/jpeg,image/png,application/pdf"
                     data-msg-accept="File type should be PDF, jpeg or png." class="upload upload-box" placeholder="Attach">
                     </div></div></div>
                   `;
                    uploadDocsList.push(value.Name);
                });
                uploadDocsList.push('costomName');
                setToStore("uploadedDocsList", uploadDocsList);






                document.getElementById("upload_container").innerHTML = result;

                var linksArray = document.getElementsByClassName("myLink");
                for (var i = 0; i < linksArray.length; i++) {
                    linksArray[i].addEventListener('click', downloadAttachment, false);
                }


                // }
                // prepareDocsUploadContainer(eventDetailId);
            },
            error: function (err) {
                console.log(err);
                alert('Whoops! This didn\'t work. Please contact us.');
            }
        });

        return false;
    }

    function downloadAttachment() {

        var docId = this.getAttribute("data-id");

        var userDetails = JSON.parse(getFromStore("user"));
        var clientId = userDetails.clientId;


        var newForm = new FormData();
        newForm.append("clientId", clientId);


        var url = env.api_url + "/api/Claims/GetAttachmentContent?documentId=" + docId;

        var access_token = getFromStore("token");
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "POST",
            data: newForm,
            headers: {
                Authorization: "Bearer " + access_token
            },
            success: function (data) {
                var json = JSON.parse(data);

                var jsonData = base64ToArrayBuffer(json.DocumentFile.Content)

                var data = new Blob([jsonData], { type: "application/pdf" });

                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(data);
                link.download = json.DocumentFile.Name;
                link.click();
            },
            error: function (err) {
                console.log(err);
                alert('Whoops! This didn\'t work. Please contact us.');
            }
        });
    }

    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64); // Comment this if not using base64
        const bytes = new Uint8Array(binaryString.length);
        return bytes.map((byte, i) => binaryString.charCodeAt(i));
    }


    $("#submitClaim").click(function () {
        var fd = new FormData();
        var arr = [];
        var html = `<h6><strong> We have saved your claims details.and your reference number is ${claimId}. however, you still need to provide the below mandatory documents </strong> </h6>`
        var uploadDOc = `<strong>CLAIM REFERENCE:  ${claimId}</strong><br>
        Thank you for your following enclosures sent to us. <br><strong><li>Policy Copy</li></strong>`
        var email = `<span>In order for us to proceed with our assessment we will require the following additional information/documentation:</span>`
        $(".upload").each(function () {
            let scm = $(this).attr('name');
            if (typeof $(this)[0].files[0] === 'undefined' && !scm.includes("Other Document")) {
                html += `<div class="col-xs-12 pull-left" style="width: 100%;">
            <div class="col-xs-6 pull-left">
            <li style="margin-left:20px">${scm} &nbsp; 
            </li>`;
                email += `<strong> <li style="margin-left:20px">${scm} &nbsp; 
            </li></strong>`
            }
            else {
                // alert(scm);
                // if (!scm.includes("Other Document"))
                //     uploadDOc += `<strong><li>${scm}</li></strong>`
            }
            let kj = $(this)[0].files[0];
            fd.append(scm, $(this)[0].files[0]);

        });

        email = uploadDOc + email;
        // alert(email)
        // let email=html+"<h6>You also need to share the originals of Invoices & payment receipts <br/>Please note that this is just an acknowledgement of the details submitted by you and not an acceptance of your claim. Our team would try to verify your policy details manually and get in touch with you to assist with the next steps.</h6>"
        let display = html + `<br/><h6>We will be sending you the claim form to your registered email id.Claim forms to be filled, signed & submitted along with the requested claim documents`
        email += `We look forward to hearing from you in due course.<br/>
        Yours sincerely,<br/>
        Claim Team<br/>
        eclaims<br/> 	
        Europ Assistance India`
        // alert(tkId)

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
    function prepareDocsUploadContainer(claimTypeId) {

        $.ajax({
            url: env.app_url + "data/claimTypes.json",
            method: "GET"
        }).success(function (response) {
            var claimTypes = response;
            var result = '';
            Object.values(claimTypes).forEach(value => {
                if (value.EventDetails == claimTypeId) {
                    $("#claimName").html(value.ClaimName);

                    var documentsList = value.Documents;

                    var uploadedDocsList = getFromStore("uploadedDocsList") != null ? getFromStore("uploadedDocsList").split(",") : [];

                    var html = "";
                    var storeDocsList = [];
                    var originalDocsList = [];
                    Object.values(documentsList).forEach(value => {
                        if (value.requiredOriginal) {
                            originalDocsList.push(value.DocumentName);
                        }
                        storeDocsList.push(value.DocumentName);

                        html += `<div class="col-xs-12 pull-left" style="width: 100%;"><div class="col-xs-6 pull-left"><p>${value.DocumentName} &nbsp; <a href="#" data-toggle="tooltip" title="${value.DocumentDescription}"><i class="fa fa-info-circle"  style="font-size: 16px;" ></i></a>`;

                        if (uploadedDocsList.indexOf(value.DocumentName) !== -1) {
                            html += `&nbsp;&nbsp;<i class="fa fa-check fa-lg" aria-hidden="true" style="color: green;"></i>`;
                        }
                        html += `</p></div><div class="col-xs-6" style="float: right !important;"><div class="button-wrapper" style="width: 100px !important;text-align: center;padding:5px;"><span class="label">Upload</span>`;
                        html += `<input type="file" name="${value.DocumentName}"  accept="image/jpeg,image/png,application/pdf"
                    data-msg-accept="File type should be PDF, jpeg or png." class="upload upload-box" placeholder="Attach"></div></div></div>`;
                    });
                    setToStore("documentsList", storeDocsList);
                    setToStore("originalDocsList", originalDocsList);
                    document.getElementById("upload_container").innerHTML = html;
                    $('[data-toggle="tooltip"]').tooltip();
                    $('input[type="file"]').change(function () {
                        var fileName = this.files[0].name;
                        this.parentElement.append(fileName);
                    });
                }
            });

        });
    }

    function fileValidation() {
        var fileInput = document.getElementById('upload');
        var filePath = fileInput.value;
        var allowedExtensions = /(\.pdf|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(filePath)) {
            alert('Please upload file having extensions .jpeg/.jpg/.pdf/.png/');
            fileInput.value = '';
            return false;
        } else {
            //Image preview
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('imagePreview').innerHTML = '<img src="' + e.target.result + '"/>';
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    }


    // function getSelectedClaimsTypes(claimTypeId){
    //     $.ajax ({
    //          url: env.app_url+"/data/claimTypes.json",
    //          method: "GET"
    //        }).success(function (response) {
    //           var claimTypes = response;
    //           var result= '';
    //            Object.values(claimTypes).forEach(value=>{                
    //               if(value.id == claimTypeId){
    //                   console.log(value);
    //                   var documentsList = value.Documents;
    //                   var html = "";
    //                   Object.values(documentsList).forEach(value=>{
    //                     html += '<div class="col-md-12"><div class="col-md-6"><p>Aadhar Card</p></div><div class="col-md-6"><div class="button-wrapper"><span class="label">Upload File</span>';
    //                     html += '<input type="file" name="upload" id="upload" class="upload-box" placeholder="Upload File"></div></div></div>';
    //                 });
    //                 document.getElementById("docs_select").innerHTML = result;
    //               }
    //             });

    //        });
    // }


    // function getDocumentsList(){
    //     $.ajax ({
    //          url: env.app_url+"/data/claimTypes.json",
    //          method: "GET"
    //        }).success(function (response) {
    //           var documentsList = response['BaggageDelay'].Documents;
    //           var result= '<option value="">Select Document</option>';

    //            Object.values(documentsList).forEach(value=>{
    //                 result += `<option value="${value.DocumentName}">${value.DocumentName}</option>`;
    //             });
    //             document.getElementById("docs_select").innerHTML = result;
    //        });
    // }














});

