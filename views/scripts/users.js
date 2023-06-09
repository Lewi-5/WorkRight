$(document).ready(function () {
    
    $('.nameWarning').hide();
    $('.passwordWarning').hide();
    $('.fnameWarning').hide();
    $('.lnameWarning').hide();

    $('#username').on('blur', function() {
        console.log('Input lost focus');
        let usernameInpt = $("#username").val();
        if (usernameInpt == null || usernameInpt ==""){
            $(".nameWarning").show();
            return false;
        }else{
            $(".nameWarning").hide();
            
        }
      });

      $('#password').on('blur', function() {
        let passwordInpt = $("#password").val();
        if (passwordInpt == null || passwordInpt ==""){
            $(".passwordWarning").show();
            return false;
        } else{
            $(".passwordWarning").hide();
        }
      });

      $('#firstName').on('blur', function() {
        let firstNameInpt = $("#firstName").val();
        if (firstNameInpt == null || firstNameInpt ==""){
            $(".fnameWarning").show();
            return false;
        } else{
            $(".fnameWarning").hide();
        }
      });

      $('#lastName').on('blur', function() {
        let lastNameInpt = $("#lastName").val();
        if (lastNameInpt == null || lastNameInpt ==""){
            $(".lnameWarning").show();
            return false;
        } else{
            $(".lnameWarning").hide();
        }
      });

    const tableBody = $("#tableBody");

    $.get("http://localhost:7077/api/users", (data) => {
        for (let i = 0; i < data.length; i++) {
            let tableRow = $(`<tr id="row${i}"><th id="th${i}" scope="row">${data[i].ID}</th></tr>`); // not working yet to create cards of each row

            // let idCell = $(`#th${i}`).text(data[i].ID);

            // let idCell = $("<td></td>").text(data[i].ID);
            let usernameCell = $("<td></td>").text(data[i].username);
            let passwordCell = $("<td></td>").text(data[i].password);
            let firstNameCell = $("<td></td>").text(data[i].firstName);
            let lastNameCell = $("<td></td>").text(data[i].lastName);
      
            tableRow.append(usernameCell, passwordCell, firstNameCell, lastNameCell);
            tableRow.css("background-color", "aqua");
            tableBody.append(tableRow);
        }
      });
      
      
      $(".addBtn").on("click", function(){
            addNew();
            refreshInputs();
        })
        
    
 

    
});

function refreshInputs(){
    $('.nameWarning').hide();
    $('.passwordWarning').hide();
    $('.fnameWarning').hide();
    $('.lnameWarning').hide();
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

         if (usernameInpt == null || usernameInpt ==""){
            $(".nameWarning").show();
            return false;
        } 
        if (passwordInpt == null || passwordInpt ==""){
            $(".passwordWarning").show();
            return false;
        } 
        if (firstNameInpt == null || firstNameInpt ==""){
            $(".fnamedWarning").show();
            return false;
        } 
        if (lastNameInpt == null || lastNameInpt ==""){
            $(".lnameWarning").show();
            return false;
        } 
        let requestData = {
          username: $("#username").val(),
          password: $("#password").val(),
          firstName: $("#firstName").val(),
          lastName: $("#lastName").val()
        };
          
            $.ajax({
                url:"/api/users/",
                type:"post",
                dataType:"json",
                data: requestData,
                error: function (jqxhr, status, errorThrown) {
                alert("AJAX error: " + jqxhr.responseText);
                }
            }).done(function(){
                console.log("post call made");
                $("#resultMessage").html("Success!");
            });
      }
      