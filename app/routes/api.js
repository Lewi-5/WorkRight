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

// ROUTER for USERS
router
    .route('/users')
    .get(users.findAll)
    .post(users.create) //mispelling enum got a data truncated message

router
    .route('/users/:id([0-9]+)')
    .get(users.findOne)
    .patch(users.update)

// ROUTER for JOBS
router
    .route('/jobs')
    .get(jobsController.getJobs);

// ROUTER for COMPANIES
router
    .route('/companies')
    .get(companiesController.findAll)
    .post(companiesController.create)

router
  .route('/companies/:id([0-9]+)')
  .get(companiesController.findOne)
  .put(companiesController.update)

  //ROUTER for LOGIN
  // router
  //     .route('/users/me')
  //     .get(users.findMe)


module.exports = router;
