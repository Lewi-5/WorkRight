const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.text());

const users = require("../controllers/user.controller.js");
const jobsController = require('../controllers/jobs.controller');
const companiesController = require('../controllers/companies.controller');


router.route('^/$|/index.html')
  .get((req, res) => {
    res.sendFile('index.html', { root: 'views' });
  });

router
  .route('/users/findName')
  .get(users.findByName)

// ROUTER for USERS
router
    .route('/users')
    .get(users.findAll) // ADMIN only can see all users
    .post(users.create) //mispelling enum got a data truncated message

router
    .route('/users/:id([0-9]+)')
    .get(users.findOne)
    .patch(users.update)
    .delete(users.delete)
    

// user gets their specific account
router
    .route('/users/me')
    .get(users.findMe)



// ROUTER for JOBS
router
    .route('/jobs')
    .get(jobsController.getJobs)
    .post(jobsController.createJob)
    

router
    .route('/jobs/:id([0-9]+)')
    .get(jobsController.getJobById)
    .patch(jobsController.update)
    .delete(jobsController.delete)

router
    .route('/jobs/page/')
    .get(jobsController.adminLoad)

router
    .route('/jobs/page/:id([0-9]+)')
    .get(jobsController.adminPage)

// ROUTER for COMPANIES
router
    .route('/allcompanies')
    .get(companiesController.findAll)

router
    .route('/allcompanies/jobs/:id([0-9]+)')
    .get(companiesController.findJobsByCompanyId)

router
    .route('/companies')
    .post(companiesController.create)

router
  .route('/companies/:id([0-9]+)')
  .get(companiesController.findOne)
  .put(companiesController.update)
  .delete(companiesController.delete)


module.exports = router;
