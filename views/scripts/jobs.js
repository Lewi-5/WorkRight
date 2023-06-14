let page = 0;
let currId = 0;

$(document).ready(function() {
    loadJobs();

    $("#signOut").on("click", function() {
        sessionStorage.setItem('username', "");
        sessionStorage.setItem('password', "");
        window.location.href = "../loginTest.html"
    })

    $("#loadMore").click(function() {
        page++;
        loadJobs();
    });

    $(".jobBtn").on("click", function() {
        console.log("button clicked");
        window.location.href = "../job.html?id=" + currId;
    });

    $(".job-listing").on("click", function() {
        const jobID = $(this).data('id');
        window.location.href = '../job.html?id=' + jobID;
    });

    $("#searchBtn").click(function(e) {
        e.preventDefault();
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
                    <div class="job-card col-md-6 job-listing" data-id="${job.jobID}" onclick="selectItem(${job.jobId})">
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

function selectItem(id) {
    window.location.href = '../job.html?id='+id;
}

function loadJobs() {
    var postcode = $("#postcodeSearchBox").val();
    var industry = $("#industrySearchBox").val();
    $.ajax({
        url: '/api/jobs',
        data: {
            page: page,
            postcode: postcode,
            industry: industry
        },
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
        }
        }).done(function(data) {
            data.forEach(job => {
                $('#jobListings').append(`
                <div class="job-card col-md-6 job-listing" data-id="${job.jobId}" onclick="selectItem(${job.jobId})">
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
        });        
}
