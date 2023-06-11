const Jobs = require('../models/jobs.model');


exports.createJob = (req, res) => {
    const newJob = new Job({
        company_id: req.body.company_id,
        title: req.body.title,
        postcode: req.body.postcode,
        industry: req.body.industry
    });

    Jobs.create(newJob, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the job."
            });
        } else {
            res.send(data);
        }
    });
};



// get all jobs for jobs.html search page
// TODO: default sort by date posted
exports.getJobs = (req, res) => {
    let page = req.query.page || 0;
    let offset = page * 10;
    let location = req.query.location;
    let industry = req.query.industry;

    // Pass the search parameters to the find function
    Jobs.find(offset, 10, location, industry, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving jobs."
            });
        } else {
            res.send(data);
        }
    });
};