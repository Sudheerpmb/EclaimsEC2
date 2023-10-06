$(function() {   
    
        $("#feedback").validate({     
          rules: {       
            Claimtype: "required",           
            ability: {
              required: true
            },
            fb: "required",
			experience:"required"
          },
          messages: {
            
          },
          submitHandler: function(form,event) {
            event.preventDefault();       
              var body = {
                            "For which task did you use this application?": form.elements.Claimtype.value,                           
                            "Were you able to complete the desired task?":form.elements.ability.value,
							"Reason for not completing the task": typeof form.elements.reasons == 'undefined'? "" : form.elements.reasons.value,
                            "How was your overall experience with the application?":form.elements.fb.value,
                            "How can we improve your experience?": form.elements.experience.value,
							
                        } 
						var bodyhtml = "";
					bodyhtml += "Question: For which task did you use this application?<br>";
					bodyhtml += "Answer: "+form.elements.Claimtype.value;
					bodyhtml += "<br>Question: Were you able to complete the desired task?<br>";
					bodyhtml += "Answer: "+form.elements.ability.value;
					bodyhtml += "<br>Question: Reason for not completing the task<br>";
					bodyhtml += "Answer: "+typeof form.elements.reasons == 'undefined'? "" : form.elements.reasons.value;
					bodyhtml += "<br>Question: How was your overall experience with the application?<br>";
					bodyhtml += "Answer: "+form.elements.fb.value;
					bodyhtml += "<br>Question: How can we improve your experience?<br>";
					bodyhtml += "Answer: "+form.elements.experience.value;
					
				var eclaims_token = getFromStore("eclaimsToken");
                var access_token = getFromStore("token");                 
                $.ajax({
                url: env.node_api_url+"api/communicate/sendEmails_new", 
                type: "POST",             
                data: {
            "email": "dbagve.extern@europ-assistance.in",
            "name": " ",
            "subject": "eclaims-feedback",
            "body": bodyhtml
          },
                headers:{
                    Authorization: "Bearer "+access_token
                }, 
                success: function(data) {
                   alert('Feedback posted successfully');
				           window.location = env.app_url+"index.html";
                },
                error :function(err){
                  console.log(err);
                  alert('Whoops! This didn\'t work. Please contact us.');
                }
            });
           
        }
      }) 
 }); 
