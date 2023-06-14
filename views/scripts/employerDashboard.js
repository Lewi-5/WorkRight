let currId = 0;
let companyId = 0;

$(document).ready(function () {

    refreshPage();



    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        //contentType: "application/json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            setTimeout(() => {
                window.location.href = "./loginTest.html"
            }, 3000);
        }
    }).done(function (account) {
        //console.log(account);
        currId = account.ID; // worried about this validation, let me explain:
        // if we grab the id sent back from the authentication on page load, and then move
        // this id into the global variable currId, are we technically not doing back end validation
        // when the user wants to change their username? Perhaps on the client side the user
        // could manipulate currId. So what we need to do is grab the incoming req.header value
        // for things like patch/delete requests and pass that value into find by username
        // if the user is trying to update a user other than their own and they are not
        // an admin, the authentication will fail
        $("#welcomeBack").html("Welcome back " + account.username);
        $("#nameP").html("<em>Company Representative</em>,<br>" + account.firstName + " " + account.lastName);
        $("#rolePane").fadeIn(3000);
        $("#userIndustry").html("Your Industry: " + account.industry);
        companyId = account.companyId;
    });


    // const queryString = window.location.search;

    // const urlParams = new URLSearchParams(queryString);
    // const id = urlParams.get('id');
    // console.log("id = " + id);
    // getUser(id);

    $("#edit").on("click", function(){
        update(id);

    });

    $(".cancelBtn").on("click", function () {
        $("#username").val("");
        $("#password").val("");
        $("#firstName").val("");
        $("#lastName").val("");
    });

    $("#toCompanyEdit").on("click", function () {
        window.location.href = `./companies.html?id=${companyId}`
    })
    $("#toCompanies").on("click", function () {
        window.location.href = "./allcompanies.html"
    })

    $(".linkBtn").css({
        "border": "none",
        "outline": "0",
        "display": "inline-block",
        "padding": "15px 25px",
        "margin-top": "40px",
        "color": "rgb(250, 248, 248)",
        "background-color": "#ec3d3d",
        "border-radius": "2%",
        "text-align": "center",
        "cursor": "pointer"
    });
    $(".linkBtn").hover(function () {
        $(this).css("background-color", "#a01c1c")
    }, function () {
        $(this).css("background-color", "#ec3d3d")
    })

    $("#signOut").on("click", function() {
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('password', "");
    window.location.href = "../loginTest.html"
})
    // need to address authentication of DELETE requests allowed only for one's own account
    // $('#deleteuser').on("click", function(){
    //     $("#deletepopupMessage").dialog({
    //         modal: true,
    //         buttons: {
    //             Yes: function() {
    //                 $.ajax({
    //                     url:"/api/users/"+id,
    //                     type:"delete",
    //                     dataType:"json",
    //                     error: function (jqxhr, status, errorThrown) {
    //                     alert("AJAX error: " + jqxhr.responseText);
    //                 }
    //                 }).done(function(company){
    //                     refreshPage();
    //                 });
    //                 $(this).dialog("close");
    //             },
    //             Cancel: function() {
    //                 $(this).dialog("close");
    //             }
    //         }
    //     });
    // });
});

function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

function update(currId) {
    console.log("button clicked");
    let usernameInpt = $("#username").val();
    let passwordInpt = $("#password").val();
    let firstNameInpt = $("#firstName").val();
    let lastNameInpt = $("#lastName").val();
    let roleInpt = $("#role").val();

    if (usernameInpt == null || usernameInpt == "") {
        $(".nameWarning").show();
        return false;
    }
    if(!validatePassword(passwordInpt)){
        $(".passwordWarning").show();
        return false;
    }else{
        $(".passwordWarning").hide();
    }
    if (firstNameInpt == null || firstNameInpt == "") {
        $(".fnamedWarning").show();
        return false;
    }
    if (lastNameInpt == null || lastNameInpt == "") {
        $(".lnameWarning").show();
        return false;
    }
    if (roleInpt == null || roleInpt == "") {
        $(".lnameWarning").show();
        return false;
    }


    let requestData = {
        username: usernameInpt,
        password: passwordInpt,
        firstName: firstNameInpt,
        lastName: lastNameInpt,
        role: roleInpt
    };

    console.log(sessionStorage.getItem('username'))
    console.log(sessionStorage.getItem('password'))

    $.ajax({
        url: `/api/users/${currId}`,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "PATCH",
        dataType: "json",
        //contentType: "application/json",
        data: requestData,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (requestData) {
        $("#popupMessage").dialog({
            modal: true,
            buttons: {
                OK: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
}


function refreshPage() {
    $(".nameWarning").hide();
    $(".passwordWarning").hide();
    $(".fnamedWarning").hide();
    $(".fnameWarning").hide();
    $(".lnameWarning").hide();
    $(".namedupWarning").hide();
    $(".namepopWarning").hide();
    $("#username").val("");
    $("#password").val("");
    $("#firstName").val("");
    $("#lastName").val("");
}
//get company
function getUser(id) {
    console.log("/api/users/"+id);
    $.ajax({
        url:"/api/users/"+id,
        type:"GET",
        dataType:"json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
    }).done(function(user){
        $("#username").val(user.username);
        $("#password").val(user.password);
        $("#firstName").val(user.firstName);
        $("#lastName").val(user.lastName);
        $("#role").val(user.role);
    });
}