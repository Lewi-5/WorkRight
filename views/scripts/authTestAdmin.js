$(document).ready(function() {

    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        data: account,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
        }).done(function (data) {
            console.log(account);
            $("#welcomeBack").html("Welcome back "+ data.username);
            $("#nameP").html("Profile for " + data.firstName + " " + data.lastName);
            $("#profile").fadeIn(3000);
        });

        
           
            

    });

