
var companyid = "";
$(document).ready(function () {
    const selectedOption = $("#sortSelect").val();
    refreshCompaniesList(selectedOption);
    //if new button click pass id=0
    $('#addNewCompany').on("click", function(){
        window.open('./companies.html?id=0', '_self');
    });

    //update button clicked
    $('#updateCompany').on("click", function(){
        if(companyid == null || companyid == ""){
            $("#popupMessage").dialog({
                modal: true,
                buttons: {
                    OK: function() {
                        $(this).dialog("close");
                    }
                }
            });
            
        }else{
            window.open('./companies.html?id='+companyid, '_self');
        }
    });

    //delete button clicked
    $('#deleteCompany').on("click", function(){
        if(companyid == null || companyid == ""){
            //popup message 
            $("#popupMessage").dialog({
                modal: true,
                buttons: {
                    OK: function() {
                        $(this).dialog("close");
                    }
                }
            });
        }else{
            $("#deletepopupMessage").dialog({ //popup message 
                modal: true,
                buttons: {
                    Yes: function() {
                        $.ajax({
                            url:"/api/companies/"+companyid,
                            type:"delete",
                            dataType:"json",
                            error: function (jqxhr, status, errorThrown) {
                            alert("AJAX error: " + jqxhr.responseText);
                        }
                        }).done(function(company){
                            refreshCompaniesList();
                        });
                        $(this).dialog("close");
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });
            
        }
    });

    //get job button clicked
    $('#getJobs').on("click", function(){
        if(companyid == null || companyid == ""){
            $("#popupMessage").dialog({
                modal: true,
                buttons: {
                    OK: function() {
                        $(this).dialog("close");
                    }
                }
            });
        }else{
            window.open('./companyJobs.html?id='+companyid, '_blank');
        }
    });

    // Perform sorting based on the selected option
    $('#sortSelect').change(function() {                  
        var selectedOption = $("#sortSelect").val();
        refreshCompaniesList(selectedOption)
    });
});

//refreshCompaniesList
function refreshCompaniesList(params) {
    //empty content before getting new data
    $("#jobListings").empty();
    const sortBy = params ? params : "id";
    $.ajax({
        url:"/api/allcompanies?sortBy="+sortBy,
        type:"GET",
        dataType:"json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
    }).done(function(companiesList){

        for (var i = 0; i < companiesList.length; i++) {
            var company = companiesList[i];
            console.log("company.createDate = " + company.createDate);
            if(company.createDate){
                //formatting the datetiem display
                var datetime = new Date(company.createDate);
                var formattedDatetime = datetime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }else{
                formattedDatetime = "";
            }

            $('#jobListings').append(`
                <div class="job-card col-md-6 job-listing" onclick="selectItem(${company.ID})">
                <div class="card" id="${company.ID}" >
                            <div class="card-header">Name: ${company.name}</div>
                            <div class="card-body">
                                <h5 class="card-title">Insustry: ${company.industry}</h5>
                                <p class="card-text">Description: ${company.description}</p>
                                <p class="card-text">Company located in: ${company.city}</p>
                                <p class="card-text">Created at: ${formattedDatetime}</p>
                            </div>
                        </div>
                    </div>
                `);

        }

    });
}

//when click one row
function selectItem(id) {
    companyid = id;
    // Remove the 'selected-row' class from all rows
    $('.card').removeClass('selected-row');
    // Add the 'selected-row' class to the clicked row
    $(`#${id}`).addClass('selected-row');
}

