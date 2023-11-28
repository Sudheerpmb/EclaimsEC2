// PROCESS
var homePage = document.getElementById("homePage");
var authPage = document.getElementById("authPage");
var invalidUser = document.getElementById("invalidUser");
//var baseUrl = 'https://localhost:3000'
var ssoAPIUrl = 'https://api.entrustuat.in'
var ssoUrl = 'https://entrustuat.in'
var retrieveFlag = "App2"

var servicesLength = 0;

getData();
//addFields();
const user = {
    "clientId": localStorage.getItem('clientID'),
    "redirectUri": localStorage.getItem('redirectURL'),
    "userId": localStorage.getItem('userId'),
    "token": localStorage.getItem('oAuthtoken')
}
const encuser = {
    encryptedData: CryptoJS.AES.encrypt(
        JSON.stringify(user),
        '!hrv7PSJxkzTy#g!+=KzsbLcmU4fW4tgZEr_4WkR'
    ).toString()
};
fetch(`${ssoAPIUrl}/api/auth/oauth2/validateToken`, {
    method: 'POST',
    headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    body: JSON.stringify(encuser)
}).then((authData) => {
    return authData.json()
}).then((data) => {
    if(data.code == 200) {
        authPage.style.display = "none";
        homePage.style.display = "block";
    }
    else {
        invalidUser.style.display = "block";
        window.location.href = ssoUrl;
    }
})


