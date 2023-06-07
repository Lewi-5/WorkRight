const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.text());

const users = require("../controllers/user.controller.js");

//TODO add .me method in controllers/model
//this retrieves user's specific page if logged in correctly
// router
//     .route('/me')
//     .get(users.me)

//TODO: how to put static files in router? use app.get in server for now
// router
//     .route('../addItem.html')
//     .get()

router
    .route('/users')
    .get(users.findAll)
    .post(users.create) //mispelling enum got a data truncated message
    
router
    .route('/users/:id([0-9]+)')
    .get(users.findOne)
    .patch(users.update)

module.exports = router;
