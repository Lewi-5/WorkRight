const Company = require('../models/companies.model');

const log = require('npmlog');

// POST /api/company - create a record, name must not be in use, otherwise 209
exports.create = (req, res) => {
    // Create an company
    const company = new Company({
        name : req.body.name,
        description : req.body.description,
        industry : req.body.industry,
        streetno : req.body.streetno,
        street : req.body.street,
        city : req.body.city,
        province : req.body.province,
        postcode : req.body.postcode,
        ceate_date : req.body.ceate_date,
        last_update : req.body.last_update,
        });
  
    // Save Company in the database
    Company.create(company, (err, data) => {

        if (err){
            //if err.code == "ER_DUP_ENTRY" mean the ID or itemCode id already exist in the database
            if(err.code === "ER_DUP_ENTRY"){
                res.status(209).send({message: err.sqlMessage || "Duplicate entry error"});
            }else{
                res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the company."
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

    Company.updateById(
      req.params.id,
      new Company(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Company with id ${req.params.id}.`
            });
          } else {
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
    Company.getAll(sortBy, (err, data)=>{
    if (err)
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving Company."
    });
    else {
    res.status(200);
    res.send(data);
    }
    })
}

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