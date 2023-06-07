const Jobs = require('../models/jobs.model');






// get all jobs for jobs.html search page
// TODO: how to randomize the jobs? or sort by date?
exports.getJobs = (req, res) => {
    let page = req.query.page || 0;
    let offset = page * 10;

    Jobs.find(offset, 10, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving jobs."
            });
        } else {
            res.send(data);
        }
    });
};