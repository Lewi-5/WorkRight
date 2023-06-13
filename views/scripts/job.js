$(document).ready(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    
    $("#signOut").on("click", function() {
      sessionStorage.setItem('username', "");
      sessionStorage.setItem('password', "");
      window.location.href = "http://localhost:7077/logintest.html"
  })

    $.ajax({
        url: "/api/jobs/"+id,
        method: 'GET',
        dataType: "json",
        success: function(job) {
          if(job.createDate){
            var datetime = new Date(job.createDate);
            var formattedDatetime = datetime.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
          // Populate the HTML elements with the job details
          $('#title').text(job.title);
          $('#description').text(job.description);
          $('#postCode').text(job.postCode);
          $('#industry').text(job.industry);
          $('#salary').text(job.salary);
          $('#type').text(job.type);
          $('#status').text(job.status);
          $('#createDate').text(formattedDatetime);
        },
        error: function() {
          // Handle error if the request fails
          console.log('Error occurred while fetching job details');
        }
      });
    });
    