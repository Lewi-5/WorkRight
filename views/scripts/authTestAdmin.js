$(document).ready(function() {


    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
        }).done(function (account) {
            console.log(account);
            $("#welcomeBack").html("Welcome back "+ account.username);
            $("#nameP").html("Profile for " + account.firstName + " " + account.lastName);
            if (account.role == 'user'){
                $("#user").show();
            }
            if (account.role == 'employer'){
                $("#employer").show();
            }
            if (account.role == 'admin'){
                $("#admin").show();
            }
        });


        $("#profile").fadeIn(3000);
        
           
            

    });

