$(document).ready(function () {

    const jobId = 

    $.ajax({
        url: `/jobs/${jobId}`,
        method: "GET",
        success: function (job){

        }
    })
})