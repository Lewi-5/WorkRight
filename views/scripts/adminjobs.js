let currId = 0;
let topPage = 0;
let bottomPage = 0;

$(document).ready(function () {

    refreshJobsList();

    $("#signOut").on("click", function() {
        sessionStorage.setItem('username', "");
        sessionStorage.setItem('password', "");
        window.location.href = "../logintest.html"
    })

    $("#toUsers, #toCompanies").css({
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
      $("#toUsers, #toCompanies").hover(function () {
        $(this).css("background-color", "#a01c1c")
    },function () {
        $(this).css("background-color", "#ec3d3d") })
      
    $("#toUsers").on("click", function () {
        window.location.href = "../users.html"
    })
    $("#toCompanies").on("click", function () {
        window.location.href = "../allcompanies.html"
    })

    $.ajax({
        url: "/api/users/me",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        // ContentType: "application/json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            setTimeout(() => {
                window.location.href = "../loginTest.html"
            }, 3000);
        }
    }).done(function (account) {
        console.log(account);
        $("#welcomeBack").html("Welcome back " + account.username);
        $("#nameP").html("<em>WorkRight Administrator:</em> " + account.firstName + " " + account.lastName);
        $("#rolePane").fadeIn(3000);
    });

    $("#jobId").val("");
    $("#companyId").val("");
    $("#jobTitle").val("");
    $("#postCode").val("");
    $("#industry").val("Information");

    $(".editBtn").hide();
    $(".deleteBtn").hide();
    $(".cancelBtn").hide();


    $(".editBtn").on("click", function () {
        update();
    });

    $("#previousPage").on("click", function() {
        pageChange("previous");
    });

    $("#nextPage").on("click", function() {
        pageChange("next");
    });

    $(".deleteBtn").on("click", () => {
        $.ajax({
            url: '/api/jobs/' + currId,
            headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
            type: 'DELETE',
            dataType: "json",
            error: function (jqxhr, status, errorThrown) {
                alert("AJAX ERROR: " + jqxhr.response);
            }
        }).done(function () {
            alert("job " + currId + " was deleted successfully");
            $(".editBtn").hide();
            $(".deleteBtn").hide();
            $(".cancelBtn").hide();
            $("#jobId").val("");
            $("#companyId").val("");
            $("#jobTitle").val("");
            $("#postCode").val("");
            $("#industry").val("Information");
            currId = 0;
            $("#currentId").hide();
            refreshJobsList();
        }

        )
    });


    $(".cancelBtn").on("click", function () {
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(".editBtn").hide();
        $(".deleteBtn").hide();
        $(".cancelBtn").hide();
        $("#currentId").val("");
        $("#companyId").val("");
        $("#jobTitle").val("");
        $("#postCode").val("");
        $("#industry").val("Information");
        currId = 0;
        $("#currentId").hide();
    });
});

function update() {
    console.log("button clicked");
    let companyIdInpt = $("#companyId").val();
    let jobTitleInpt = $("#jobTitle").val();
    let postCodeInpt = $("#postCode").val();
    let industryInpt = $("#industry").val();

    if (companyIdInpt == null || companyIdInpt == "") {
        alert("You cannot send an update request without a company Id");
        return false;
    }
    if (jobTitleInpt == null || jobTitleInpt == "") {
        alert("Please enter a job title.");
        return false;
    }
    if (postCodeInpt == null || postCodeInpt == "") {
        alert("Please enter a valid postal code.");
        return false;
    }
    if (industryInpt == null || industryInpt == "") {
        alert("Please select the industry for this posting.");
        return false;
    }


    let requestData = {
        companyId: companyIdInpt,
        title: jobTitleInpt,
        postCode: postCodeInpt,
        industry: industryInpt
    };

    console.log(sessionStorage.getItem('username'))
    console.log(sessionStorage.getItem('password'))

    $.ajax({
        url: `/api/jobs/${currId}`,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "PATCH",
        dataType: "json",
        //contentType: "application/json",
        data: requestData,
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (requestData) {
        $("#resultMessage").html(`Success! Job ${requestData.jobId} has been updated`);
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(".editBtn").hide();
        $(".deleteBtn").hide();
        $(".cancelBtn").hide();
        $("#currentId").val("");
        $("#companyId").val("");
        $("#jobTitle").val("");
        $("#postCode").val("");
        $("#industry").val("Information");;
        refreshJobsList();
        currId = 0;

    });
}

function selectItem(id) {
    //selected = true;
    $("#currentId").val(`${id}`)
    $("#currentId").show();
    $.ajax({
        url: "/api/jobs/" + id,
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function (job) {
        $("#resultMessage").html("");
        $(`#${currId}`).css("background-color", "#f0f0f0")
        $(`#${id}`).css("background-color", "#ec3d3d")
        $(".editBtn").show();
        $(".deleteBtn").show();
        $(".cancelBtn").show();
        $("#jobId").val(job.jobId);
        $("#companyId").val(job.companyId);
        $("#title").val(job.title);
        $("#postCode").val(job.postCode);
        $("#industry").val(job.industry);
        currId = id;

    });
}

function refreshJobsList() {
    const tableBody = $("#tableBody");
    $("#tableBody").html("");
    $.ajax({
        url: "/api/jobs/page/",
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done (function(data) {
            topPage = data[0].jobId;
            bottomPage = data[data.length - 1].jobId; // that -1 array length ruined me...
            for (let i = 0; i < data.length; i++) {
                let tableRow = $(`<tr id="${data[i].jobId}" onclick="selectItem(${data[i].jobId})">'><th id="th${i}" scope="row">${data[i].jobId}</th></tr>`); // not working yet to create cards of each row

                // let idCell = $(`#th${i}`).text(data[i].ID);

                // let idCell = $("<td></td>").text(data[i].ID);
                //let jobIdCell = $("<td></td>").text(data[i].jobId);
                let companyIdCell = $("<td></td>").text(data[i].companyId);
                let titleCell = $("<td></td>").text(data[i].title);
                let industryCell = $("<td></td>").text(data[i].industry);

                tableRow.append(companyIdCell, titleCell, industryCell);
                tableRow.css("background-color", "#f0f0f0");
                tableBody.append(tableRow);
            }
        });
    }


    function pageChange(previousOrNextPage){
        const tableBody = $("#tableBody");
        if (tableBody.children().length === 0){
            alert("You have reached the end of the pages.")
            return;
        }
    $.ajax({
        url: previousOrNextPage == "previous" ? "/api/jobs/page" + "" + (topPage * -1) : "/api/jobs/page/" + "" + bottomPage, // try to use positive or negative param to tell controller and model if this page forward or page back
        headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
    }).done(function(data) {
            const tableBody = $("#tableBody");
            $("#tableBody").html("");
            for (let i = 0; i < data.length; i++) {
                let tableRow = $(`<tr id="${data[i].jobId}" onclick="selectItem(${data[i].jobId})">'><th id="th${i}" scope="row">${data[i].jobId}</th></tr>`); // not working yet to create cards of each row

                // let idCell = $(`#th${i}`).text(data[i].ID);

                // let idCell = $("<td></td>").text(data[i].ID);
                //let jobIdCell = $("<td></td>").text(data[i].jobId);
                let companyIdCell = $("<td></td>").text(data[i].companyId);
                let titleCell = $("<td></td>").text(data[i].title);
                let industryCell = $("<td></td>").text(data[i].industry);

                tableRow.append(companyIdCell, titleCell, industryCell);
                tableRow.css("background-color", "#f0f0f0");
                tableBody.append(tableRow);
            }
            topPage = data[0].jobId;
            bottomPage = data[data.length - 1].jobId;
    })
}