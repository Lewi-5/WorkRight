$(document).ready(function () {

    const tableBody = $("#tableBody");

    $.get("http://localhost:7077/api/users", (data) => {
        for (let i = 0; i < data.length; i++) {
            let tableRow = $(`<tr class="row" id="row${i}"><div class="col-2"></div></tr>`); // not working yet to create cards of each row
      
            let idCell = $("<td></td>").text(data[i].ID);
            let usernameCell = $("<td></td>").text(data[i].username);
            let passwordCell = $("<td></td>").text(data[i].password);
            let firstNameCell = $("<td></td>").text(data[i].firstName);
            let lastNameCell = $("<td></td>").text(data[i].lastName);
      
            tableRow.append(idCell, usernameCell, passwordCell, firstNameCell, lastNameCell);
            tableBody.append(tableRow);
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error:", errorThrown);
      });
});