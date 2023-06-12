
let currId = 0;

$(document).ready(function () {

    refreshUserList();


    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        // ContentType: "application/json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            setTimeout(() => {
                window.location.href = "http://localhost:7077/loginTest.html"
            }, 3000);
        }
    }).done(function (account) {
        console.log(account);
        $("#welcomeBack").html("Welcome back " + account.username);
        $("#nameP").html("<em>WorkRight Administrator:</em> " + account.firstName + " " + account.lastName);
        $("#rolePane").fadeIn(3000);
    });

    $("#username").val("");
    $("#password").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#role").val("user");

    $(".editBtn").hide();
    $(".deleteBtn").hide();
    $(".cancelBtn").hide();


    $('.nameWarning').hide();
    $('.passwordWarning').hide();
    $('.fnameWarning').hide();
    $('.lnameWarning').hide();
    $('.namedupWarning').hide();

    $(".addBtn").on("click", function () {
        if (checkInputs() == false) {
            return false;
        };
        addNew();
        refreshInputs();
    });

    $(".editBtn").on("click", function () {
        //console.log("EDIT BUTTON DURR")
        $("#currentId").hide();
        update();

        //location.reload(); //FIXME: something is wrong with the update ajax PATCH request - cannot figure out how to get it to not throw an error- it successfully patches
        // the database, but it does not execute the .done after the request
        // it throws an ajax error but with the message of the controller's 200 success response
        // very strange
        // UPDATE SEEMS FIXED

    });


    $(".deleteBtn").on("click", () => {
        $.ajax({
            url: '/api/users/' + currId,
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: 'DELETE',
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX ERROR: " + jqxhr.response);
            }
        }).done(function () {
            alert("user " + currId + " was deleted successfully");
            $(".addBtn").show();
            $(".editBtn").hide();
            $(".deleteBtn").hide();
            $(".cancelBtn").hide();
            $("#username").val("");
            $("#password").val("");
            $("#firstName").val("");
            $("#lastName").val("");
            $("#role").val("user");
            currId = 0;
            $("#currentId").hide();
            refreshUserList();
        }

        )
    });


    $(".cancelBtn").on("click", function () {
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(".addBtn").show();
        $(".editBtn").hide();
        $(".deleteBtn").hide();
        $(".cancelBtn").hide();
        $("#username").val("");
        $("#password").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#role").val("user");
        currId = 0;
        $("#currentId").hide();
    });



    $('#username').on('blur', function () {

        let usernameInpt = $("#username").val();
        if (usernameInpt == null || usernameInpt == "") {
            $(".nameWarning").show();
            $(".namedupWarning").hide();
            return false;
        } else {

            //validate if username already exist in database
            $.ajax({
                url: "/api/users/findName?username=" + $("#username").val(),
                type: "get",
                dataType: "json",
                success: function (responseData) {
                    // Process the response data here
                    console.log(responseData);
                },
                error: function (jqxhr, status, errorThrown) {
                    //if statur is 405 then the username is not exist, can not add user
                    if (jqxhr.status == 405) {
                        $('.namedupWarning').hide();
                        $(".addBtn").prop('disabled', false);
                    }
                }
            }).done(function (user) {

                if (user) { //if user already exist
                    $(".addBtn").prop('disabled', true);
                    $('.namedupWarning').show();

                    return false;
                }
            });

            $(".nameWarning").hide();

        }
    });

    $('#password').on('blur', function () {
        let passwordInpt = $("#password").val();
        if (passwordInpt == null || passwordInpt == "") {
            $(".passwordWarning").show();
            return false;
        } else {
            $(".passwordWarning").hide();
        }
    });

    $('#firstName').on('blur', function () {
        let firstNameInpt = $("#firstName").val();
        if (firstNameInpt == null || firstNameInpt == "") {
            $(".fnameWarning").show();
            return false;
        } else {
            $(".fnameWarning").hide();
        }
    });

    $('#lastName').on('blur', function () {
        let lastNameInpt = $("#lastName").val();
        if (lastNameInpt == null || lastNameInpt == "") {
            $(".lnameWarning").show();
            return false;
        } else {
            $(".lnameWarning").hide();
        }
    });

    const tableBody = $("#tableBody");

});




