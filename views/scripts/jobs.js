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
                <div class="job-card col-md-6 job-listing" data-id="${job.jobID}">
                <div class="card">
                            <div class="card-header">${job.title}</div>
                            <div class="card-body">
                                <h5 class="card-title">${job.industry}</h5>
                                <p class="card-text">${job.description}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
            // add click event for job listing
            $(".job-listing").click(function() {
                const jobID = $(this).data('id');
                window.location.href = '/job.html?id=' + jobID;
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
        var postcode = $("#postcodeSearchBox").val();
        var industry = $("#industrySearchBox").val();
    
        $.ajax({
            url: "/api/jobs/",
            data: {
                page: page,
                postcode: postcode,
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
                    <div class="job-card col-md-6 job-listing" data-id="${job.jobID}">
                            <div class="card">
                                <div class="card-header">${job.title}</div>
                                <div class="card-body">
                                    <h5 class="card-title">${job.industry}</h5>
                                    <p class="card-text">${job.description}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });
    
                // add click event for job listing
                $(".job-listing").click(function() {
                    const jobID = $(this).data('id');
                    window.location.href = '/job.html?id=' + jobID;
                });
            },
            error: function(error) {
                console.error("Error:", error);
            }
        });
    });  
});
    