function logout() {
    let tokenn = localStorage.getItem('token')
    localStorage.removeItem('clientID')
    localStorage.removeItem('redirectURL')
    localStorage.removeItem('userId')
    localStorage.removeItem('oAuthtoken')
    localStorage.removeItem('token')
    fetch(`${ssoAPIUrl}/api/auth/oauth2/DestroySession`, {
        method: 'POST',
        headers: {
          Authorization: tokenn,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
    }).then(() => {        
        window.location.href = ssoUrl;
    })
}


let userData = [ ] //List to store the details of users     
  
const roles = {
    USER: localStorage.getItem('role'),
    //USER: "ADMIN",
   
  };

let todo = 0 ; // variable to store the number of row in table


//new price quotation id
var newQuotation = document.getElementById('newPriceQuotation');
var modalQuotation = document.getElementById('newPriceModal');
var newPriceModal_Close = document.getElementById('newPriceModalClose');
var save_Quotation = document.getElementById('saveQuotation');

// table id
var table = document.getElementById("table");
const table_body = document.getElementById('tableBody'); 
var displayUser_Details = document.getElementById('displayUserDetails');
var table = document.getElementById("table");
const editPriceQuotation_Modal = document.getElementById("editPriceQuotationModal");

//price calculation id
const savePriceCalculationDetails = document.getElementById('priceRegistrationForm');
const priceCalculation_Modal= document.getElementById('priceCalculationModal');
const savePrice_Details = document.getElementById('savePriceDetails');
const price_Close = document.getElementById('priceClose');
const edit_pric_e = document.getElementById('edit_price');
const summary_Modal = document.getElementById("summaryModal");

// Edit price quotation
var editPrice_Quotation  = document.getElementById('editPriceQuotation');
var editPriceQuotaionDetails = document.getElementById('editQuotation');
var editPriceCalculation_Modal = document.getElementById('editPriceCalculationModal');
var priceDetails_Modal = document.getElementById('priceDetailsModal');

newPriceModal_Close.onclick = function (){
    newQuotation.reset();
    const label = document.getElementById('serviceLabel');
    label.style.display = "none";
    const field_Container = document.getElementById("fieldContainer");
    if (field_Container.hasChildNodes()){   
        while (field_Container.firstChild){
            field_Container.removeChild(field_Container.firstChild);
        }
     }

}

price_Close.onclick = function (){
    savePriceCalculationDetails.reset();
}

var validate = function(tis) {
    var prev = tis.getAttribute("data-prev");
    prev = (prev != '') ? prev : '';
    if (Math.round(tis.value*100)/100!=tis.value)
    tis.value=prev;
    tis.setAttribute("data-prev",tis.value)
  }

//Add select fields dynamically
function addFields(){

    const label = document.getElementById('serviceLabel');
    label.style.display = "none";
    const field_Container = document.getElementById("fieldContainer");
    if (field_Container.hasChildNodes()){   
        while (field_Container.firstChild){
            field_Container.removeChild(field_Container.firstChild);
        }
     }
    const name = "Services";
    fetch(`https://epriceuatapi.europassistance.in/conf/${name}`)
    .then(response => response.json()) 
    .then((fields) => { 
          //console.log(fields[0].service);
          servicesLength  = fields.length;
       
          var select_Container = document.getElementById('sevicesSelect'); 
          
          if (select_Container.hasChildNodes()){   
            while (select_Container.firstChild){
                select_Container.removeChild(select_Container.firstChild);
            }
         }

        for( var i = 0; i < fields.length ; i++){
            //console.log(fields[i].service);   
            if( fields[i].service === "Choose.."){
              var opt = document.createElement("option");
        opt.text = fields[i].service;
        opt.value = "";
        opt.id = fields[i].service + i;
        //opt.addEventListener("click",getTable(opt.value));
        select_Container.options.add(opt);
          }else{
          var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = fields[i].service;
          opt.id = fields[i].service + i;
          opt.name = "Services";
          //opt.addEventListener("click",getTable());
          select_Container.options.add(opt);     
          }    
    }
    })

    const name1 = "Product Type";
    fetch(`https://epriceuatapi.europassistance.in/conf/${name1}`)
    .then(response => response.json()) 
    .then((fields) => { 
          //console.log(fields[0].service);
          servicesLength  = fields.length;
       
          var select_Container = document.getElementById('inlineFormSelectPref');  

          if (select_Container.hasChildNodes()){   
            while (select_Container.firstChild){
                select_Container.removeChild(select_Container.firstChild);
            }
         }
        for( var i = 0; i < fields.length ; i++){
            //console.log(fields[i].service);   
            if( fields[i].service === "Choose.."){
                var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = "";
          opt.id = fields[i].service + i;
          //opt.addEventListener("click",getTable(opt.value));
          select_Container.options.add(opt);
            }
            else{
          var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = fields[i].service;
          opt.id = fields[i].service + i;
          //opt.addEventListener("click",getTable(opt.value));
          select_Container.options.add(opt);
            }          
    }
})
const name2 = "Vehicle Type";
fetch(`https://epriceuatapi.europassistance.in/conf/${name2}`)
.then(response => response.json()) 
.then((fields) => { 
      //console.log(fields[0].service);
      servicesLength  = fields.length;
   
      var select_Container = document.getElementById('vehicalType');  
      if (select_Container.hasChildNodes()){   
        while (select_Container.firstChild){
            select_Container.removeChild(select_Container.firstChild);
        }
     }
    for( var i = 0; i < fields.length ; i++){
        //console.log(fields[i].service); 
        if( fields[i].service === "Choose.."){
            var opt = document.createElement("option");
      opt.text = fields[i].service;
      opt.value = "";
      opt.id = fields[i].service + i;
      //opt.addEventListener("click",getTable(opt.value));
      select_Container.options.add(opt);
        }
        else{  
      var opt = document.createElement("option");
      opt.text = fields[i].service;
      opt.value = fields[i].service;
      opt.id = fields[i].service + i;
      //opt.addEventListener("click",getTable(opt.value));
      select_Container.options.add(opt);  
        }        
}
})
}

// add service field
let services_list = [];
function addField(){

    //document.getElementById("fieldContainer").innerHTML = "Hello World";
    const field_Container = document.getElementById("fieldContainer");
    const name = document.getElementById('sevicesSelect').value;

    if( name === "" || name === "Choose.."){
        alert(`Please select Service.`);
    }
     else{
    if (services_list.includes(name)){
         alert(`${name} service is already selected.`);
    }
    else{

        services_list.push(name);
        const label = document.getElementById('serviceLabel');
        label.style.display = "inline";

    var field1 = document.createElement('div');
    field1.classList.add('col-4','mb-1');
    
    var input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute("type","text");
    input.id = "field" + name;
    input.value = name;
    input.setAttribute('autocomplete','off');
    input.setAttribute("disabled", "");

    field1.appendChild(input);

    var field2 = document.createElement('div');
    field2.classList.add('col-4','mb-1');

    var input2 = document.createElement('input');
    input2.classList.add('form-control');
    input2.setAttribute("type","number");
    input2.id = "per_centage" + name;
    input2.setAttribute('autocomplete','off');
    
    field2.appendChild(input2);

    var field3 = document.createElement('div');
    field3.classList.add('col-4','mb-1','icon');
   let locationData = "";
   locationData=`
   
   <input type="number" class="form-control " id="avg_km${name}" required name="sales_Volume"  autocomplete="off" maxlength="30" onkeydown="numericOnly(event)">
                
   <button type="button"  class="btn" onclick="deleteService('${name}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill " viewBox="0 0 16 16" style="color: #144ca0;">
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
</svg>
</button>
    
   `
field3.innerHTML = locationData;
   field_Container.appendChild(field1);
   field_Container.appendChild(field2);
   field_Container.appendChild(field3);

   //document.getElementById('sevicesSelect').value = "";
   console.log(services_list);
    }
   }
}

function deleteService(name){
       
       const servi_name = document.getElementById(`field${name}`);
       servi_name.parentElement.remove();
       const per_name = document.getElementById(`per_centage${name}`);
       per_name.parentElement.remove();
       const avg_name = document.getElementById(`avg_km${name}`);
       avg_name.parentElement.remove();
       
       for (let i = 0; i < services_list.length; i++) {
        if (services_list[i] === `${name}`) {
            let spliced = services_list.splice(i, 1);
            console.log("Removed element: " + spliced);
            console.log("Remaining elements: " + services_list);
        }
    }
       //console.log(servi_name);
}


// new Quotation and display in table
save_Quotation.onclick = function (){

    if(newQuotation.checkValidity())
    {
        
        fetch('https://epriceuatapi.europassistance.in/collection')
        .then(response => response.json()) 
        .then((ObjectData) => { 
          todo =  ObjectData.length;            
        })
        
        console.log(todo); 
        todo = todo + 1;
    
        var customer_Name = document.getElementById('customerName').value;
        var sales_Volume = document.getElementById('salesVolume').value;
        var interventionn = document.getElementById('intervention').value;          
        var vehical_Type = document.getElementById('vehicalType').value;       
        var competitive_Price = document.getElementById('competitivePrice').value;
        var anyintegration_Cost = document.getElementById('anyintegrationCost').value;
        var product_type = document.getElementById('inlineFormSelectPref').value;
        var marketing_cost = document.getElementsByName('marketingCost');
        var telecom_cost = document.getElementsByName('telecomCost');
        var commentss = document.getElementById('comments').value;
       
        //console.log(sevices_Select);
        console.log(services_list);
        let servic_e = [];
        for(var j = 0; j < services_list.length  ; j++){
            let fieldId = "field" + services_list[j];
            var service_name = document.getElementById(fieldId).value;
            let perId = "per_centage" + services_list[j];
            var per_cant_age = document.getElementById(perId).value;
            let avgkmId = "avg_km" + services_list[j];
            var avg_k = document.getElementById(avgkmId).value;
            let s = {
                servicename: service_name,
                per_centage: parseInt(per_cant_age),
                avg_km: parseInt(avg_k)
            }

            servic_e.push(s);
            
        }
        console.log(servic_e);
              
        //get selected values from radio buttons
        var selectTelecom, selectMarketing;
        //var valid = false;
        for (var i = 0; i< marketing_cost.length; i++){
            if (marketing_cost[i].checked){
                selectMarketing = marketing_cost[i].value;
                valid = true;
                break;
            }
        }
             
        for (var j = 0; j< telecom_cost.length; j++){
            if (telecom_cost[j].checked){
                selectTelecom = telecom_cost[j].value;
                break;
            }
        }
        
        var customer_Name = customer_Name.trim();
        var sales_Volume = sales_Volume.trim();
        sales_Volume = parseFloat(sales_Volume);
        var interventionn = interventionn.trim();
        interventionn = parseFloat(interventionn); 
        //interventionn = interventionn.toFixed(2);             
        var vehical_Type = vehical_Type.trim();       
        var competitive_Price = competitive_Price.trim();
        competitive_Price = parseInt(competitive_Price);
        var anyintegration_Cost = anyintegration_Cost.trim();
        anyintegration_Cost = parseInt(anyintegration_Cost);
        var product_type = product_type.trim();
        var commentss = commentss.trim();
       
        
        //console.log(external_Cost);       
        let newOjectData = {
                slno: todo,
                customerName: customer_Name,
                salesVolume: sales_Volume,
                intervention: interventionn,
                services: servic_e,
                competitivePrice: competitive_Price,
                anyintegrationCost: anyintegration_Cost,
                vehicalType: vehical_Type,
                productType: product_type,
                marketingCost: selectMarketing,
                telecomCost: selectTelecom,
                comments: commentss,
                 curentServices: services_list,       
                child:{}       
        }
        console.log(newOjectData);
        userData.push(newOjectData);
        // API to send the object to database
        fetch('https://epriceuatapi.europassistance.in/post', {
        method: "POST",
        body: JSON.stringify(newOjectData),
         headers: {"Content-type": "application/json; charset=UTF-8"}
         })
        .then(response => response.json())
        .then((data) => 
        {
          console.log(data);
          saveLog(1, data._id);
        }) 
         
        getData();
        
        const alert = document.getElementById("showAlert");
         alert.style.display="block";
         setTimeout(function(){
            alert.style.display="none";
         }, 2000);

        var bootstraoModal = bootstrap.Modal.getInstance(modalQuotation);
        bootstraoModal.hide();
        //services_list = [];
        newQuotation.reset();       
    }
    else
    {
         newQuotation.reportValidity();
    }   
}

var link_Color = "";

//Display the table
function getData(){

   
    fetch('https://epriceuatapi.europassistance.in/collection')
    .then(response => response.json()) 
    .then((ObjectData) => { 
     todo =  ObjectData.length;
     console.log(ObjectData.length);

     let locationData = ""
     for(var i = 0; i < ObjectData.length ; i++){
    // ObjectData.map((values) => {
        //console.log(values._id);
       
       if (ObjectData[i].child === undefined){
        console.log("no child");
        link_Color = "#808080";
       }else{
        console.log("yes child");
        link_Color = "#144ca0";
       }
        
     if (['Admin'].includes(roles.USER)){

     const menu_Bar = document.getElementById('menuBar')
     menu_Bar.style.display = 'block';

     console.log('Admin');
     locationData += ` <tr>
     <td scope= "row" style="text-align: center;">${i + 1}</td>
     <td style="text-align: center;">
     <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#logs" style="color: #144ca0;" onclick="displayLogs('${ObjectData[i]._id}')">
     ${ObjectData[i].customerName}      
     </button>
     </td>
     <td style="text-align: center;">${ObjectData[i].productType}</td>
     <td style="text-align: center;">${ObjectData[i].salesVolume}</td>
     <td style="text-align: center;">
     <div class="dropdown" >
     <button class="btn dropdown-toggle  align-text-center" type="button" data-bs-toggle="dropdown"  aria-expanded="false" style="padding-top: 0; padding-left: 0;color: #144ca0;": >
     View 
     </button>
     <ul class="dropdown-menu">
     <li><a class="dropdown-item " style="color: #144ca0;" href="#" onclick="quotationMainDisplay('${ObjectData[i]._id}')">Quotation Details</a></li>
     
    <li><a class="dropdown-item "  style="color: ${link_Color};"  href="#"  onclick="displayPrice('${ObjectData[i]._id}')" id="viewPriceDetails">Price Details</a></li>  
     
     </ul>
     </div>       
     </td>
     <td style="text-align: center;">
     <div class="dropdown">
     <button class="btn dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding-top: 0;":>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
       <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
     </svg>
     </button>
     <ul class="dropdown-menu" id="listitem">    

     <li><a class="dropdown-item" href="#" onclick="claculatePrice('${ObjectData[i]._id}', ${ObjectData[i].salesVolume}, ${ObjectData[i].intervention} )" id="display_price">Price Calculation</a></li>

     <li><a class="dropdown-item" href="#" onclick="priceEdit('${ObjectData[i]._id}', ${ObjectData[i].salesVolume}, ${ObjectData[i].intervention})">Edit Price Calculation</a></li>
     <li><a class="dropdown-item" href="#" onclick="editMainQuotation('${ObjectData[i]._id}', ${i})">Edit Price Quotation</a></li>
     <li><a class="dropdown-item" href="#" onclick="deleteRecord('${ObjectData[i]._id}', ${i})">Delete Record</a></li>
     </ul>
     </div>       
     </td>     
   </tr>`
  document.getElementById("tableBody").innerHTML = locationData;

}
else
{  
  if (['Client'].includes(roles.USER)){
   console.log("client");
   console.log(link_Color);
   locationData += ` <tr>
   <td style="text-align: center;">${i + 1}</td>
   <td style="text-align: center;">
   <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#logs" style="color: #144ca0;" onclick="displayLogs('${ObjectData[i]._id}')">
   ${ObjectData[i].customerName}      
   </button>
   </td>
   <td style="text-align: center;">${ObjectData[i].productType}</td>
   <td style="text-align: center;">${ObjectData[i].salesVolume}</td>      
   <td style="text-align: center;">
   <div class="dropdown">
   <button class="btn dropdown-toggle  align-text-center" type="button" data-bs-toggle="dropdown"  aria-expanded="false" style="padding-top: 0; padding-left: 0;color: #144ca0;":>
   View
   </button>
   <ul class="dropdown-menu">
   <li><a class="dropdown-item "  style="color: #144ca0;" href="#" onclick="quotationMainDisplay('${ObjectData[i]._id}')">Quotation Details</a></li>
   <li><a class="dropdown-item "  style="color: ${link_Color};"  href="#"  onclick="displayPrice('${ObjectData[i]._id}')" id="viewPriceDetails">Price Details</a></li>
   </ul>
   </div>       
   </td>
   <td style="text-align: center;">
   <div class="dropdown">
   <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding-top: 0;">
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
   <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
   </svg>
   </button>
   <ul class="dropdown-menu" id="listitem">    
   <li><a class="dropdown-item" href="#" onclick="editMainQuotation ('${ObjectData[i]._id}', ${i})">Edit Price Quotation</a></li>
   </ul>
   </div>       
   </td>     
   </tr>`
  document.getElementById("tableBody").innerHTML = locationData;      
}
 else 
 {
  if (['Superadmin'].includes(roles.USER)){
    console.log('Superadmin');
    document.getElementById("newQuota").style.display = "none";
    locationData += ` <tr>
    <td style="text-align: center;">${i + 1}</td>
    <td style="text-align: center;">
    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#logs" style="color: #144ca0;" onclick="displayLogs('${ObjectData[i]._id}')">
    ${ObjectData[i].customerName}      
    </button>
    </td>
    <td style="text-align: center;">${ObjectData[i].productType}</td>
    <td style="text-align: center;">${ObjectData[i].salesVolume}</td>      
    <td style="text-align: center;">
    <div class="dropdown">
    <button class="btn dropdown-toggle  align-text-center" type="button" data-bs-toggle="dropdown"  aria-expanded="false" style="padding-top: 0; padding-left: 0;color: #144ca0;":>
    View 
    </button>
    <ul class="dropdown-menu">
    <li><a class="dropdown-item "  style="color: ${link_Color};"  href="#"  onclick="displayPrice('${ObjectData[i]._id}', ${ObjectData[i].salesVolume}, ${ObjectData[i].intervention})" id="viewPriceDetails">Price Details</a></li>
    </ul>
    </div>       
    </td>
    <td style="text-align: center;">
    <div class="dropdown">
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding-top: 0;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
    </button>
    <ul class="dropdown-menu" id="listitem">    
  
    </ul>
    </div>       
    </td>     
    </tr>`
   document.getElementById("tableBody").innerHTML = locationData;
  
  }
 }
}
}
});
}

// main function for quotation display
function quotationMainDisplay(userId){
    displayField(userId);
    quotationDisplay(userId) 
}

function displayField(userId){   
    const display_Container = document.getElementById('displayContainer');
    if (display_Container.hasChildNodes()){
          
        while (display_Container.firstChild){
            display_Container.removeChild(display_Container.firstChild);
        }

     }
     fetch(`https://epriceuatapi.europassistance.in/get/${userId}`)
         .then(response => response.json()) 
         .then(data => {
            console.log(data);

    for(var i = 0; i < data.services.length  ; i++){       
        var field1 = document.createElement('div');
             field1.classList.add('col-4','mb-1');

             var input = document.createElement('input');
             input.classList.add('form-control');
             input.setAttribute("type","text");
             input.id = "field" + i;
             input.value = data.services[i].servicename;
             input.setAttribute('autocomplete','off');
             input.setAttribute("disabled", "");
             input.style ="background-color: rgb(234, 247, 235);";
            
             field1.appendChild(input);

             var field2 = document.createElement('div');
             field2.classList.add('col-4','mb-1');

             var input2 = document.createElement('input');
             input2.classList.add('form-control');
             input2.setAttribute("type","number");
             input2.id = "per_centage" + i;
             input2.setAttribute('autocomplete','off');
             input2.value = data.services[i].per_centage;
             input2.setAttribute("disabled", "");
             input2.style ="background-color: rgb(234, 247, 235);";
           
             field2.appendChild(input2);

             var field3 = document.createElement('div');
             field3.classList.add('col-4','mb-1');

             var input3 = document.createElement('input');
             input3.classList.add('form-control');
             input3.setAttribute("type","number");
             input3.id = "avg_km" + i;
             input3.setAttribute('autocomplete','off');
             input3.value = data.services[i].avg_km;
             input3.setAttribute("disabled", "");
             input3.style ="background-color: rgb(234, 247, 235);";
            
             field3.appendChild(input3);

            display_Container.appendChild(field1);
            display_Container.appendChild(field2);
            display_Container.appendChild(field3);
    }
})
}

//Display Quotation Details
function quotationDisplay(userId){
    console.log("display Quotation");
    console.log(userId);

    var myModal = new bootstrap.Modal(displayUser_Details);
    myModal.show();

    fetch(`https://epriceuatapi.europassistance.in/get/${userId}`)
         .then(response => response.json()) 
         .then(data => {
            console.log(data);
          
    const currentUserName = document.getElementById('Name');
    currentUserName.value = data.customerName;
    const currentSalesVolume = document.getElementById('Volume');
    currentSalesVolume.value = data.salesVolume;
    const currentIntervention = document.getElementById('interventionCur');
    currentIntervention.value = data.intervention;   
    const vehical_Cur = document.getElementById('vehicalCur');
    vehical_Cur.value = data.vehicalType;
    const currentProductType = document.getElementById('inlineFormSelectPrefCur');
    currentProductType.value = data.productType;
    const currentCompettitive = document.getElementById('competitivePriceCur');
    currentCompettitive.value = data.competitivePrice;
    const currentAnyIntegration = document.getElementById('anyintegrationCostCur');
    currentAnyIntegration.value = data.anyintegrationCost;
    const currentMarketingCost = document.getElementById('marketingCostCur');
    currentMarketingCost.value = data.marketingCost;
    const currentTelecomCost = document.getElementById('telecomCostCur');
    currentTelecomCost.value = data.telecomCost;
    const currentComments = document.getElementById('commentsCur');
    currentComments.value = data.comments;
    const currentOtherServices = document.getElementById('otherServicesCur');
    currentOtherServices.value = data.otherServices;
} )
}
let edit_id ;
// main function to edit quotation
function editMainQuotation(editId , num){
    editFields(editId);
    edit_id = editId;
    editQuotation(editId , num);

    const name = "Services";
    fetch(`https://epriceuatapi.europassistance.in/conf/${name}`)
    .then(response => response.json()) 
    .then((fields) => { 
          //console.log(fields[0].service);
          servicesLength  = fields.length;
       
          var select_Container = document.getElementById('sevicesSelectEdit'); 
          
          if (select_Container.hasChildNodes()){   
            while (select_Container.firstChild){
                select_Container.removeChild(select_Container.firstChild);
            }
         }

        for( var i = 0; i < fields.length ; i++){
            //console.log(fields[i].service); 
            if( fields[i].service === "Choose.."){
              var opt = document.createElement("option");
        opt.text = fields[i].service;
        opt.value = "";
        opt.id = fields[i].service + i;
        //opt.addEventListener("click",getTable(opt.value));
        select_Container.options.add(opt);
          }else{  
          var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = fields[i].service;
          opt.id = fields[i].service + i;
          opt.name = "Services";
          //opt.addEventListener("click",getTable());
          select_Container.options.add(opt);  
          }   
             
    }
    })

    const name1 = "Product Type";
    fetch(`https://epriceuatapi.europassistance.in/conf/${name1}`)
    .then(response => response.json()) 
    .then((fields) => { 
          //console.log(fields[0].service);
          servicesLength  = fields.length;
       
          var select_Container = document.getElementById('editinlineFormSelectPref');  

          if (select_Container.hasChildNodes()){   
            while (select_Container.firstChild){
                select_Container.removeChild(select_Container.firstChild);
            }
         }
        for( var i = 0; i < fields.length ; i++){
            //console.log(fields[i].service);   
            if( fields[i].service === "Choose.."){
                var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = "";
          opt.id = fields[i].service + i;
          //opt.addEventListener("click",getTable(opt.value));
          select_Container.options.add(opt);
            }
            else{
          var opt = document.createElement("option");
          opt.text = fields[i].service;
          opt.value = fields[i].service;
          opt.id = fields[i].service + i;
          //opt.addEventListener("click",getTable(opt.value));
          select_Container.options.add(opt);
            }          
    }
})
const name2 = "Vehicle Type";
fetch(`https://epriceuatapi.europassistance.in/conf/${name2}`)
.then(response => response.json()) 
.then((fields) => { 
      //console.log(fields[0].service);
      servicesLength  = fields.length;
   
      var select_Container = document.getElementById('editvehicalType');  
      if (select_Container.hasChildNodes()){   
        while (select_Container.firstChild){
            select_Container.removeChild(select_Container.firstChild);
        }
     }
    for( var i = 0; i < fields.length ; i++){
        //console.log(fields[i].service); 
        if( fields[i].service === "Choose.."){
            var opt = document.createElement("option");
      opt.text = fields[i].service;
      opt.value = "";
      opt.id = fields[i].service + i;
      //opt.addEventListener("click",getTable(opt.value));
      select_Container.options.add(opt);
        }
        else{  
      var opt = document.createElement("option");
      opt.text = fields[i].service;
      opt.value = fields[i].service;
      opt.id = fields[i].service + i;
      //opt.addEventListener("click",getTable(opt.value));
      select_Container.options.add(opt);  
        }        
}
})
}
let l = 0;
//Add service fields dynamically
function editFields(editId){
        
        var field_Container = document.getElementById('editConfernce');

        if (field_Container.hasChildNodes()){
          
            while (field_Container.firstChild){
                field_Container.removeChild(field_Container.firstChild);
            }
    
         }
         console.log(servicesLength);
        
         const name = "Services";
         fetch(`https://epriceuatapi.europassistance.in/get/${editId}`)
         .then(response => response.json()) 
         .then(fields => {
            console.log(fields);
               //console.log(fields[1].service);
               servicesLength  = fields.services.length;
            
            for( var i = 0; i < servicesLength ; i++){
         
             var field1 = document.createElement('div');
             field1.classList.add('col-4','mb-1');

             var input = document.createElement('input');
             input.classList.add('form-control');
             input.setAttribute("type","text");
             input.id = "editfield" + fields.services[i].servicename;
             input.value = fields.services[i].servicename;
             input.setAttribute('autocomplete','off');
             input.setAttribute("disabled", "");

             field1.appendChild(input);

             var field2 = document.createElement('div');
             field2.classList.add('col-4','mb-1');
            
             var input2 = document.createElement('input');
             input2.classList.add('form-control');
             input2.setAttribute("type","number");
             input2.id = "editper_centage" + fields.services[i].servicename;
             input2.setAttribute('autocomplete','off');
             //input2.value = s[i].per_centage;         
             field2.appendChild(input2);

             var field3 = document.createElement('div');
             field3.classList.add('col-4','mb-1','icon');

             //var input3 = document.createElement('input');
             //input3.classList.add('form-control');
             //input3.setAttribute("type","number");
             //input3.id = "editavg_km" + fields.services[i].servicename;
             //input3.setAttribute('autocomplete','off');
             //input3.value = s[i].avg_km;
             //field3.appendChild(input3);
             let locationData = "";
             locationData=`
             
             <input type="number" class="form-control " id="editavg_km${fields.services[i].servicename}" required name="sales_Volume"  autocomplete="off" maxlength="30" onkeydown="numericOnly(event)">
                          
             <button type="button"  class="btn" onclick="deleteEditService('${fields.services[i].servicename}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill " viewBox="0 0 16 16" style="color: #144ca0;">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
          </svg>
          </button>
              
             `
           field3.innerHTML = locationData;

            field_Container.appendChild(field1);
            field_Container.appendChild(field2);
            field_Container.appendChild(field3);
        }
         })
}
let newCurrentList = [];
function deleteEditService(name){
    const servi_name = document.getElementById(`editfield${name}`);
    servi_name.parentElement.remove();
    const per_name = document.getElementById(`editper_centage${name}`);
    per_name.parentElement.remove();
    const avg_name = document.getElementById(`editavg_km${name}`);
    avg_name.parentElement.remove();

    fetch(`https://epriceuatapi.europassistance.in/get/${edit_id}`, {
        
    headers: {"Content-type": "application/json; charset=UTF-8"}
   })
    .then(response => response.json()) 
    .then(data => {
       console.log(data);

    
    for (let i = 0; i < data.curentServices.length; i++) {
     if (data.curentServices[i] === `${name}`) {
         let spliced = data.curentServices.splice(i, 1);
         console.log("Removed element: " + spliced);
         console.log("Remaining elements: " + data.curentServices);
     }   
 }
 let updatedObject = {
    curentServices:data.curentServices

 }
 newCurrentList = data.curentServices;
 // API to update the object to database
 fetch(`https://epriceuatapi.europassistance.in/put/${edit_id}`, {
    method: "PUT",
    body: JSON.stringify(updatedObject),
     headers: {"Content-type": "application/json; charset=UTF-8"}
     })
    .then(response => response.json())
})

}

function addEditField(){

    fetch(`https://epriceuatapi.europassistance.in/get/${edit_id}`, {
        
    headers: {"Content-type": "application/json; charset=UTF-8"}
   })
    .then(response => response.json()) 
    .then(data => {
       console.log(data);

     //document.getElementById("fieldContainer").innerHTML = "Hello World";
     const field_Container = document.getElementById("editConfernce");
     const name1 = document.getElementById('sevicesSelectEdit').value;
 
     if( name1 === "" || name1 === "Choose.."){
         alert(`Please select Service.`);
     }
      else{
     if (data.curentServices.includes(name1)){
          alert(`${name1} service is already selected.`);
     }
     else{
         //console.log(data.curentServices);
         data.curentServices.push(name1);
         //console.log(data.curentServices);
         newCurrentList = data.curentServices;
     var field1 = document.createElement('div');
     field1.classList.add('col-4','mb-1');
     
     var input = document.createElement('input');
     input.classList.add('form-control');
     input.setAttribute("type","text");
     input.id = "editfield" + name1;
     input.value = name1;
     input.setAttribute('autocomplete','off');
     input.setAttribute("disabled", "");
 
     field1.appendChild(input);
 
     var field2 = document.createElement('div');
     field2.classList.add('col-4','mb-1');
 
     var input2 = document.createElement('input');
     input2.classList.add('form-control');
     input2.setAttribute("type","number");
     input2.id = "editper_centage" + name1;
     input2.setAttribute('autocomplete','off');
     
     field2.appendChild(input2);
 
     var field3 = document.createElement('div');
     field3.classList.add('col-4','mb-1','icon');
 
     //var input3 = document.createElement('input');
     //input3.classList.add('form-control');
    // input3.setAttribute("type","number");
     //input3.id = "avg_km" + name;
     //input3.setAttribute('autocomplete','off');
 
    // field3.appendChild(input3);
    let locationData = ""; 
    locationData=`
    
    <input type="number" class="form-control " id="editavg_km${name1}" required name="sales_Volume"  autocomplete="off" maxlength="30" onkeydown="numericOnly(event)">
                 
    <button type="button"  class="btn" onclick="deleteService('${name1}')">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill " viewBox="0 0 16 16" style="color: #144ca0;">
   <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
 </svg>
 </button>
     
    `
  field3.innerHTML = locationData;
 
    field_Container.appendChild(field1);
    field_Container.appendChild(field2);
    field_Container.appendChild(field3);
 
    document.getElementById('sevicesSelect').value = "";
    //console.log(services_list);
     }
    }

    let updatedObject = {
        curentServices:newCurrentList

     }

     // API to update the object to database
     fetch(`https://epriceuatapi.europassistance.in/put/${edit_id}`, {
        method: "PUT",
        body: JSON.stringify(updatedObject),
         headers: {"Content-type": "application/json; charset=UTF-8"}
         })
        .then(response => response.json())     

})

}

function deleteService1(name){
    
}
// Edit Quotation details
function editQuotation(editId , num){
    console.log("edit Quotation");
    console.log(editId , num);

    
    
    var editQuotaModal = new bootstrap.Modal(editPriceQuotation_Modal);
    editQuotaModal.show();

    const editUserName = document.getElementById('editcustomerName');
    const editSalesVolume = document.getElementById('editsalesVolume');
    const editIntervention = document.getElementById('editintervention');
   
    
    const editCompettitive = document.getElementById('editcompetitivePrice');
    const editAnyIntegration = document.getElementById('editanyintegrationCost'); 
    const editProductType = document.getElementById('editinlineFormSelectPref');
    const editComment = document.getElementById("editcomments");
    const editOtherServices = document.getElementById("editotherServices");
    const editMarketCost = document.getElementById("editMarketingCost");
    const editTelecomCost = document.getElementById("editTelecomCost");
   // const edit_services = document.getElementById("editservices");
    const editvehical_Type = document.getElementById("editvehicalType");

    
   let compareData = {}  ; 
   let compareServices = {};  

    fetch(`https://epriceuatapi.europassistance.in/get/${editId}`, {
        
         headers: {"Content-type": "application/json; charset=UTF-8"}
        })
         .then(response => response.json()) 
         .then(data => {
            console.log(data);
            compareData = data;
            compareData = {
              customerName: data.customerName,
              salesVolume :  data.salesVolume,
              intervention : data.intervention,
              competitivePrice :  data.competitivePrice,
              anyintegrationCost : data.anyintegrationCost,
              productType : data.productType,
              vehicalType : data.vehicalType,
              comments : data.comments,
              otherServices : data.otherServices,
              marketingCost : data.marketingCost,
              telecomCost : data.telecomCost
            }
            compareServices = data.services;
          
    editUserName.value =  data.customerName;
    editSalesVolume.value =  data.salesVolume; 
    editIntervention.value =  data.intervention;
    editCompettitive.value = data.competitivePrice;   
    editAnyIntegration.value = data.anyintegrationCost;  
    editProductType.value = data.productType;  
    editComment.value = data.comments;   
    editOtherServices.value = data.otherServices;  
    editMarketCost.value = data.marketingCost;  
    editTelecomCost.value = data.telecomCost;   
      
    editvehical_Type.value = data.vehicalType;

    for(var j = 0; j < data.services.length ; j++){
        
        let per_Id = "editper_centage" + data.services[j].servicename;
        document.getElementById(per_Id).value = data.services[j].per_centage;
        let avgkm_Id = "editavg_km" + data.services[j].servicename;
        document.getElementById(avgkm_Id).value = data.services[j].avg_km;
    }
    newCurrentList = data.curentServices;
    console.log(newCurrentList);
         })
    
    const save_changes_Quotation = document.getElementById("saveChangesQuotation");
    save_changes_Quotation.onclick = function(){
     console.log("updated object");
     // updatind the list

     if(editPrice_Quotation.checkValidity())
    {

     let editservic_e = [];
     for(var j = 0; j < newCurrentList.length ; j++){

         let ser_Id =  "editfield" + newCurrentList[j];
         var service_name = document.getElementById(ser_Id).value;
         let per_Id = "editper_centage" + newCurrentList[j];
         var per_cant_age = document.getElementById(per_Id).value;
         let avgkm_Id = "editavg_km" + newCurrentList[j];
         var avg_k = document.getElementById(avgkm_Id).value;
         let edits = {
             servicename: service_name,
             per_centage: parseInt(per_cant_age),
             avg_km: parseInt(avg_k)
         }

         editservic_e.push(edits);
         
     }
     console.log(editservic_e);
           

     let updatedObject = {
        customerName: editUserName.value,
        salesVolume :  editSalesVolume.value,
        intervention : editIntervention.value,       
        services : editservic_e,       
        competitivePrice :  editCompettitive.value ,
        anyintegrationCost : editAnyIntegration.value,
        productType : editProductType.value,
        vehicalType : editvehical_Type.value,
        comments : editComment.value,
        otherServices : editOtherServices.value,
        marketingCost : editMarketCost.value,
        telecomCost : editTelecomCost.value
     }

     let updatedChange = {
      customerName: editUserName.value,
      salesVolume :  editSalesVolume.value,
      intervention : editIntervention.value, 
      competitivePrice :  editCompettitive.value ,
      anyintegrationCost : editAnyIntegration.value,
      productType : editProductType.value,
      vehicalType : editvehical_Type.value,
      comments : editComment.value,
      otherServices : editOtherServices.value,
      marketingCost : editMarketCost.value,
      telecomCost : editTelecomCost.value
     }

       // API to update the object to database
       fetch(`https://epriceuatapi.europassistance.in/put/${editId}`, {
        method: "PUT",
        body: JSON.stringify(updatedObject),
         headers: {"Content-type": "application/json; charset=UTF-8"}
         })
        .then(response => response.json())     


       // displaing the changes in the respective row of table
       var row = table.rows[num + 1];
       row.cells[1].textContent = editUserName.value;    
       row.cells[2].textContent = editProductType.value;
       row.cells[3].textContent = editSalesVolume.value;


       //alert('Price Quotation Details Edited successfully');
       const alert = document.getElementById("showAlert3");
       alert.style.display="block";
       setTimeout(function(){
          alert.style.display="none";
       }, 4000);
     

     var bootstrao_Modal = bootstrap.Modal.getInstance(editPriceQuotation_Modal);
     bootstrao_Modal.hide();

     //console.log(editUser);
    // console.log(ObjectData);
    let finaldef = []
    let diff = Object.keys( updatedChange).reduce((diff, key) => {
    if (compareData[key] ==  updatedChange[key]) { return diff }
    else {
        finaldef.push({ "fieldName": key, "from": compareData[key], "to":  updatedChange[key] })
    }
    }, {})
    console.log(finaldef);

    let finaldef1 = []
    let diff1 = Object.keys(editservic_e).reduce((diff1, key) => {
    if (compareServices[key] == editservic_e[key]) { return diff1 }
    else {
        finaldef1.push({ "fieldName": "Services", "from": compareServices[key], "to": editservic_e[key] })
    }
    }, {})

    let final = [...finaldef , ...finaldef1];
    console.log(final);
    
    saveLog(2 , editId , final);
    }
   else
    {
        editPrice_Quotation.reportValidity();
    }   
    
    } 
}

let cal_val = 0;
var sales_vol = 0;
var inter_ven = 0;
// Calculate price
function claculatePrice(priceId, salesVolume, intervention){
    console.log("claculate Price");
    console.log("number of cases");
    sales_vol = salesVolume;
    inter_ven = intervention;
    
    var CalculateModal = new bootstrap.Modal(priceCalculation_Modal);
    CalculateModal.show();
   
    console.log(priceId, salesVolume, intervention);
    
     
    savePrice_Details.onclick = function(){
    if(savePriceCalculationDetails.checkValidity())
        {
        var avgexternal_Cost = document.getElementById('externalCost').value;
        var avgOPS_cost =  document.getElementById('OPScost').value;
        var casesRatio = document.getElementById('telecomCost').value;
        var towingAvg_Cost = document.getElementById('towingAvgCost').value;
        var roAvg_Cost = document.getElementById('roAvgCost').value;  
        var margin = document.getElementById('pricepercentage').value;    
        var interven_per = document.getElementById('interven_per').value;
        var indirect_Cost = document.getElementById('indirectCost').value;
               
   
        var avgexternal_Cost = avgexternal_Cost.trim();
        avgexternal_Cost = parseInt(avgexternal_Cost);
        var avgOPS_cost = avgOPS_cost.trim();
        avgOPS_cost = parseInt(avgOPS_cost);
        var casesRatio = casesRatio.trim();
        casesRatio = parseInt(casesRatio);
        var towingAvg_Cost = towingAvg_Cost.trim();
        towingAvg_Cost = parseInt(towingAvg_Cost);
        var roAvg_Cost = roAvg_Cost.trim();
        roAvg_Cost = parseInt(roAvg_Cost);
        var margin = margin.trim();
        margin = parseInt(margin);                    
        var indirect_Cost = indirect_Cost.trim();
        indirect_Cost = parseInt(indirect_Cost);   
        var numberOfCases = (salesVolume * ( intervention *0.01)) + (salesVolume * ((intervention * 0.01) * (parseInt(interven_per) * 0.01))) ;
        numberOfCases = Math.round(numberOfCases);
        
        if((numberOfCases * casesRatio) >= 60000){
            var telecom_cost = 60000/salesVolume;
            telecom_cost = Math.round(telecom_cost);
        }
        else{
            var telecom_cost = ((numberOfCases * casesRatio) * 59 * 0.9)/salesVolume;
            telecom_cost = Math.round(telecom_cost);
        }
        var SMS_cost = (0.5 *salesVolume)/salesVolume;
        SMS_cost = Math.round(SMS_cost);
        var OPS_cost = (avgOPS_cost * (numberOfCases*casesRatio))/salesVolume;             
        OPS_cost = Math.round(OPS_cost); 
        var Technical_Premium = (avgexternal_Cost + OPS_cost + SMS_cost + telecom_cost) + ((indirect_Cost) * 0.01) * (avgexternal_Cost + OPS_cost + SMS_cost + telecom_cost) ;
        Technical_Premium = Math.round(Technical_Premium);
        var price = (Technical_Premium + (indirect_Cost)) / (1 - (margin * 0.01));
        price = Math.round(price);
        var newindirect_Cost = (price * (indirect_Cost * 0.01)); 
        newindirect_Cost = Math.round(newindirect_Cost);
        var DM_value = (price *( margin * 0.01)* salesVolume);
        DM_value = Math.round(DM_value);
        var NTO  = (price * salesVolume);
        NTO = Math.round(NTO);

        let newpriceObject = {
            avgexternalCost: avgexternal_Cost,
            avgopsCost: avgOPS_cost,
            casesRatio : casesRatio,  
            towingAvgCost: towingAvg_Cost,
            roAvgCost: roAvg_Cost,
            margin: margin,         
            interventionPercentage: interven_per,
            SMSCost: SMS_cost,
            OPSCost: OPS_cost,
            newindirect_Cost: newindirect_Cost,
            telecomCost:telecom_cost,
            technicalPremimum: Technical_Premium,
            price: price,
            indirectCost: indirect_Cost,
            DMValue: DM_value,
            NTO : NTO,
            numberOfCases: numberOfCases
        }
        console.log(newpriceObject);
        fetch(`https://epriceuatapi.europassistance.in/child/${priceId}`, {
            method: "PUT",
            body: JSON.stringify(newpriceObject),
             headers: {"Content-type": "application/json; charset=UTF-8"}
             })
         .then(response => response.json()) 
         .then(data => {
            console.log(data);
         })
       
        //})
        let record = {   
          margin: margin,         
          interventionPercentage: interven_per,
          SMSCost: SMS_cost,
          OPSCost: OPS_cost,
          telecomCost: telecom_cost,
          technicalPremimum: Technical_Premium,
          price: price,
          newindirect_Cost: newindirect_Cost,
          DMValue: DM_value,
          NTO : NTO,
          numberOfCases: numberOfCases,
          priceQuotationId: priceId
    }

        fetch('https://epriceuatapi.europassistance.in/storeRecord', {
           method: "POST",
           body: JSON.stringify(record),
           headers: {"Content-type": "application/json; charset=UTF-8"}
           })
          .then(response => response.json()) 


        const alert = document.getElementById("showAlert");
         alert.style.display="block";
         setTimeout(function(){
            alert.style.display="none";
          }, 4000);       
        
        var bootstrapModal = bootstrap.Modal.getInstance(priceCalculation_Modal);
        bootstrapModal.hide();
        
       
        
        savePriceCalculationDetails.reset();
        var summaryMod_al = new bootstrap.Modal(summary_Modal);
        summaryMod_al.show();

        let locationData = ""

        locationData += ` <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">Number Of Cases</td>
       <td style="text-align: left;" class="text-black-50">${numberOfCases}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">Telecom Cost</td>
       <td style="text-align: left;" class="text-black-50">${telecom_cost}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">SMS Cost</td>
       <td style="text-align: left;" class="text-black-50">${SMS_cost}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">OPS Cost</td>
       <td style="text-align: left;" class="text-black-50">${OPS_cost}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">Technical Premium</td>
       <td style="text-align: left;" class="text-black-50">${Technical_Premium}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">Indirect Cost</td>
       <td style="text-align: left;" class="text-black-50">${newindirect_Cost}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">Price</td>
       <td style="text-align: left;" class="text-black-50">${price}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">DM Value</td>
       <td style="text-align: left;" class="text-black-50">${DM_value}</td>
       </tr>
       <tr>
       <td scope= "row" style="text-align: left;" class="text-black-50">NTO</td>
       <td style="text-align: left;">${NTO}</td>
       </tr>`
       document.getElementById("summaryBody").innerHTML = locationData;

       saveLog(3, priceId);
        } 
        else
        {
           savePriceCalculationDetails.reportValidity();
        }

        getData();
        

        
}


}

// edit price calculation
function priceEdit(editPriceId , salesVolume, intervention) {
    console.log("Edit price");

    sales_vol = salesVolume;
    inter_ven = intervention;

    //console.log(ObjectData[editPriceId].child);
    fetch(`https://epriceuatapi.europassistance.in/${editPriceId}`, {
        
    headers: {"Content-type": "application/json; charset=UTF-8"}
   })
    .then(response => response.json()) 
    .then(data => {
       console.log(data.child);
   
    

    if ( data.child  === undefined) 
           
           {
            //alert('Please provide price calculation details in Price Calaculation Form');
            const alert = document.getElementById("showAlert2");
            alert.style.display="block";
            setTimeout(function(){
               alert.style.display="none";
             }, 4000);
           }
                    
           else
           
           {
              var editPriceModal = new bootstrap.Modal(editPriceCalculation_Modal);
              editPriceModal.show();

            const externalCost_Edit = document.getElementById('externalCostEdit');
            externalCost_Edit.value = data.child.avgexternalCost;
            const OPScost_Edit = document.getElementById('OPScostEdit');
            OPScost_Edit.value = data.child.avgopsCost;
            const cases_Ratio = document.getElementById('telecomCostEdit');
            cases_Ratio.value =  data.child.casesRatio;
            const indirectCost_Edit = document.getElementById('indirectCostEdit');
            indirectCost_Edit.value = data.child.indirectCost;
            const towingAvgCost_Edit = document.getElementById('towingAvgCostEdit');
            towingAvgCost_Edit.value = data.child.towingAvgCost;
            const roAvgCost_Edit = document.getElementById('roAvgCostEdit');
            roAvgCost_Edit.value = data.child.roAvgCost;
            const margin_Edit = document.getElementById('percentageEdit');
            margin_Edit.value = data.child.margin;
            const inter_Edit = document.getElementById('interEdit');
            inter_Edit.value = data.child.interventionPercentage;
            
            console.log(externalCost_Edit.value);
           // saving the changes made
           const saveEdit_Price = document.getElementById('saveEditPrice');
           saveEdit_Price.onclick = function () {
           //var numberOfCases = (salesVolume + (((data.child.interventionPercentage * 0.01)  * (intervention *0.01)) +(intervention *0.01)) ; 
           var numberOfCases = (salesVolume * ( intervention *0.01)) + (salesVolume * ((intervention * 0.01) * (parseInt(inter_Edit.value) * 0.01))) ;
            numberOfCases = Math.round(numberOfCases);
           if(edit_pric_e.checkValidity())
           {
           
            if((numberOfCases * parseInt(cases_Ratio.value))  <= 60000){
                var telecom_cost = 60000/salesVolume;
                telecom_cost = Math.round(telecom_cost);
            }
            else{
                var telecom_cost = ((numberOfCases * parseInt(cases_Ratio.value)) * 59 * 0.9)/salesVolume;
                telecom_cost = Math.round(telecom_cost);
            }
            var SMS_cost = (0.5 *salesVolume)/salesVolume;
            SMS_cost = Math.round(SMS_cost);
            var OPS_cost = (parseInt(OPScost_Edit.value) * (numberOfCases * parseInt(cases_Ratio.value)))/salesVolume; 
            OPS_cost = Math.round(OPS_cost);                 
            var Technical_Premium = (parseInt(externalCost_Edit.value) + OPS_cost + SMS_cost + telecom_cost) + ((parseInt(indirectCost_Edit.value) * 0.01) * (parseInt(externalCost_Edit.value) + OPS_cost + SMS_cost + telecom_cost))  ;
            Technical_Premium = Math.round(Technical_Premium);
            //var Technical_Premium = Technical_Premium1 + (Technical_Premium1 * ( parseInt(margin_Edit.value)* 0.01)) ;  
            //console.log(Technical_Premium);
            var price = (Technical_Premium + (parseInt(indirectCost_Edit.value))) / (1 - (parseInt(margin_Edit.value) * 0.01));
            price = Math.round(price);
            var newindirect_Cost = (price * (parseInt(indirectCost_Edit.value) * 0.01)); 
            newindirect_Cost = Math.round(newindirect_Cost);
            var DM_value = (price *(parseInt(margin_Edit.value) * 0.01)* salesVolume);
            DM_value = Math.round(DM_value);
            var NTO  = (price * salesVolume);  
            NTO = Math.round(NTO);
    

             let updatedPrice = {
            avgexternalCost:  externalCost_Edit.value,
            avgopsCost: OPScost_Edit.value,
            casesRatio : cases_Ratio.value,  
            towingAvgCost: towingAvgCost_Edit.value,
            roAvgCost: roAvgCost_Edit.value,
            margin: margin_Edit.value,         
            interventionPercentage: inter_Edit.value,
            SMSCost: SMS_cost,
            OPSCost: OPS_cost,
            telecomCost: telecom_cost,
            technicalPremimum: Technical_Premium,
            price: price,
            indirectCost: indirectCost_Edit.value,
            newindirect_Cost: newindirect_Cost,
            DMValue: DM_value,
            NTO : NTO,
            numberOfCases: numberOfCases
             }
             console.log(updatedPrice);

             fetch(`https://epriceuatapi.europassistance.in/child/${editPriceId}`, {
            method: "PUT",
            body: JSON.stringify(updatedPrice),
            headers: {"Content-type": "application/json; charset=UTF-8"}
             })
            .then(response => response.json())  
              
                  // console.log(ObjectData);

                   //alert('Price Calculation Details are Edited Sucessfully');
                   const alert = document.getElementById("showAlert3");
                   alert.style.display="block";
                   setTimeout(function(){
                      alert.style.display="none";
                   }, 4000);
                   var bootstrap_Modal = bootstrap.Modal.getInstance(editPriceCalculation_Modal);
                   bootstrap_Modal.hide();
            
            const summaryEdit_Modal = document.getElementById('summaryEditModal');
            var summary_EditModal = new bootstrap.Modal(summaryEdit_Modal);
              summary_EditModal.show();

              let locationData = ""

              locationData += `
              <table class="table table-striped" id="marginAndInterventionTable" >        
              <tbody> 
                <tr>
                  <td class="text-black" style="text-align: center;padding-bottom: none;">Margin
                  <input type="number" style="width: 90px; height: 30px; margin-left: 5px;border: none;border-radius: 5px" id="newMargin"></td>           
                  <td class="text-black main-header" style="text-align: center">
                  <div>
                  % of Intervention
                    <input type="number" style="width: 90px; height: 30px;margin-left: 5px;border: none;border-radius: 5px" id="newPercentageIntervention">
                    </div>
                    <button type="button" style="width: 40px;height: 40px;border: none;border-radius: 10px;background-color: rgb(243, 237, 237);color: blueviolet;font-weight: 600;" onclick="showtable('${editPriceId}', ${salesVolume}, ${intervention})" id="calButton"> 
     
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calculator" viewBox="0 0 12 16">
  <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
  <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>
</svg>
                    </button>
                    </td>
                </tr>                   
              </tbody>          
            </table>
            
              <table class="table table-striped" id="autoCalTable" style="width: 100%;">
              <thead>
            <tr id="0">
              <th scope="col"  class="text-black" style="text-align: left;">Fields Name</th>
              <th scope="col"  class="text-black" style="text-align: left;padding-left: 90px;">Calculation</th>
            </tr>
          </thead>
          <tbody>
             <tr id="1">
             <td scope= "row" style="text-align: left;">Margin</td>
             <td>
             <span style="color: red;text-align: left;padding-left: 80px;">${margin_Edit.value}</span>
             </td>
             <tr>
             <tr id="2">
             <td scope= "row" style="text-align: left;">% of Intervention</td>
             <td> 
             <span style="color: #144ca0;padding-left: 80px;">${inter_Edit.value}</span>
             </td>
             </tr>   
             <tr id="3">
             <td scope= "row" style="text-align: left;">Number Of Cases</td>
             <td style="text-align: left;padding-left: 90px;">${numberOfCases}</td>
             </tr>
             <tr id="4">
             <td scope= "row" style="text-align: left;">Telecom Cost</td>
             <td style="text-align: left;padding-left: 90px;">${telecom_cost}</td>
             </tr>
             <tr id="5">
             <td scope= "row" style="text-align: left;">SMS Cost</td>
             <td style="text-align: left;padding-left: 90px;">${SMS_cost}</td>
             </tr>
             <tr id="6">
             <td scope= "row" style="text-align: left;">OPS Cost</td>
             <td style="text-align: left;padding-left: 90px;">${OPS_cost}</td>
             </tr>
             <tr id="7">
             <td scope= "row" style="text-align: left;">Technical Premium</td>
             <td style="text-align: left;padding-left: 90px;">${Technical_Premium}</td>
             </tr>
             <tr id="8">
             <td scope= "row" style="text-align: left;">Indirect Cost</td>
             <td style="text-align: left;padding-left: 90px;">${newindirect_Cost}</td>
             </tr>
             <tr id="9">
             <td scope= "row" style="text-align: left;">Price</td>
             <td style="text-align: left;padding-left: 90px;">${price}</td>
             </tr>
             <tr id="10">
             <td scope= "row" style="text-align: left;">DM Value</td>
             <td style="text-align: left;padding-left: 90px;">${DM_value}</td>
             </tr>       
             <tr id="11">
             <td scope= "row" style="text-align: left;">NTO</td>
             <td style="text-align: left;padding-left: 90px;">${NTO}</td>
             </tr>
             </tbody>
             </table>
             `
             document.getElementById("summaryEditBody").innerHTML = locationData;

             let finaldef = []

             let diff = Object.keys(updatedPrice).reduce((diff, key) => {

              if (data.child[key] == updatedPrice[key]) { return diff }

            else {

             finaldef.push({ "fieldName": key, "from": data.child[key], "to": updatedPrice[key] })

               }

            }, {})

            console.log(finaldef)
            saveLog(4, editPriceId , finaldef);
           }
           else{
            edit_pric_e.reportValidity();
        }       
        }
        }

}) 
}

//show extra table to for margin and % of intervention calculation
function showtable (dataId, salesVolume, intervention){
    //const marginAndIntervention_Table = document.getElementById("marginAndInterventionTable");
   // marginAndIntervention_Table.style.display = "block";
   console.log(dataId);
   console.log(salesVolume);
   console.log(intervention);

   

   const increase_size = document.getElementById("increasesize");
   increase_size.classList.add("modal-lg");   
  
   let new_Margin = document.getElementById("newMargin").value;
   let newPercentage_Intervention = document.getElementById("newPercentageIntervention").value;
  
   fetch(`https://epriceuatapi.europassistance.in/get/${dataId}`, {
        
    headers: {"Content-type": "application/json; charset=UTF-8"}
   })
    .then(response => response.json()) 
    .then(data => {
       console.log(data.child);

       if (new_Margin === ""){
        new_Margin = data.child.margin;
        new_Margin = parseInt(new_Margin);
       }

     if ( newPercentage_Intervention === ""){
       newPercentage_Intervention = data.child.interventionPercentage;
       newPercentage_Intervention = parseInt(newPercentage_Intervention);
       }

    console.log(new_Margin);
    console.log(newPercentage_Intervention);

   var numberOfCases = (salesVolume * ( intervention *0.01)) + (salesVolume * ((intervention * 0.01) * (parseInt(newPercentage_Intervention) * 0.01))) ;
   numberOfCases = Math.round(numberOfCases);

   if((numberOfCases * parseInt(data.child.casesRatio))  <= 60000){
    var telecom_cost = 60000/salesVolume;
    telecom_cost = Math.round(telecom_cost);
   }
   else
   {
    var telecom_cost = ((numberOfCases * parseInt(data.child.casesRatio)) * 59 * 0.9)/salesVolume;
    telecom_cost = Math.round(telecom_cost);
   }

   var SMS_cost = (0.5 *salesVolume)/salesVolume;
   SMS_cost = Math.round(SMS_cost);
   var OPS_cost = (data.child.avgopsCost * (numberOfCases * data.child.casesRatio))/salesVolume; 
   OPS_cost = Math.round(OPS_cost); 

   var Technical_Premium = (parseInt(data.child.avgexternalCost) + OPS_cost + SMS_cost + telecom_cost) + ((parseInt(data.child.indirectCost) * 0.01) * (parseInt(data.child.avgexternalCost) + OPS_cost + SMS_cost + telecom_cost))  ;
    Technical_Premium = Math.round(Technical_Premium);
    //var Technical_Premium = Technical_Premium1 + (Technical_Premium1 * ( parseInt(margin_Edit.value)* 0.01)) ;  
    //console.log(Technical_Premium);
    var price = (Technical_Premium + (parseInt(data.child.indirectCost))) / (1 - (parseInt(new_Margin) * 0.01));
    price = Math.round(price);
     var newindirect_Cost = (price * (parseInt(data.child.indirectCost) * 0.01)); 
    newindirect_Cost = Math.round(newindirect_Cost);
    var DM_value = (price *(parseInt(new_Margin) * 0.01)* salesVolume);
    DM_value = Math.round(DM_value);
    var NTO  = (price * salesVolume);  
    NTO = Math.round(NTO);
    console.log(NTO);

    
    let record = {   
      margin: parseInt(new_Margin),         
      interventionPercentage: parseInt(newPercentage_Intervention),
      SMSCost: SMS_cost,
      OPSCost: OPS_cost,
      telecomCost: telecom_cost,
      technicalPremimum: Technical_Premium,
      price: price,
      newindirect_Cost: newindirect_Cost,
      DMValue: DM_value,
      NTO : NTO,
      numberOfCases: numberOfCases,
      priceQuotationId: dataId
}
  console.log(record);

  fetch('https://epriceuatapi.europassistance.in/storeRecord', {
  method: "POST",
  body: JSON.stringify(record),
   headers: {"Content-type": "application/json; charset=UTF-8"}
   })
  .then(response => response.json()) 

  recordDisply(dataId);   
   

})
       
    document.getElementById("newPercentageIntervention").value = "";
    document.getElementById("newMargin").value ="";

}

function recordDisply(dataId){
 
  var x = document.getElementById("autoCalTable").rows[0].cells.length;
  console.log(x);
  let a = 2;

  while (x > 2){
  
  for (var j = 0; j < 12 ; j ++)
  {
   var row = document.getElementById(j.toString());
   row.deleteCell(x -1);
   console.log("deleted cell",x);
    }
   x = x - 1;
  }
 
 
  fetch(`https://epriceuatapi.europassistance.in/getrecord/${dataId}`, {
        
  headers: {"Content-type": "application/json; charset=UTF-8"}
 })
  .then(response => response.json()) 
  .then(data => {
     console.log(data);

      for(var i = 0; i < data.length; i++){
      
      var row = document.getElementById("0"); 
      var col = document.createElement("th");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      let locationData = ""
        locationData += `
        <div class="main-header" style="text-align: center;">
        <span style="padding-top: 20px">Calculation</span>
        <button type="button"  class="btn" onclick="deleteTable('${data[i]._id}', ${i},'${dataId}')" style="height: 35px;width: 20px;padding: 0px;margin-top: 10px">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill " viewBox="0 0 16 16" style="color: #144ca0;">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
            </svg>
        </button>
        </div>
        `   
      col.innerHTML= locationData;
      row.appendChild(col);
  
      var row = document.getElementById("1"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      var spa = document.createElement("span");
      spa.style.color ="red";
      spa.innerHTML= data[i].margin;
      col.appendChild(spa);
      row.appendChild(col);
  
      var row = document.getElementById("2"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      var spa1 = document.createElement("span");
      spa1.style.color ="#144ca0";
      spa1.innerHTML= data[i].interventionPercentage;
      col.appendChild(spa1);
      row.appendChild(col);
      
      var row = document.getElementById("3"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].numberOfCases;
      row.appendChild(col);
  
      var row = document.getElementById("4"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].telecomCost;
      row.appendChild(col);
  
      var row = document.getElementById("5"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].SMSCost;
      row.appendChild(col);
  
      var row = document.getElementById("6"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].OPSCost;
      row.appendChild(col);
  
      var row = document.getElementById("7"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].technicalPremimum;
      row.appendChild(col);
  
      var row = document.getElementById("8"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].newindirect_Cost;
      row.appendChild(col);
  
      var row = document.getElementById("9"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].price;
      row.appendChild(col);
  
      var row = document.getElementById("10"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].DMValue;
      row.appendChild(col);
  
      var row = document.getElementById("11"); 
      var col = document.createElement("td");
      col.style.borderBlockStyle = "dotted";
      col.style.borderWidth = "3px";
      col.innerText= data[i].NTO;
      row.appendChild(col);
        

     }
  })
     
}


function deleteTable(recordId, col , parentId) {

  console.log(recordId);
  fetch(`https://epriceuatapi.europassistance.in/deleterecord/${recordId}`, {
    method: "DELETE",    
     headers: {"Content-type": "application/json; charset=UTF-8"}})
   .then(response => response.json()) 
   .then(data => {
      console.log("deleted record",data);
   })

   for (var j = 0; j < 12 ; j ++){
    var row = document.getElementById(j.toString());
    row.deleteCell(col + 2);
   }

   recordDisply(parentId);
   
   alert('Confirm,to delete record permenetly ');
  
}


//display price calculation
function displayPrice(displayPriceId , salesVolume , intervention){   
       console.log("display price");

       fetch(`https://epriceuatapi.europassistance.in/get/${displayPriceId}`, {
        
       headers: {"Content-type": "application/json; charset=UTF-8"}
      })
       .then(response => response.json()) 
       .then(data => {
          console.log(data);
        
       if ( (data.child) === undefined) 
           
           {
           //alert('Price details are not generated');
           const alert = document.getElementById("showAlert2");
            alert.style.display="block";
            setTimeout(function(){
               alert.style.display="none";
             }, 4000);
             }
                    
           else{
               
            var displayPriceModal = new bootstrap.Modal(priceDetails_Modal );
            displayPriceModal.show();

           

             //var externalCost_View = document.getElementById('externalCostView');
           //externalCost_View.value = data.child.avgexternalCost;
           //var OPScost_View = document.getElementById('OPScostView');
           //OPScost_View.value = data.child.avgopsCost;
           //var telecomCost_View = document.getElementById('telecomCostView');
           //telecomCost_View.value = data.child.casesRatio;
          // var indirectCost_View = document.getElementById('indirectCostView');
          // indirectCost_View.value =  data.child.indirectCost;
          // var towingAvgCost_View = document.getElementById('towingAvgCostView');
          // towingAvgCost_View.value = data.child.towingAvgCost;
          // var roAvgCost_View = document.getElementById('roAvgCostView');
          // roAvgCost_View.value = data.child.roAvgCost;          
          // var directMargin_View = document.getElementById('directMarginView');
         //  directMargin_View.value =  data.child.indirectMargin;
          // var percentage_View = document.getElementById('percentageView');
          // percentage_View.value = data.child.margin;          
          // var perintervention_View = document.getElementById('perinterventionView');
         //  perintervention_View.value = data.child.interventionPercentage;

         if (['Superadmin'].includes(roles.USER)){
         
          document.getElementById("superAdminView").removeAttribute("style");
          document.getElementById("clientAdminView").style.display = "none";
          document.getElementById("priceDisplay").classList.remove("modal-lg");

          var x = document.getElementById("superAdminView").rows[0].cells.length;
           console.log(x);
           let a = 1;

            while (x > 1){
  
            for (var j = 10; j < 17; j ++)
            {
            var row = document.getElementById(j.toString());
            row.deleteCell(x -1);
            console.log("deleted cell",x);
            }
             x = x - 1;
            }
 

         
          fetch(`https://epriceuatapi.europassistance.in/getrecord/${displayPriceId}`, {
        
          headers: {"Content-type": "application/json; charset=UTF-8"}
         })
          .then(response => response.json()) 
          .then(result => {
             console.log(result);
             for(let i = 0; i< result.length ; i ++){ 
              console.log(result[i]);
             var row = document.getElementById("10"); 
             var col = document.createElement("th");
             col.style.borderLeftWidth = "3px";
             let locationData = ""
             locationData += `
             <div class="main-header" style="text-align: center;">
             <span style="padding-top: 20px">Calculation</span>
             </div>
             `   
             col.innerHTML= locationData;
             row.appendChild(col);
           
             var row = document.getElementById("11"); 
             var col = document.createElement("td");
             
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("span");             
             spa.innerHTML= salesVolume;
             col.appendChild(spa);
             row.appendChild(col);

             var row = document.getElementById("12"); 
             var col = document.createElement("td");
           
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("span");           
             spa.innerHTML= intervention;
             col.appendChild(spa);
             row.appendChild(col);

             var row = document.getElementById("13"); 
             var col = document.createElement("td");
            
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("span");     
             spa.innerHTML= result[i].interventionPercentage;
             col.appendChild(spa);
             row.appendChild(col);

             var row = document.getElementById("14"); 
             var col = document.createElement("td");
           
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("span");
             spa.innerHTML= result[i].NTO;
             col.appendChild(spa);
             row.appendChild(col);

             var row = document.getElementById("15"); 
             var col = document.createElement("td");           
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("span");
             spa.innerHTML= result[i].DMValue;
             col.appendChild(spa);
             row.appendChild(col);

             var row = document.getElementById("16"); 
             var col = document.createElement("td");           
             col.style.borderLeftWidth = "3px";
             var spa = document.createElement("textarea");
             //spa.innerHTML= result[i].DMValue;
             spa.style.width = "120px";
             spa.style.height = "40px";
             col.appendChild(spa);
             row.appendChild(col);

           }
            })    
         }
         else{

           let locationData = ""

              locationData += `
              <tr>
             <td scope= "row" style="text-align: left;">Avg External Cost</td>
             <td style="text-align: left;">${data.child.avgexternalCost}</td>
             <td scope= "row" style="text-align: left;border-left-width: 3px;">Number Of Cases</td>
             <td style="text-align: left;">${data.child.numberOfCases}</td>
             </tr>           
             <tr>
             <td scope= "row" style="text-align: left;">Telecom Cost</td>
             <td style="text-align: left;">${data.child.telecomCost}</td>
             <td scope= "row" style="text-align: left;border-left-width: 3px;">SMS Cost</td>
             <td style="text-align: left;">${data.child.SMSCost}</td>
             </tr>
             <tr>
              <td scope= "row" style="text-align: left;">OPS Cost</td>
              <td style="text-align: left;">${data.child.OPSCost}</td>
              <td scope= "row" style="text-align: left;border-left-width: 3px;">% of Intervention</td>
              <td style="text-align: left;">${data.child.interventionPercentage}</td>
              </tr> 
              <tr>
              <td scope= "row" style="text-align: left;">Margin</td>
              <td style="text-align: left;">${data.child.margin}</td>
              <td scope= "row" style="text-align: left;border-left-width: 3px;">Ro Avg Cost</td>
              <td style="text-align: left;">${data.child.roAvgCost}</td>
              </tr>
              <tr>
              <td scope= "row" style="text-align: left;">Towing Avg Cost</td>
              <td style="text-align: left;">${data.child.towingAvgCost}</td>
              <td scope= "row" style="text-align: left;border-left-width: 3px;">Indirect Cost</td>
              <td style="text-align: left;">${data.child.indirectCost}</td>
              </tr>
              <tr>
              <td scope= "row" style="text-align: left;">Cases Ratio</td>
              <td style="text-align: left;">${data.child.casesRatio}</td>
              <td scope= "row" style="text-align: left;border-left-width: 3px;">Avg OPS Cost</td>
              <td style="text-align: left;">${data.child.avgopsCost}</td>
              </tr>
              
             <tr>
             <td scope= "row" style="text-align: left;">Technical Premium</td>
             <td style="text-align: left;">${data.child.technicalPremimum}</td>
             <td scope= "row" style="text-align: left;border-left-width: 3px;">New Indirect Cost</td>
             <td style="text-align: left;">${data.child.newindirect_Cost}</td>
             </tr>
             <tr>
             <td scope= "row" style="text-align: left;">Price</td>
             <td style="text-align: left;">${data.child.price}</td>
             <td scope= "row" style="text-align: left;border-left-width: 3px;">DM Value</td>
             <td style="text-align: left;">${data.child.DMValue}</td>
             </tr>
             <tr>
             <td scope= "row" style="text-align: left;">NTO</td>
             <td style="text-align: left;">${data.child.NTO}</td>
             <td style="text-align: left; border-left-width: 3px;" scope= "row"></td>
             <td></td>
             </tr>`
             document.getElementById("dispalyBody").innerHTML = locationData;
           }
          }
        })
}

//delete record price quotation
function deleteRecord(deleteId , r){

    fetch(`https://epriceuatapi.europassistance.in/delete/${deleteId}`, {
        method: "DELETE",    
         headers: {"Content-type": "application/json; charset=UTF-8"}})
       .then(response => response.json()) 
       .then(data => {
          console.log("deleted record",data);
       })
       console.log(r + 1);
       //var i = (r + 1).parentNode.rowIndex;
       document.getElementById("table").deleteRow(r + 1);

       alert('Confirm,to delete record permenetly ');
       getData();
       saveLog(5, deleteId);
}


var invalidChars = [
    "-",
    "+",
    "e",
  ];

function numericOnly(event){
   if (invalidChars.includes(event.key)) {
    event.preventDefault();
  }
  }

 // function calculate(tvalue){
   // var s = document.getElementById('interven_per').value;
 //  var a = ((inter_ven/100) * tvalue ) + ((inter_ven)/100);
   //var cassess = a * sales_vol;
   // document.getElementById('numberOfCases').value = Math.round(cassess);
    
    //console.log(tvalue);
    //console.log(sales_vol);
   // console.log(inter_ven);
//  }
  function calculate1(tvalue){
    // var s = document.getElementById('interven_per').value;
    var a = ((inter_ven/100) * tvalue ) + ((inter_ven)/100);
    var cassess = a * sales_vol;
     document.getElementById('numberOfCasesEdit').value = Math.round(cassess);
     
     //console.log(tvalue);
     //console.log(sales_vol);
    // console.log(inter_ven);
   }


function sideBar(){
    const sidebar =  document.getElementById("side_Bar");
    if(sidebar.style.display === "none"){
    sidebar.style.display = "block";
    document.getElementById("mainPage").style.marginLeft = "20.5%";
    }
    else{
        sidebar.style.display = "none"; 
        document.getElementById("mainPage").style.marginLeft = "1.5%";
    }
    
}

function change(a){
   
    a.style.backgroundColor = "blueviolet";
    document.getElementById("icon").style.color = "white";
}

function rechange(a){
   
    a.style.backgroundColor = "rgb(243, 237, 237)";
    document.getElementById("icon").style.color = "blueviolet";
    
}
 //  fetch("https://api.apispreadsheets.com/data/JZba3WZK41doXqBQ/", {
     //       method: "POST",
   //         body: JSON.stringify(newOjectData),
   //     }).then(res =>{
   //         if (res.status === 201){
                // SUCCESS
   //             console.log("record is in excel");
   //         }
   //         else{
                // ERROR
   //             console.log("record not saved");
   //         }
   //     })

   function saveLog(num , record_id , finaldef){
    //console.log(finaldef);
     //let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date();
    let fullYear = d.getFullYear()
    let fullMonth = d.getMonth()
    let fullDate = d.getDate()
    let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let formatDate = fullDate + "-" +monthNames[fullMonth]+ "-" + fullYear + " " + time;
    console.log(formatDate);
    

    switch(num){
      case 1:  
       result=`Price Quotation Created by  ${localStorage.getItem('user')}`;  
       break;  
       case 2:  
       result=`Price Quotation is edited by ${localStorage.getItem('user')}`;  
       break;  
       case 3:  
       result=`Price Calculation is created by ${localStorage.getItem('user')}`;  
       break;  
       case 4:  
       result=`Price Calculation is edited by ${localStorage.getItem('user')}`;  
       break;  
       case 5:  
       result=`Price Quotation is deleted by ${localStorage.getItem('user')}`;  
       break;  
       default:  
       result="No Grade";  
    }


    let createdBy = localStorage.getItem('user');
    console.log(createdBy);
      let log_record = {
          date: formatDate.toString(),
          activity:result,
          createdBy: createdBy,
          record_id: record_id,
          fields: finaldef
      }
      fetch('https://epriceuatapi.europassistance.in/storeLog', {
        method: "POST",
        body: JSON.stringify(log_record),
         headers: {"Content-type": "application/json; charset=UTF-8"}
         })
        .then(response => response.json()) 

   }

function displayLogs(displayLogId){

  var a = document.getElementById("logTable");
  var rows = a.rows.length;
  console.log(rows);

 while( rows > 1){
  a.deleteRow(rows - 1);
  rows = rows - 1;
 }

    fetch(`https://epriceuatapi.europassistance.in/logrecord/${displayLogId}`, {
        
    headers: {"Content-type": "application/json; charset=UTF-8"}
   })
    .then(response => response.json()) 
    .then(data => {
       //console.log(data);
       
       
       const newLocal = "";
       let locationData = newLocal  
       for(var i = 0; i < data.length ; i++){
        //console.log(data[i]);
        //let a =data[i].fields;
       // a = JSON.stringify(a)
        //console.log(a);
        locationData += `<tr>
        <td style="text-align: center;">${data[i].date}</td>
        <td style="text-align: center;">${data[i].activity}</td>
        <td style="text-align: center;">${data[i].createdBy}</td>  
        <td style="text-align: center;">
        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#changesView" style="color: #144ca0;" onclick='displayChanges(${JSON.stringify(data[i].fields)})'>
        View    
        </button>
         
        </td>   
        </tr>`
        document.getElementById("logTableBody").innerHTML = locationData;  
        
       }      
    })      
   }

  function displayChanges(field){
     
   console.log(field);
   locationData = ""
  for(let i = 0; i < field.length ; i ++){
    if (field[i].fieldName === "Services"){
    
      locationData += `
      <tr><td> Service type is ${field[i].to.servicename} with  average Percentage ${field[i].to.per_centage} and Kilometer ${field[i].to.avg_km}.
      </td>
      </tr>
      `
      document.getElementById("changes").innerHTML = locationData;
      }
    
   else{


    locationData += `
    <tr><td> ${field[i].fieldName} value is changed from ${field[i].from} to ${field[i].to}.
    </td>
    </tr>
    `
    document.getElementById("changes").innerHTML = locationData;
   }
  }
  
  }