function checkInputs() {
    //check username, if it is null or duplicate
    let usernameInpt = $("#username").val();
    if (usernameInpt == null || usernameInpt == "") {
        $(".nameWarning").show();
        $(".namedupWarning").hide();
        return false;
    } else {

        //validate if username already exist in database
        $.ajax({
            url: "/api/users/findName?username=" + $("#username").val(),
            type: "get",
            dataType: "json",
            success: function (responseData) {
                // Process the response data here
                console.log(responseData);
            },
            error: function (jqxhr, status, errorThrown) {
                //if statur is 405 then the username is not exist, can not add user
                if (jqxhr.status == 405) {
                    console.log("false2");
                    $('.namedupWarning').hide();
                    $(".addBtn").prop('disabled', false);
                    return true;
                }
            }
        }).done(function (user) {

            if (user) { //if user already exist
                $(".addBtn").prop('disabled', true);
                $('.namedupWarning').show();

                return false;
            }
        });
        $(".nameWarning").hide();
    }

    // check password is null or not
    let passwordInpt = $("#password").val();
    if (passwordInpt == null || passwordInpt == "") {
        $(".passwordWarning").show();
        return false;
    } else {
        $(".passwordWarning").hide();
    }

    //check firstname is null or not
    let firstNameInpt = $("#firstName").val();
    if (firstNameInpt == null || firstNameInpt == "") {
        $(".fnameWarning").show();
        return false;
    } else {
        $(".fnameWarning").hide();
    }

    //check the last name is null or not
    let lastNameInpt = $("#lastName").val();
    if (lastNameInpt == null || lastNameInpt == "") {
        $(".lnameWarning").show();
        return false;
    } else {
        $(".lnameWarning").hide();
    }

}
function refreshInputs() {
    $('.nameWarning').hide();
    $('.passwordWarning').hide();
    $('.fnameWarning').hide();
    $('.lnameWarning').hide();
    $('.namedupWarning').hide();
    $("#username").val("");
    $("#password").val("");
    $("#firstName").val("");
    $("#lastName").val("");
}

function addNew() {
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
    if (passwordInpt == null || passwordInpt == "") {
        $(".passwordWarning").show();
        return false;
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

    $.ajax({
        url: "/api/users",
        type: "POST",
        dataType: "json",
        data: requestData,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (data) {
        console.log("post call made");
        $("#resultMessage").html(`Success! Account ${data.username} has been created`);


        refreshUserList();
        currId = 0;

    });
}

// lots of code reduplication for update compared to addNew, but i could not get
// a combined addNewOrUpdate to work
//FIXME: just full page refresh on the edit button... something is wrong with the update ajax PATCH request - cannot figure out how to get it to not throw an error- it successfully patches
// the database, but it does not execute the .done after the request
// it throws an ajax error but with the message of the controller's 200 success response
// very strange
// UPDATE SEEMS FIXED
function update() {
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
    if (passwordInpt == null || passwordInpt == "") {
        $(".passwordWarning").show();
        return false;
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
        $("#resultMessage").html(`Success! Account ${requestData.id} has been updated`);
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(".addBtn").show();
        $(".editBtn").hide();
        $(".deleteBtn").hide();
        $(".cancelBtn").hide();
        $("#username").val("");
        $("#password").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#role").val("user");
        refreshUserList();
        currId = 0;

    });
}
function selectItem(id) {
    //selected = true;
    $("#currentId").html(`Current Id: ${id}`)
    $("#currentId").show();
    $("#delete").show();
    $.ajax({
        url: "/api/users/" + id,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (user) {
        $("#resultMessage").html("");
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(`#${id}`).css("background-color", "#ec3d3d")
        $(".addBtn").hide();
        $(".editBtn").show();
        $(".deleteBtn").show();
        $(".cancelBtn").show();
        $("#username").val(user.username);
        $("#password").val("");
        $("#firstName").val(user.firstName);
        $("#lastName").val(user.lastName);
        $("#role").val(user.role);
        currId = id;

    });
}


function refreshUserList() {
    const tableBody = $("#tableBody");
    $("#tableBody").html("");
    $.ajax({
        url: "/api/users",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done (function(data) {
            for (let i = 0; i < data.length; i++) {
                let tableRow = $(`<tr id="${data[i].ID}" onclick="selectItem(${data[i].ID})">'><th id="th${i}" scope="row">${data[i].ID}</th></tr>`); // not working yet to create cards of each row

                // let idCell = $(`#th${i}`).text(data[i].ID);

                // let idCell = $("<td></td>").text(data[i].ID);
                let usernameCell = $("<td></td>").text(data[i].username);
                let firstNameCell = $("<td></td>").text(data[i].firstName);
                let lastNameCell = $("<td></td>").text(data[i].lastName);
                let roleCell = $("<td></td>").text(data[i].role);

                tableRow.append(usernameCell, firstNameCell, lastNameCell, roleCell);
                tableRow.css("background-color", "#f0f0f0");
                tableBody.append(tableRow);
            }
        });
    }
