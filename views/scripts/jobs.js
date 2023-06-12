let page = 0;
let currId = 0;

$(document).ready(function() {
    loadJobs();

    $("#loadMore").click(function() {
        page++;
        loadJobs();
    });

    $(".jobBtn").on("click", function() {
        console.log("button clicked");
        window.location.href = "http://localhost:7077/job.html?id=" + currId;
    });

    //doesn't word this way, job_listing doesn't trigger click event
    $(".job-listing").on("click", function() {
        const jobID = $(this).data('id');
console.log("this = "+this);
console.log("$(this).data('id') = "+$(this).data);

        window.location.href = './job.html?id=' + jobID;
    });
});

function selectItem(id) {
    window.location.href = './job.html?id='+id;
    //console.log(id);
    // $.ajax({
    //     url: "/api/jobs/" + id,
    //     //headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
    //     type: "GET",
    //     dataType: "json",
    //     error: function (jqxhr, status, errorThrown) {
    //         alert("AJAX error: " + jqxhr.responseText);
    //     }
    // }).done(function (job) {
    //     currId = id;
        
       
    // });
}

function loadJobs() {
    $.ajax({
        url: '/api/jobs?page=' + page,
        type: "GET",
        dataType: "json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            //FIXME
            // add click event for job listing
        }
        }).done(function(data) {
            //console.log(data);
            //<div class="job-card col-md-6 job-listing" data-id="${job.jobId}" onmouseover="selectItem(${job.jobId})">'>
                
            data.forEach(job => {
                $('#jobListings').append(`
                <div class="job-card col-md-6 job-listing" data-id="${job.jobId}" onclick="selectItem(${job.jobId})">
                <div class="card">
                            <div class="card-header">${job.title}</div>
                            <div class="card-body">
                                <h5 class="card-title">${job.industry}</h5>
                                <p class="card-text">${job.description}</p>
                                <button class="jobBtn">Learn More</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        });
        
}


// $(document).ready(function () {
//     $("#searchForm").on("submit", function(e) {
//         e.preventDefault();  // prevent the default form submission
//         page = 0; // reset to 0
//         var postcode = $("#postcodeSearchBox").val();
//         var industry = $("#industrySearchBox").val();
    
//         $.ajax({
//             url: "/api/jobs/",
//             data: {
//                 page: page,
//                 postcode: postcode,
//                 industry: industry
//             },
//             type: "GET",
//             dataType: "json",
//             success: function(jobs) {
//                 // clear current listings
//                 $("#jobListings").empty();
    
//                 // append new listings
//                 jobs.forEach(job => {
//                     $("#jobListings").append(`
//                     <div class="job-card col-md-6 job-listing" data-id="${job.jobID}">
//                             <div class="card">
//                                 <div class="card-header">${job.title}</div>
//                                 <div class="card-body">
//                                     <h5 class="card-title">${job.industry}</h5>
//                                     <p class="card-text">${job.description}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     `);
//                 });
    
//                 // add click event for job listing
//                 $(".job-listing").click(function() {
//                     const jobID = $(this).data('id');
//                     window.location.href = '/job.html?id=' + jobID;
//                 });
//             },
//             error: function(error) {
//                 console.error("Error:", error);
//             }
//         });
//     });  
// });
    