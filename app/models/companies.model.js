// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const { response } = require('express');
const sql = require('./db.js');


const Company = function(company) {
    this.name = company.name;
    this.description = company.description; 
    this.industry = company.industry; 
    this.streetNo = company.streetno;
    this.street = company.street;
    this.city = company.city;
    this.province = company.province;
    this.postcode = company.postcode;
    this.createDate = company.createDate;
    this.lastUpdate = company.lastUpdate;
};


// POST /api/Company - create a record, 
Company.create = (newData , result) =>{
    sql.query("INSERT INTO companies set ?", newData, (err, res)=>{
        if(err){
            console.log("error: ",err);
            if (err.code === "ER_DUP_ENTRY") {
                result({ message: err.sqlMessage }, null);
                return;
            }
            console.log("error: ",err);
            result(err, null);
            return;
        }
        
// console.log("create new Company: ", {id: result.insertCode, ...newData});
        result(null, {id: result.insertCode, ...newData});
    });
}


//FIXME: id template literal needs to be replaced by ? 
Company.findById = (id, result) =>{

    sql.query(`SELECT * FROM companies WHERE id = ${id}`, (err, res) =>{
        if(err){
            console.log("error: " ,err);
            result(err, null);

        }
        if(res.length){
            
            result(null, res[0]);
            return;
        }
  console.log("result.length: ", res.length);
        result({kind: "not_found"}, null);
    });
}


Company.findJobsByCompanyId = (id, result) =>{
    console.log("id = " + id);
    sql.query(`select b.name as name, jobId, title, a.description, a.postCode, a.industry, salary, type, status, a.createDate from jobs a, companies b where a.companyId = b.ID and b.id = ${id}`, (err, res) =>{
        if(err){
            console.log("error: " ,err);
            result(err, null);

        }
console.log("res.length" + res.length);
        if(res.length){
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
}

Company.remove = (id, result) => {
    sql.query("DELETE FROM companies WHERE id = ?", id, (err, res) => {
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
      console.log("deleted Company with id: ", id);
      result(null, res);
    });
};



// PATCH /api/Company
Company.updateById = (id, data, result) => {
    sql.query(
        "UPDATE companies SET name = ?, description = ?, industry = ?, streetNo = ?, street = ?, city = ?, province = ?, lastUpdate = ? WHERE id = ?", 
        [data.name, data.description, data.industry, data.street_no , data.street, data.city, data.province, data.lastUpdate, id], 
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
            
            console.log("updated Company: ", { id: id, ...data });
            result(null, { id: id, ...data });
        });
};

Company.getAll = (sortby, result) =>{
    var query = sql.format("SELECT * FROM companies ORDER BY ?? ", [sortby]);
    sql.query(query, (err, res) => {
        if(err){
            console.log("error: " ,err);
            retult(err, null);
            return;
        }
        result(null, res);
    });
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