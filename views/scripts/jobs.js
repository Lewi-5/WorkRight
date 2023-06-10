let page = 0;

$(document).ready(function() {
    loadJobs();

    $("#loadMore").click(function() {
        page++;
        loadJobs();
    });
});

function loadJobs() {
    $.ajax({
        url: '/api/jobs?page=' + page,
        method: 'GET',
        success: function(data) {
            data.forEach(job => {
                $('#jobListings').append(`
                    <div class="col-sm-4">
                        <div class="panel panel-default">
                            <div class="panel-heading">${job.title}</div>
                            <div class="panel-body">${job.industry}</div>
                        </div>
                    </div>
                `);
            });
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
}


$(document).ready(function () {
    $("#searchForm").on("submit", function(e) {
        e.preventDefault();  // prevent the default form submission
        page = 0; // reset to 0
        var location = $("#locationSearchBox").val();
        var industry = $("#industrySearchBox").val();

        $.ajax({
            url: "/api/jobs/",
            data: {
                location: location,
                industry: industry
            },
            type: "GET",
            dataType: "json",
            success: function(jobs) {
                // clear current listings
                $("#jobListings").empty();

                // append new listings
                jobs.forEach(job => {
                    $("#jobListings").append(`
                        <div class="job" col-12">
                        ">
                            <h2>${job.title}</h2>
                            <p>${job.description}</p>
                        </div>
                    `);
                });
            },
            error: function(error) {
                console.error("Error:", error);
            }
        });
    });
});

