$(document).ready(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')



    $.ajax({
        url: `/jobs/${jobId}`,
        method: 'GET',
        success: function(job) {
          // Populate the HTML elements with the job details
          $('#title').text(job.title);
          $('#description').text(job.description);
          $('#postCode').text(job.postCode);
          $('#industry').text(job.industry);
          $('#salary').text(job.salary);
          $('#type').text(job.type);
          $('#status').text(job.status);
          $('#createDate').text(job.createDate);
        },
        error: function() {
          // Handle error if the request fails
          console.log('Error occurred while fetching job details');
        }
      });
    });
    