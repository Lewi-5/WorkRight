
$(document).ready(function () {
    //get company id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    refreshJobList(id);

    $.ajax({
        url:"/api/companies/"+id,
        type:"GET",
        dataType:"json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
    }).done(function(company){
        $("#companyTitle").html(company.name);
    });
});

//refreshJobList
function refreshJobList(id) {
    //http://localhost:7077/api/allcompanies/jobs/29
    $.ajax({
        url:"/api/allcompanies/jobs/"+id,
        type:"GET",
        dataType:"json",
        error: function (jqxhr, status, errorThrown) {
            alert("AJAX error: " + jqxhr.responseText);
            }
    }).done(function(jobs){
        jobs.forEach(job => {
            var datetime = new Date(job.createDate);
                var formattedDatetime = datetime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            $('#jobListings').append(`
            <div class="job-card col-md-6 job-listing" data-id="${job.jobId}" onclick="selectItem(${job.jobId})">
            <div class="card">
                        <div class="card-header">The job title is: ${job.title}</div>
                        <div class="card-body">
                            <h5 class="card-title">This job is in ${job.industry} industry</h5>
                            <p class="card-text">Job descriptiong as :${job.description}</p>
                            <p class="card-text">Salary is : $${job.salary}/hour</p>
                            <p class="card-text">Job type is : ${job.type}</p>
                            <p class="card-text">This job status is : ${job.status}</p>
                            <p class="card-text">Create at : ${job.formattedDatetime}</p>
                        </div>
                    </div>
                </div>
            `);
        });

        $("#sumery").text(jobs[0].name + " have " + jobs.length + " jobs posted as following:");
        $("#listTable").html(result);
    });
}


