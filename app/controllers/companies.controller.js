const Company = require('../models/companies.model');
const Auth = require("../utils/auth");

const log = require('npmlog');

// POST /api/company - create a record, name must not be in use, otherwise 209
exports.create = (req, res) => {
    // Create an company
    const company = new Company({
        name : req.body.name,
        description : req.body.description,
        industry : req.body.industry,
        streetNo : req.body.streetNo,
        street : req.body.street,
        city : req.body.city,
        province : req.body.province,
        postcode : req.body.postcode,
        createDate : req.body.createDate,
        lastUpdate : req.body.lastUpdate,
    });
  
    // Save Company in the database
    Company.create(company, (err, data) => {

        if (err){
            //if err.code == "ER_DUP_ENTRY" mean the company already exist in the database
            if(err.code === "ER_DUP_ENTRY"){
                res.status(209).send({message: err.sqlMessage || "Duplicate entry error"});
            }else{
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the company."
                });
            }
        }
        else {
            log.info('WorkRightApp', 'IpAddress: %s add a company %s into database', req.ip || req.connection.remoteAddress, req.body.name);
            res.status(201);
            res.send(data);
        }
    });
};

//  - retrieve a single company data by primary key (id)
exports.findOne = (req, res) => {
console.log("req.params.id " + req.params.id);
    Company.findById(req.params.id, (err, data) => {

        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found company with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                message: "Error retrieving company with id " + req.params.id
                });
            }
        }else{
            res.status(200);
            res.send(data);
        }
    });
};


// PATCH /api/company -  new company name must not be in use, otherwise 209
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    Company.updateById(req.params.id, new Company(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Company with id ${req.params.id}.`
                });
            }else {
                res.status(500).send({
                    message: "Error updating Company with id " + req.params.id
                });
            }
        } else {
            log.info('WorkRight', 'IpAddress: %s updated company: %s ', req.ip || req.connection.remoteAddress,req.body.name);
            res.status(200);
            res.send(data)
        }
      }
    );

};


// GET /api/Company get all Company
exports.findAll = (req, res) => {
    const sortBy = req.query.sortBy ? req.query.sortBy : "id"; // sort by id if no sortOrder provided
    console.log("req.query.sortBy = "+ sortBy);
    Company.getAll(sortBy, (err, data)=>{
        if (err){
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Company."
                });
        }else {
            res.status(200);
            res.send(data);
        }
    })
}

// GET /api/Company get all Company
exports.findJobsByCompanyId = (req, res) => {
console.log("findJobsByCompanyId : req.params.id " + req.params.id);
    Company.findJobsByCompanyId(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Not found jobs with company id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                message: "Error retrieving jobs with company id " + req.params.id
                });
            }
        }else{
            res.status(200);
            res.send(data);
        }
    });
};

// Delete a company with the specified id in the request
exports.delete = (req, res) => {
    Auth.execIfAuthValid(req, res, ['admin'], (req, res, user) => { //FIXME security issue, with an employer credential in e.g. Postman anyone could delete any company, they should only be able to delete their own
    Company.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Company with id ${req.params.id}.`
                });
            }else {
                res.status(500).send({
                    message: "Could not delete Company with id " + req.params.id
                    });
            }
        }else {
            res.status(200);
            res.send({ message: `Company was deleted successfully!` });
        }
      });
      });
};



// get all Companies for Companies.html search page
// TODO: how to randomize the Companies? or sort by date?
exports.getCompanies = (req, res) => {
    let page = req.query.page || 0;
    let offset = page * 10;

    Companies.find(offset, 10, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Companies."
            });
        } else {
            res.send(data);
        }
    });
};

function isValid(params) {
    //validate postcode
    console.log("req.body.postcode = " + req.body.postcode);
    const PosteCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    if (req.body.postcode !== null || req.body.postcode !==""){
        if( !PosteCodeRegex.test(req.body.postcode)){
            res.status(500).send({
                message: "Postcode is not valide."
            });
        }
    }
}