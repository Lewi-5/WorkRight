const { response } = require('express');
const sql = require('./db.js');


const Job = function(newJob) {
    this.id = newJob.id;
    this.company_id = newJob.company_id;
    this.title = newJob.title;
    this.description = newJob.description;
    this.post_code = newJob.post_code;
    this.salary = newJob.salary;
    this.type = newJob.type;
    this.status = newJob.status;
    this.create_date = newJob.create_date;
    this.last_update = newJob.last_update;
};




Job.find = (offset, limit, result) => {
    sql.query(`SELECT * FROM jobs LIMIT ${limit} OFFSET ${offset}`, (err, res) => {
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