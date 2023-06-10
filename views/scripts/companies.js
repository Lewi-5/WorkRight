$(document).ready(function () {
    //get url params : id
    $('.postalCodeWarning').hide();
    $('.nameWarning').hide();
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
//console.log(`id = ${id}`);
    if(id == 0 ){
        $("#addnew").text("Add New");
    }else{
        $("#addnew").text("Update");
         getCompany(id);
        
    }
    $("#addnew").on("click", function(){
        //if(!validateData()) return false;
        if($("#addnew").text() === "Update"){
            updateCpmpany(id);
        }else{
            addNew();
        }
        
    });
    $("#modalclose").on("click",function(){
        console.log("modalclose clicked, return to index");
        window.open('index.html', '_self');
    });
    $('.postalCodeWarning').hide();
    $('.nameWarning').hide();
});

//update company
function updateCpmpany(id) {
    const name = $("#companyname").val();  
    console.log("name= "+ name );
    if (name == null || name ==""){
        $(".nameWarning").show();
        return false;
    } 
    const desc = $("#desc").val();
    const industry = $("#industry").val();

    const streetno = $("#streetno").val();                    
    const street = $("#street").val();
    const city = $("#city").val();

    const province = $("#province").val();
    const postcode = $("#postcode").val();

    const currentdate = new Date();
    const createdate = currentdate.toLocaleString();
    var company = {
        name : name,
        description : desc,
        industry : industry,
        streetno : streetno,
        street : street,
        city : city,
        province : province,
        postcode : postcode,
        ceate_date : createdate,
    };

    $.ajax({
        url:"/api/companies/"+id,
        type:"put",
        dataType:"json",
        data:company,
        error: function (jqxhr, status, errorThrown) {
        alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function(company){
        $("#addsuccess").modal("show");
    });
}

//add new company
function addNew() {
    const name = $("#companyname").val();     
    console.log("name= "+ name );
    if (name == null || name ==""){
        $(".nameWarning").show();
        return false;
    }               
        const desc = $("#desc").val();
        const industry = $("#industry").val();

        const streetno = $("#streetno").val();                    
        const street = $("#street").val();
        const city = $("#city").val();

        const province = $("#province").val();
        const postcode = $("#postcode").val();

        const currentdate = new Date();
        const createdate = currentdate.toLocaleString();
        var company = {
            name : name,
            description : desc,
            industry : industry,
            streetno : streetno,
            street : street,
            city : city,
            province : province,
            postcode : postcode,
            ceate_date : createdate,
        };

        $.ajax({
            url:"/api/companies/",
            type:"post",
            dataType:"json",
            data:company,
            error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function(company){
            $("#addsuccess").modal("show");
        });
}
//get company
function getCompany(id) {
    console.log("/api/Companies/"+id);
    $.ajax({
        url:"/api/Companies/"+id,
        type:"GET",
        dataType:"json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
    }).done(function(company){
        $("#companyname").val(company.name);
        $("#desc").val(company.description);
        $("#industry").val(company.industry);
        $("#streetno").val(company.streetno);
        $("#street").val(company.street);
        $("#city").val(company.city);
        $("#province").val(company.province);
        $("#postcode").val(company.postcode);
    });
}

function validateData() {
    console.log("postalCode= " + $("#postcode").val());
    //validat postcode
    const postalCode = $("#postcode").val();
    const PosteCodeRegex = /^[A-Za-z]\d[A-Za-z]?\d[A-Za-z]\d$/;
    if (postalCode !== null || postalCode !==""){
        if( !PosteCodeRegex.test(postalCode)){
            $('.postalCodeWarning').show();
            return false;
        };
    }
}
