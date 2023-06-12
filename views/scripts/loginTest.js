let username = "";
let password = "";

$(document).ready(function () {

    $("input[name=username]").val("");
    $("input[name=password]").val("");
    $("input[name=firstName]").val("");
    $("input[name=lastName]").val("");
    $("input[name=newUsername]").val("");
    $("input[name=newPass1]").val("");
    $("input[name=newPass2]").val("");

    $("#registerButton").click(function () {
        var newFirstName = $("input[name=firstName]").val();
        var newLastName = $("input[name=lastName]").val();
        var newUsername = $("input[name=newUsername]").val();
        var newPass1 = $("input[name=newPass1]").val();
        var newPass2 = $("input[name=newPass2]").val();
        if (newPass1 != newPass2) {
            alert("Both passwords must be the same");
            return;
        }
        var userObj = { username: newUsername, password: newPass1, firstName: newFirstName, lastName: newLastName };
        //FIXME: what is wait for it? delete??
        $("#waitForIt").show();
        // NOTE: if currId = 0 then adding, otherwise updating
        $.ajax({ // FIXME: escape special characters using urlencode
            url: "/api/users",
            type: "POST",
            dataType: "json",
            data: userObj,
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function () {
            // TODO: alerts are obsolete, instead use HTML z-layer popup that shows up for 2-3 seconds
            alert("User registered successfully. You may now login.");
            $("input[name=firstName]").val("");
            $("input[name=lastName]").val("");
            $("input[name=newUsername]").val("");
            $("input[name=newPass1]").val("");
            $("input[name=newPass2]").val("");
        }).always(function () {
            $("#waitForIt").hide();
        });
    });

    $("#profile").hide();

    $("#loginButton").click(function () {
        let username = $("input[name=username]").val();
        let password = $("input[name=password]").val();
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        
        $.ajax({
            url: "/api/users/me",
            headers: { 'x-auth-username': username, 'x-auth-password': password },
            type: "GET",
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
            }
        }).done(function (user) {
            if (user.role == 'user'){
                window.location.href ="http://localhost:7077/employeeDashboard.html"
            } else if (user.role == 'employer'){
                window.location.href ="http://localhost:7077/authTestEmployer.html"
            }else if (user.role == 'admin'){
                window.location.href ="http://localhost:7077/users.html"
            }
             else {
                alert("authentication invalid");
            }
            // $("#loginPane").hide();
            // $("#welcomeBack").html("Welcome back "+ user.username);
            // $("#nameP").html("Profile for " + user.firstName + " " + user.lastName);
            // $("#profile").fadeIn(3000);
        });
    });

});

