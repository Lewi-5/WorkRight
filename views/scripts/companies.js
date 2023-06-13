$(document).ready(function () {

    $("#companyname").val("");
    $("#desc").val("");
    $("#industry").val("Finance");
    $("#streetno").val("");
    $("#street").val("");
    $("#city").val("");
    $("#province").val("Alberta");
    $("#postcode").val("");
    $("#companySelect").val("");

    $("#signOut").on("click", function() {
        sessionStorage.setItem('username', "");
        sessionStorage.setItem('password', "");
        window.location.href = "../logintest.html"
    })


    $("#modify, .workBtn").css({
        "border": "none",
        "outline": "0",
        "display": "inline-block",
        "padding": "15px 25px",
        "margin-top": "40px",
        "margin-bottom": "40px",
        "color": "rgb(250, 248, 248)",
        "background-color": "#ec3d3d",
        "border-radius": "4%",
        "text-align": "center",
        "cursor": "pointer"
    });
    $("#modify, .workBtn").hover(function () {
        $(this).css("background-color", "#a01c1c")
    }, function () {
        $(this).css("background-color", "#ec3d3d")
    })

    $("#toCompanies").on("click", function () {
        window.location.href = "../allcompanies.html"
    })


    //get url params : id
    $('.postalCodeWarning').hide();
    $('.nameWarning').hide();
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    //console.log(`id = ${id}`);
    if (id == 0) {
        $("#modify").html("Add New");
    } else {
        $("#modify").html("Update");
        getCompany(id);

    }

    $('#companyname').on('blur', function () {
        let companyname = $("#companyname").val();
        if (companyname == null || companyname == "") {
            $(".nameWarning").show();
            return false;
        } else {
            $(".nameWarning").hide();
        }
    });

    $('#postcode').on('blur', function () {
        let postcode = $("#postcode").val();
        const PosteCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
        if (postcode !== null || postcode !== "") {
            if (PosteCodeRegex.test(postcode)) {
                $('.postalCodeWarning').hide();
            } else {
                $('.postalCodeWarning').show();
            }
        }
    });

    $("#modify").on("click", function () {
        //if(!validateData()) return false;
        if ($("#modify").text() === "Update") {
            updateCpmpany(id);
        } else {
            addNew();
        }
    });

    $('.postalCodeWarning').hide();
    $('.nameWarning').hide();

    var company = "hello"; // Replace with the desired string

    //FIXME: SHORT TERM SOLUTION OF COMPANY JOBS LINK FOR DEMO USE ONLY

    $("#toCompanyJobs").prop("disabled", true);
    $("#toCompanyJobs").css("background-color", "#grey")

    $("#companySelect").change(function () {
        $("#toCompanyJobs").prop("disabled", false);
        $("#toCompanyJobs").css("background-color", "#ec3d3d")
    });

        let companyParam;
    $("#companySelect").change(function () {
        let valSelected = $(this).val();
        
        switch (valSelected) {
            case "C&T":
                companyParam = 28;
                break;
            case "Company C":
                companyParam = 30;
                break;
            case "hello":
                companyParam = 35;
                break;
            case "hello world":
                companyParam = 37;
                break;
            case "workrignt":
                companyParam = 39;
                break;
            case "workrignt1":
                companyParam = 40;
                break;
            case "hellohello":
                companyParam = 41;
                break;
            case "difdfgdfg":
                companyParam = 42;
                break;
            case "helloWorld":
                companyParam = 43;
                break;
            case "helloWorld12":
                companyParam = 44;
                break;
            case "helloWorld123":
                companyParam = 47;
                break;
            case "Brighteye":
                companyParam = 48;
                break;
            case "company baby":
                companyParam = 28;
                break;
            case "Customers Inc.":
                companyParam = 28;
                break;
            default:

                break;
        }
        
    });
    $("#toCompanyJobs").on("click", function () {
        window.location.href = `../companyjobs.html?id=${companyParam}`;
    })
});

//update company
function updateCpmpany(id) {
    if (validateData() == false) {
        return false;
    }
    const name = $("#companyname").val();
    console.log("name= " + name);
    if (name == null || name == "") {
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

    const now = new Date();
    var updatedate = now.toISOString().slice(0, 19).replace('T', ' ');
    var company = {
        name: name,
        description: desc,
        industry: industry,
        streetNo: streetno,
        street: street,
        city: city,
        province: province,
        postcode: postcode,
        lastUpdate: updatedate,
    };

    $.ajax({
        url: "/api/companies/" + id,
        type: "put",
        dataType: "json",
        data: company,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (company) {
        $("#popupMessage").dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                }
            }
        });
        window.open('allcompanies.html', '_self');
    });
}

//add new company
function addNew() {
    if (validateData() == false) {
        return false;
    }
    const name = $("#companyname").val();
    console.log("name= " + name);
    if (name == null || name == "") {
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

    const now = new Date();
    var createdate = now.toISOString().slice(0, 19).replace('T', ' ');
    var company = {
        name: name,
        description: desc,
        industry: industry,
        streetno: streetno,
        street: street,
        city: city,
        province: province,
        postcode: postcode,
        createDate: createdate,
    };

    $.ajax({
        url: "/api/companies/",
        type: "post",
        dataType: "json",
        data: company,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (company) {
        $("#popupMessage").dialog({
            modal: true,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                }
            }
        });
        window.open('allcompanies.html', '_self');
    });

}
//get company
function getCompany(id) {
    console.log("/api/Companies/" + id);
    $.ajax({
        url: "/api/Companies/" + id,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (company) {
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

    const companyname = $("#companyname").val();
    if (companyname == null || companyname == "") {
        $(".nameWarning").show();
        return false;
    }

    console.log("postalCode= " + $("#postcode").val());
    //validat postcode
    const postalCode = $("#postcode").val();
    const PosteCodeRegex = /^[A-Za-z]\d[A-Za-z]?\d[A-Za-z]\d$/;
    if (postalCode !== null || postalCode !== "") {
        if (!PosteCodeRegex.test(postalCode)) {
            $('.postalCodeWarning').show();
            return false;
        };
    }
    return true;
}

//refreshTodoList
function refreshTodoList(params) {
    $.ajax({
        url: "/api/companies",
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (companiesList) {
        var result = '<tr><th>Name</th><th>Description</th><th>Industry</th></tr>';
        for (var i = 0; i < companiesList.length; i++) {
            var company = companiesList[i];
            result += '<tr onclick="selectItem(' + company.id + ')">';
            result += '<td>' + company.name + '</td>';
            result += '<td>' + company.description + '</td>';
            result += '<td>' + company.industry + '</td>';
            result += '</tr>' + "\n";
        }
        $("#listTable").html(result);
    });
}
