$(document).ready(function () {

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
    // }).fail((jqXHR, textStatus, errorThrown) => {
    //     console.error("Error:", errorThrown);
    //   });

    //   $.post("http://localhost:7077/api/users", (data) => {
        
    //   }).fail((jqXHR, textStatus, errorThrown) => {
    //     console.error("Error:", errorThrown);
    //   });
      

    
});

$("#addBtn").on("click", () => {
  console.log("button clicked");
  const requestData = {
    username: $("#username").val(),
    password: $("#password").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val()
  };

  fetch("http://localhost:7077/api/users", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(response => {
      if (response.ok){
        return response.json().then(data => {
          $("#resultMessage").text("your new username is " + data.username);
        });
      } else {
        return response.json().then(data => {
          $("#resultMessage").text(data.message);
      });
    }


  })
  .catch(error => {
    console.log(error);
  })

})