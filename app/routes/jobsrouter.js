const express = require('express');
const router = express.Router();
const jobsController = require('./controllers/jobs.controller');

router.get('/jobs', jobsController.getJobs);

module.exports = router;
