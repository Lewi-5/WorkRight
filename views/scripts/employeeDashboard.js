$(document).ready(function () {

    $("#signOut").on("click", function () {
    sessionStorage.setItem('username', "");
    sessionStorage.setItem('password', "");
    window.location.href = "./logintest.html"
});

    refreshPage();
    const queryString = window.location.search;

    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        // ContentType: "application/json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            setTimeout(() => {
                window.location.href = "./loginTest.html"
            }, 3000);
        }
    }).done(function (account) {
        console.log(account);
        $("#welcomeBack").html("Welcome back " + account.username);
        $("#nameP").html("<em>Job Finder</em>,<br>" + account.firstName + " " + account.lastName);
        $("#rolePane").fadeIn(3000);
        $("#userIndustry").html("Your Industry: " + account.industry);
    });

    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log("id = " + id);
    getUser(id);

    $("#edit").on("click", function () {
        $("#currentId").hide();
        update(id);

    });

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

    $("#toJobs").on("click", function () {
        window.location.href = "./jobs.html"
    })
    $("#toCompanies").on("click", function () {
        window.location.href = "./allcompanies.html"
    })

    $('#delete').on("click", function () {
        $("#deletepopupMessage").dialog({
            modal: true,
            buttons: {
                Yes: function () {
                    $.ajax({
                        url: "/api/users/" + id,
                        type: "delete",
                        dataType: "json",
                        error: function (jqxhr, status, errorThrown) {
                            alert("AJAX error: " + jqxhr.responseText);
                        }
                    }).done(function (company) {
                        refreshPage();
                    });
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    });

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
    //if (passwordInpt == null || passwordInpt == "") {
    if (!validatePassword(passwordInpt)) {
        $(".passwordWarning").show();
        return false;
    } else {
        $(".passwordWarning").hide();
    }

    //}
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
                OK: function () {
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
    $(".namepopWarning").hide();
    $("#username").val("");
    $("#password").val("");
    $("#firstName").val("");
    $("#lastName").val("");
}
//get company
function getUser(id) {
    //console.log("/api/users/" + id);
    $.ajax({
        url: "/api/users/" + id,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (user) {
        $("#username").val(user.username);
        $("#password").val(user.password);
        $("#firstName").val(user.firstName);
        $("#lastName").val(user.lastName);
        $("#role").val(user.role);
    });
}
