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
                            <div class="panel-body">${job.description}</div>
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
    $("#searchBtn").on("click", function() {
        var searchText = $("#searchBox").val();
        
        $.ajax({
            url: "/api/jobs/",
            type: "GET",
            dataType: "json",
            success: function(jobs) {
                var matchedJobs = jobs.filter(job => job.title.includes(searchText) || job.description.includes(searchText));
                
                // clear current listings
                $("#jobListings").empty();
                
                // append new listings
                matchedJobs.forEach(job => {
                    $("#jobListings").append(`
                        <div class="job">
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
