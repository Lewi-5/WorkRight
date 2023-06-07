const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.text());

const jobsController = require('../controllers/jobs.controller');

router
    .route('/jobs')
    .get(jobsController.getJobs);

module.exports = router;
