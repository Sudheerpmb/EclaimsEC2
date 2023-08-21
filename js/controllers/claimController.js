$(function () {

    $('#uploadDocuments2').show();

    if (getFromStore("incidentDate")) {
        var incDate = getFromStore("incidentDate");
        $("#incidentDate").val(incDate);
    }
    $("#policyForm").hide();
    if (getFromStore("nonExistingCustomer")) {
        $("#policyForm").show();
    }

    $('input[type=radio]').on("change", function () {
        $('#uploadDocuments').show();
        $('#uploadDocuments2').show();
        if ($(this).prop('id') === "cashless") {
            $('#uploadDocuments2').hide();
        }
    });

    toggleFields();
    getCountries();


    $("#paymenttype").change(function () {
        toggleFields();
    });




    function getCountries() {

        var url = "js/json/countries.json";
        $.getJSON(url, function (data) {
            $.each(data, function (name, value) {
                $('#sel2').append('<option value="' + value.code + '">' + value.name + '</option>');
                $('#permanent_country').append('<option value="' + value.code + '">' + value.name + '</option>');

            });
        });
    }
    /*
    function getAllClaimTypes(claimTypeId){
         $.ajax ({
              url: env.app_url+"/data/claimTypes.json",
              method: "GET"
            }).success(function (response) {
               var claimTypes = response;
               var result= '';
                Object.values(claimTypes).forEach(value=>{ 
                    if(value.id == claimTypeId){
                        $("#eventLabel").val(value.ClaimName);
                        $("#eventId").val(value.Event);
                        $("#eventDetails").val(value.EventDetails);
                    }              
                 });
                 
            });
    }
    */

    function toSnakeCase(inputString) {
        let s = inputString.split('').map((character) => {
            if (character == character.toUpperCase()) {
                return ' ' + character.toUpperCase();
            } else {
                return character;
            }
        })
        .join('');
        return s[0].toUpperCase() + s.slice(1);
    }
    $("#createClaim").validate({
        rules: {
            incidentDate: "required",
            incidentAddress: "required",
            incidentCountry: "required",
            incidentCity: "required",
            paymentType: "required",
            customerName: "required",
            customerSurName: "required",
            claimAmount: {
                required: true,
                digits: true
            },
            contactNumber: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 14
            },
            contactEmail: {
                required: true,
                email: true
            },
            EmployeeNumber: "required",
            dob: "required",
            gender: "required",
            TypeOfCurrency: "required"
        },
        messages: {
            incidentDate: "Date of loss is required",
            incidentAddress: "Address is required",
            incidentCountry: "Country of loss is required",
            incidentCity: "City of loss is required",
            paymentType: "Payment type is required",
            customerName: "Insured Person / Policy Holder First name is required",
            customerSurName: "Insured Person / Policy Holder Sur name is required",
            claimAmount: "Claim amount is required",
            TypeOfCurrency: "Type of Currency is required",
            dob: "Dob is required",
            gender: "Gender is required",
            contactNumber: {
                required: "Beneficary mobile number is required.",
                digits: "Mobile number should be a number",
                minLength: "Please provide a valid Beneficary number"
            },
            contactEmail:
            {
                required: "Beneficary email is required",
                email: "Valid email is required"
            }
        },
        submitHandler: function (form, event) {

            event.preventDefault();

            // if(form.elements.paymentType.value == "cashless"){
            //     if(form.elements.Passport_Copy.value == ''){
            //         alert('Passport document is required');
            //         return false;
            //     }
            //     if(form.elements.Visa_Exit_And_Entry.value == ''){
            //         alert('Visa exit and entry document is required');
            //         return false;
            //     }

            // }else if(form.elements.paymentType.value == "reimbursement"){

            //     if(form.elements.PAN_Card.value == ''){
            //         alert('Pan card document is required');
            //         return false;
            //     }
            //     if(form.elements.Cancelled_Cheque.value == ''){
            //         alert('Cancelled cheque is required');
            //         return false;
            //     }
            // }


            if (form.elements.incidentDate.value && claimTypeId != 7) {
                var incDate = form.elements.incidentDate.value.split("-");
                var incCreateDate = incDate[1] + "-" + incDate[0] + "-" + incDate[2];
                var varDate = new Date(incCreateDate); //dd-mm-YYYY
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                if (varDate > today) {
                    toastr.error('Incident date cannot be a future date');
                    return false;
                }
            } else {
                var incDate = form.elements.incidentDate.value.split("-");
                var incCreateDate = incDate[1] + "-" + incDate[0] + "-" + incDate[2];
            }
            setToStore("policyCopyPrs", 0);
            var access_token = getFromStore("token");
            var eclaim_token = getFromStore("eclaimsToken");
            var policyDetails = JSON.parse(getFromStore("policyDetails"));
            var policyNumber = policyDetails ? policyDetails.policyNumber : form.elements.policyNumber.value;
            var travelPolicyRef = policyDetails ? policyDetails.travelPolicyRef : "";
            var customerRef = policyDetails ? policyDetails.customerRef : "";

            var userDetails = JSON.parse(getFromStore("user"));
            var clientId = userDetails.clientId;
            let clientIDE = getFromStore('clientIDE');
            let policy_copy_req = getFromStore('policyCopyReq');

            if (parseInt(policy_copy_req)) {
                if (form.elements['Policy copy'].value == '') {
                    toastr.error('Policy Copy is required');
                    return;
                }
            }
            // alert("----",form.elements.airPort.value)
            var fullName = form.elements.customerName.value;
            var nameParts = fullName.split(' ');

              var firstName = nameParts[0];
              var lastName = nameParts[1];
    
           
            var claimData = JSON.stringify(
                {

                                        // "claimType":claimTypeId,
                                        "airport": form.elements.airPort.value,
                                        "launge":form.elements.launge.value,
                                        "TagNo":form.elements.Tagno.value,
                                        "airportServices":form.elements.airportservices.value,
                                        "customerfirstname": firstName,
                                        "customerlastname": lastName + form.elements.customerSurName.value,
                                        "phone": form.elements.contactNumber.value,
                                        "email": form.elements.contactEmail.value,
                                        "policyNumber": policyNumber,
                                        "CreatedByEclaims": userDetails.email,
                                        "CreatedBy": "Eclaims",
                                        "dateOfBirth": form.elements.dob.value,
                                        "gender": form.elements.gender.value,
                                        "caseType": "3",
                                        "title": "Mr.",
                                        "ClaimedPersonType":form.elements.ClaimedPersonType.value,
                                        "claimDescription": "test desc",
                                        "claimEvent": "Client Esclation",
                                        "claimMode": "cash",
                                        "claimNote": "test claim",
                                        "claimReported": "Eclaims",
                                        "claimType": claimTypeId,
                                        "contactEmail": form.elements.contactEmail.value,
                                        "contactNumber": form.elements.contactNumber.value,
                                        "currency": form.elements.TypeOfCurrency.value,
                                        "customerRef": customerRef,
                                        "hopsitalZipCode": form.elements.zipCode.value,
                                        "hospital": "Test Hosp",
                                        "hospitalAddress": "Test Hosp Address",
                                        "hospitalCity": "Visakhapatnam",
                                        "hospitalCountry": "IND",
                                        "hospitalState": "Andhra Pradesh",
                                        "hospitaltype": "Government",
                                        "incidentAddress": form.elements.incidentAddress.value,
                                        "incidentCity": form.elements.incidentCity.value,
                                        "incidentCountry": form.elements.incidentCountry.value,
                                        "incidentDate": incCreateDate,
                                        "incidentState": "Andhra Pradesh",
                                        "initialReservAmountUSD": form.elements.claimAmount.value,
                                        "clientId": clientId,
                                        "subClaimType": "Medical Out-patient",
                                        "travelDate": "2021-04-02",
                                        "travelPolicyRef": travelPolicyRef,
                                        "address1": form.elements.permanentAddress.value,
                                        "address2": form.elements.permanenetStreetOne.value + ',' + form.elements.permanenrStreetTwo.value,
                                        "state": form.elements.permanentRegion.value,
                                        "city": form.elements.permanentCity.value,
                                        "country": form.elements.permanentCountry.value,
                                        "zip": form.elements.permanentZipCode.value,
                                        "Remarks": form.elements.Remarks.value
                });
            
            let body = ''
            for (let elem in JSON.parse(claimData)) {
                const str = elem
                body += `${toSnakeCase(str)} --  ${JSON.parse(claimData)[elem]}\n\n`

            }
            setToStore("policyFormPrs", body);

            let policyCopy = $('#policyCopy')[0].files[0]
            // document.write(policyCopy);
            var policyForm = new FormData();
            policyForm.append("imgUploader", policyCopy);
            var newForm = new FormData();
            newForm.append("claimType", 3);
            newForm.append("FirstName", form.elements.customerName.value);
            newForm.append("Name", form.elements.customerSurName.value);
            newForm.append("ClmDateOccured", incCreateDate);
            newForm.append("claimAmount", form.elements.claimAmount.value);
            newForm.append("TypeOfCurrency", form.elements.TypeOfCurrency.value);
            newForm.append("incidentZip", form.elements.zipCode.value);
            newForm.append("incidentCity", form.elements.incidentCity.value);
            // newForm.append("incidentState", form.elements.incidentState.value);
            newForm.append("incidentState", "");
            newForm.append("incidentAddress", form.elements.incidentAddress.value);
            newForm.append("incidentCountry", form.elements.incidentCountry.value);
            newForm.append("clmSpecific1", form.elements.paymentType.value);
            newForm.append("eventId", form.elements.eventId.value);
            newForm.append("eventLabel", form.elements.eventLabel.value)
            newForm.append("eventDetailId", form.elements.eventDetails.value);
            newForm.append("eventDetailLabel", form.elements.eventDetailLabel.value);
            newForm.append("cause", form.elements.cause.value);
            newForm.append("policyNumber", policyNumber);
            newForm.append("beneficiaryNumber", form.elements.contactNumber.value);
            newForm.append("beneficiaryEmail", form.elements.contactEmail.value);
            newForm.append("Gender", form.elements.gender.value);
            newForm.append("DOB", form.elements.dob.value);
            newForm.append("permanentAddress", form.elements.permanentAddress.value);
            newForm.append("permanenetStreetOne", form.elements.permanenetStreetOne.value);
            newForm.append("permanenrStreetTwo", form.elements.permanenrStreetTwo.value);
            newForm.append("permanentRegion", form.elements.permanentRegion.value);
            newForm.append("permanentCity", form.elements.permanentCity.value);
            newForm.append("permanentCountry", form.elements.permanentCountry.value);
            newForm.append("permanentZip", form.elements.permanentZipCode.value);
            newForm.append("clientId", clientId);
            newForm.append("customerRef", customerRef);
            newForm.append("travelPolicyRef", travelPolicyRef);
            newForm.append("policycopy", policyCopy)



            /*newForm.append("Passport_Copy", form.elements.passportUpload.value);
            newForm.append("Visa_Exit_And_Entry", form.elements.visaUpload.value);
            newForm.append("PAN_Card", form.elements.panCardUpload.value);
            newForm.append("Cancelled_Cheque", form.elements.CancelledChequeUpload.value);
            newForm.append("Policy_Form",form.elements.policyFileUpload.value);*/

            for (var i = 0; i < $('input[type=file]').length; i++) {
                newForm.append($('input[type=file]')[i].name, $('input[type=file]')[i].files[0]);
            }
            newForm.append("eclaimToken", eclaim_token);
            $("#ajaxStart").prop("disabled", true);
            $("#ajaxStart").html("Processing...");
            for (var pair of newForm.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            $.ajax({
                async: true,
                crossDomain: true,
                url: env.node_api_url + "eclaims/cases/saveClaim",
                type: "POST",
                data: claimData,
                // dataType: "JSON",
                contentType: "application/json",
                processData: false,
                headers: {
                    Authorization: "Bearer " + eclaim_token
                },
                success: function (data) {
                    let response_data = data;
                    // alert(policyCopy !== 'undefined')
                    if (policyCopy !== undefined) {
                        setToStore("policyCopyPrs", 1);
                        $.ajax({
                            async: true,
                            crossDomain: true,
                            url: env.node_api_url + "api/uploadDocuments?docTypeId=PolicyCopy&travelCaseId=" + response_data.travelCaseId,
                            type: "POST",
                            data: policyForm,
                            // dataType: "JSON",
                            contentType: false,
                            processData: false,
                            headers: {
                                Authorization: "Bearer " + eclaim_token
                            },
                            success: function (data1) {
                                let dat = data1;
                            }
                        })
                    }
                    sendmail1(response_data.email, response_data.caseNumber)
                    if (response_data.success) {
                        toastr.success('Claim created successfully');
                        $("#ajaxStart").prop("disabled", false);
                        $("#ajaxStart").html("Continue");

                        window.location = env.app_url + "documentsuploadpage.html?claimId=" + response_data.caseNumber + "&Id=" + response_data.travelCaseId + "&email=" + response_data.email;
                    } else if (response_data.status == "Failed") {
                        toastr.error('Claim creation failed, Please try again!');
                        $("#ajaxStart").removeAttr("disabled", false);
                    }

                },
                error: function (err) {
                    console.log(err);
                    $("#ajaxStart").removeAttr("disabled", false);
                    $("#ajaxStart").html("Continue");
                    toastr.error('Whoops! This didn\'t work. Please contact us.');
                }
            });
            return false;

            //     }
            // })   

        }

    })




    document.setcookie = "key=no";
    function sendmail1(email, caseno) {
        let eclaimToken = getFromStore("eclaimsToken");
        let clientIde = getFromStore("clientIDE");
        let clienthash = getFromStore("clientHash");
        let url = env.node_api_url + 'api/communicate/sendEmails_new';
        let rel = '';
        let cc = [];
        if (clientIde == 'RELIANCE') {
            url = env.node_api_url + 'eclaims/sendEmail_forEclaims'
            rel = `<p>Please find attached the blank Claim forms to be filled, signed & submitted by you</p>`
        }
        if (clientIde == 'TATA AIG') {
            url = env.node_api_url + 'eclaims/sendEmail_forEclaimsTATAAIG'
            cc.push('sbompada@europ-assistance.in')
            cc.push('amukherjee@europ-assistance.in')
        }
        let today = new Date();
        var userObj = JSON.parse(getFromStore("user"));
        let body = '';

        if (parseInt(getFromStore("policyCopyPrs"))) {
            body += "<p>Thank you for your following enclosures sent to us. </p>"
            body += "<ul>Policy Copy</ul>"
        }
        let template = `<div>
        <p><b>Dear ${userObj.firstName.charAt(0).toUpperCase() + userObj.firstName.slice(1)} ${userObj.lastName.charAt(0).toUpperCase() + userObj.lastName.slice(1)}</b></p>
        <p><span><b>CLAIM REFERENCE: ${caseno}</b></span>
        ${body}
        <p>Your calim has been successfully created</p>
        ${rel}
        <p>Yours sincerely,</p>
        <p>Claims Team</p>
        </div>`;
        if (clientIde == 'TATA AIG') {
            template = `<div>
            <p><b>Dear ${userObj.firstName.charAt(0).toUpperCase() + userObj.firstName.slice(1)} ${userObj.lastName.charAt(0).toUpperCase() + userObj.lastName.slice(1)},</b></p>
            <p>Thank you for contacting us via E-Claims.</p>
            <p><span><b>As per your request, your Claim has been registered and the claim number allotted is  ${caseno}</b></span>
            <p> Kindly upload the duly filled attached forms and claim documents on E-Claims Portal.(Please click on below Link to upload documents)</p>
            <a href="https://eclaimsuat.europassistance.in/signin-signup.html?clientId=${clienthash}">Upload files</a>
            <p>Please keep the attachment size less that 10MB while uploading the documents.</p>
            <p>Request you to submit the documents as early as possible.</p>
            <p>We thank you for insuring with TATA-AIG and assure you of our best services always.</p>
            <p><b><u> NOTE:</u> </b> All claims are processed as per policy benefits, terms and condition. Final decision of any claim made will be done after receiving and assessment of all the required documents.</p>
            <p>Yours sincerely,</p>
            <p>Claims Team</p>
            </div>`
        }
        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            type: "POST",
            data: JSON.stringify({
                "email": email,
                "name": " ",
                "subject": `E-Claim Alerts: ${caseno} Registered`,
                "cc": cc,
                "body": `${template}`
            }),
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: "Bearer " + eclaimToken
            },
            success: function (data) {
                console.log("mail sent")
                // alert('A mail has been sent to your mail id');
            },
            error: function (err) {
                console.log(err);
                $("#ajaxStart").removeAttr("disabled", false);
                $("#ajaxStart").html("Continue");
                toastr.error('Whoops! This didn\'t work. Please contact us.123');
            }
        })

    }

    function toggleFields() {
        if ($("#paymenttype").val() === "reimbursement") {
            $("#uploadDocuments2").show();
        }
        else {
            $("#uploadDocuments2").hide();/*
         alert("Please do not forget to send Original copy through courier");*/}

    }

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
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


});
