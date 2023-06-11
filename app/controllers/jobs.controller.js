const Jobs = require('../models/jobs.model');


// validation function
function validateJob(job) {
    const industries = ["Finance", "Chemical", "Agriculture", "Transportation", "Manufacturing", "Jewelry", "Publishing", "Technology", "Automotive", "Education", "Hospitality"];
    if (!job.title || job.title.trim() === '') return 'Job title is required.';
    if (!job.postcode || job.postcode.trim() === '' || job.postcode.trim().length > 6) return 'Valid Postcode is required.';
    if (!job.industry || !industries.includes(job.industry)) return `Industry is required and should be one of the following values: ${industries.join(', ')}.`;
    return null;
}

exports.createJob = (req, res) => {
    const newJob = new Job({
        company_id: req.body.company_id,
        title: req.body.title,
        postcode: req.body.postcode,
        industry: req.body.industry
    });

    const validationError = validateJob(newJob);
    if (validationError) {
        res.status(400).send({ message: validationError });
        return;
    }

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
    let postcode = req.query.postcode;
    let industry = req.query.industry;

    // Pass the search parameters to the find function
    Jobs.find(offset, 10, postcode, industry, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving jobs."
            });
        } else {
            res.send(data);
        }
    });
};