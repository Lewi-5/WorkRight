// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const { response } = require('express');
const mysql = require('./db.js');

// constructor
const User = function(newUser) {
    this.username = newUser.username;
    this.password = newUser.password;
    this.firstName = newUser.firstName;
    this.lastName = newUser.lastName;
  };
  
  User.create = (newUser, result) => {
    mysql.query("INSERT INTO users SET ?", newUser, (err, res) => { // changey make sure table name matches!!!
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') { //trying to send sql duplicate warning
          console.log("denied request to submit a user code or city already present in database");
             return result({
            message: "Duplicate entry: " + err.sqlMessage
          }, null)
        }
        console.log("error: ", err);
        return result(err, null);
        
      }
  
      console.log("created User: ", { ...newUser });
      result(null, { ...newUser });
    });
  };
  
  User.findByid = (id, result) => {
    mysql.query(`SELECT * FROM users WHERE id = ?`, [id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found User: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found users with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  User.getAll = (id, result) => {
    let query = "SELECT * FROM users";
  
    if (id) {
      query += ` WHERE id LIKE '%${id}%'`;
    }
  
    mysql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      //console.log("users: ", res);
      result(null, res);
    });
  };
  
//   User.getAllKind = (kind, result) => {
//     mysql.query(`SELECT * FROM users WHERE kind LIKE '%${kind}%'`, (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }
  
//       console.log("users: ", res);
//       result(null, res);
//     });
//   };
  
User.updateById = (id, patch, result) => {
    mysql.query(
      "UPDATE users SET password = ? WHERE id = ?", // changey table name after UPDATE
      [patch.password, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Users with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated User: ", { id: id, password: patch.password});
        result(null, "your new account details: " + { id: id, password: patch.password}); // why doesnt this get sent as response to patch but the res.send of the controller DOES?
      }
    );
  };
  
  User.remove = (id, result) => {
    mysql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found users with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted users with id: ", id);
      result(null, res);
    });
  };
  
  User.removeAll = result => {
    mysql.query("DELETE FROM users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} users`);
      result(null, res);
    });
  };
  
  module.exports = User;

  // the User.create above works but the one below does not, all that's different is a few 
  // return statements - need to figure out why the below greats multiple headers error
  // but the above does not
  // User.create = (newAirport, result) => {
  //   mysql.query("INSERT INTO users SET ?", newAirport, (err, res) => {
  //     if (err) {
  //       if (err.code === 'ER_DUP_ENTRY') { //trying to send sql duplicate warning
  //            result({
  //           message: "Duplicate entry: " + err.sqlMessage
  //         }, null)}
  //       console.log("error: ", err);
  //       result(err, null);
  //       return;
  //     }
  
  //     console.log("created User: ", { ...newAirport });
  //     result(null, { ...newAirport });
  //   });
  // };