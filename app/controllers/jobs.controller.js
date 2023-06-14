const Jobs = require('../models/jobs.model');
const Auth = require("../utils/auth");


function validateJob(job) {
  const industries = ["Medical", "Agriculture", "Finance", "Information", "Catering", "Transportation", "Insurance", "Customer Service"];
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

exports.adminLoad = (req, res) => {

  Jobs.load((err, data) => {
    //console.log("jobs load called");
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving jobs."
      });

    else {
      //console.log("data being sent" + data)
      res.send(data);
    }
  });
}

exports.adminPage = (req, res) => {
  console.log('adminPage called');
  Jobs.getTenRows(req.params.id, (err, data) => { // in this case the id can only be 0 or 1 - 0 means previous 10 records, 1 means next 10 records
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving jobs."
      });
    else res.send(data);
  });
}
exports.getJobById = (req, res) => {
  Jobs.findById(req.params.id, (err, data) => {
    //console.log("the param is" + req.params.id);
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Job with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Job with jobId " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Jobs.updateById(
    req.params.id,
    new Jobs(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Job with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Job with id " + req.params.id
          });
        }
      } else {
        //log.info('WorkRight', 'IpAddress: %s updated Job: %s ', req.ip || req.connection.remoteAddress, req.body.name);
        res.status(200);
        res.send(data)
      }
    }
  );

};

exports.delete = (req, res) => {
  Auth.execIfAuthValid(req, res, ['admin', 'employer'], (req, res, user) => { //FIXME security issue, with an employer credential in e.g. Postman anyone could delete any job posting, they should only be able to delete their own
    Jobs.remove(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Job posting with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Job posting with id " + req.params.id
          });
        }
      } else {
        res.status(200);
        res.send({ message: `Job posting was deleted successfully!` });
      }
    });
  });
};