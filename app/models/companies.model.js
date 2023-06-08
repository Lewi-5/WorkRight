// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const { response } = require('express');
const sql = require('./db.js');


const Company = function(newCompany) {
    // this.id = newCompany.id;
    this.company_id = newCompany.company_id;
    this.title = newCompany.title;
    // this.description = newCompany.description;
    this.postcode = newCompany.post_code; //wrote it as all lower case one word in test db
    this.industry. newCompany.industry; // test db field... will it also be in real db?
    // this.salary = newCompany.salary;
    // this.type = newCompany.type;
    // this.status = newCompany.status;
    // this.create_date = newCompany.create_date;
    // this.last_update = newCompany.last_update;
};




Company.find = (offset, limit, result) => {
    sql.query(`SELECT * FROM companies LIMIT ${limit} OFFSET ${offset}`, (err, res) => { // changey dont forget to change the table name
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Company: ", res);
        result(null, res);
    });
};

module.exports = Company;