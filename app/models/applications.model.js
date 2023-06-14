

const { response } = require('express');
const sql = require('./db.js');

const Application = function (newApplication) {
    this.fullname = newApplication.fullname;
    this.email = newApplication.email;
    this.phone = newApplication.phone;
    this.applied = newApplication.applied;
    this.resume = newApplication.resume;
};

Application.create = (newApplication, result) => {
    sql.query("INSERT INTO applications SET ?", newApplication, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created application: ", { id: res.insertId, ...newApplication });
        result(null, { id: res.insertId, ...newApplication });
    });
};

module.exports = Application;