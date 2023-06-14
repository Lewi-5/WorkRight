// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const { response } = require('express');
const sql = require('./db.js');


const Job = function(newJob) {
    this.id = newJob.id;
    this.company_id = newJob.company_id;
    this.title = newJob.title;
    this.description = newJob.description;
    this.postcode = newJob.postcode; //wrote it as all lower case one word in test db
    this.industry = newJob.industry; // test db field... will it also be in real db?
    this.salary = newJob.salary;
    this.type = newJob.type;
    this.status = newJob.status;
    this.create_date = newJob.create_date;
    this.last_update = newJob.last_update;
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

        //console.log("jobs: ", res);
        result(null, res);
    });
};

Job.load = (result) => {
    //console.log("job load called in model")
    let query = "SELECT * FROM jobs ORDER BY jobId ASC LIMIT 10";
    
    sql.query(query, (err, data) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      //console.log("jobs: ", data);
      result(null, data);
    });
  };

Job.getTenRows = (jobId, result) => {
    let query;

    let absId = Math.abs(jobId);

    if (jobId < 0){
        query = "SELECT * FROM jobs WHERE jobId < ? ORDER BY jobId DESC LIMIT 10;";
    } else if (jobId > 0){
        query ="SELECT * FROM jobs WHERE jobId > ? ORDER BY jobId LIMIT 10";
    }

  
    sql.query(query, [absId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      //console.log("jobs: ", res);
      result(null, res);
    });
  };
  

Job.findById = (jobId, result) => {
    sql.query(`SELECT * FROM jobs WHERE jobId = ?`, [jobId], (err, res) => { // careful on the WHERE clause, must match for table searched, e.g. we search jobs by 'jobId' not 'id'
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            //console.log("found job: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Job with the id
        result({ kind: "not_found" }, null);
    });
};

Job.updateById = (jobId, data, result) => {
    sql.query(
        "UPDATE jobs SET companyId = ?, title = ?, postCode = ?, industry = ? WHERE jobId = ?", 
        [data.companyId, data.title, data.postCode, data.industry, jobId], 
        (err, res) => {
            if(err){
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // not found Company with the id
                result({ kind: "not_found" }, null);
                return;
            }
            
            console.log("updated Company: ", { jobId: jobId, ...data });
            result(null, { jobId: jobId, ...data });
        });
};

Job.remove = (jobId, result) => {
    sql.query("DELETE FROM jobs WHERE jobId = ?", [jobId], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found todo with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("deleted job with jobId: ", jobId);
      result(null, res);
    });
};


module.exports = Job;