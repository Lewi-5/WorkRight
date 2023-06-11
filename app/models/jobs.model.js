// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const { response } = require('express');
const sql = require('./db.js');


const Job = function(newJob) {
    // this.id = newJob.id;
    this.company_id = newJob.company_id;
    this.title = newJob.title;
    // this.description = newJob.description;
    this.postcode = newJob.postcode; //wrote it as all lower case one word in test db
    this.industry = newJob.industry; // test db field... will it also be in real db?
    // this.salary = newJob.salary;
    // this.type = newJob.type;
    // this.status = newJob.status;
    // this.create_date = newJob.create_date;
    // this.last_update = newJob.last_update;
};


Job.create = (newJob, result) => {
    sql.query("INSERT INTO jobs SET ?", newJob, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created job: ", { id: res.insertId, ...newJob });
        result(null, { id: res.insertId, ...newJob });
    });
};


// find based on postcode and/or industry
Job.find = (offset, limit, postcode, industry, result) => {
    // Build the query dynamically based on the search parameters
    let query = "SELECT * FROM jobs";
    let params = [];

    if(postcode || industry) {
        query += " WHERE";
        if(postcode) {
            query += " postcode LIKE ?";
            params.push('%' + postcode + '%');
        }
        if(industry) {
            if(postcode) query += " AND";
            query += " industry = ?";
            params.push(industry);
        }
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    sql.query(query, params, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("jobs: ", res);
        result(null, res);
    });
};


module.exports = Job;