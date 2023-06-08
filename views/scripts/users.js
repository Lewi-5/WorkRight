$(document).ready(function () {

    const tableBody = $("#tableBody");

    $.get("http://localhost:7077/api/users", (data) => {
        for (let i = 0; i < data.length; i++) {
            let tableRow = $("<tr></tr>");
      
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