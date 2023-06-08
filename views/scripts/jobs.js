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