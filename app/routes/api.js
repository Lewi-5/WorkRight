const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.text());

const users = require("../controllers/user.controller.js");
const jobsController = require('../controllers/jobs.controller');
const companiesController = require('../controllers/companies.controller');

//TODO add .me method in controllers/model
//this retrieves user's specific page if logged in correctly
// router
//     .route('/me')
//     .get(users.me)

//TODO: how to put static files in router? use app.get in server for now
// router
//     .route('../addItem.html')
//     .get()

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

// user gets their specific account
router
    .route('/users/me')
    .get(users.findMe)


router
    .route('/users/:id([0-9]+)')
    .get(users.findOne)
    .patch(users.update)

// ROUTER for JOBS
router
    .route('/jobs')
    .get(jobsController.getJobs)
    .post(jobsController.createJob)

router
    .route('/jobs/:id')
    .get(jobsController.getJobById)

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


module.exports = router;
