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
    mysql.query("INSERT INTO users SET ?", newUser, (err, res) => {// changey make sure table name matches!!!
      if (err){
          console.log("error:", err);
          result(err, null);
          return;
      }
  
      console.log("created user: ", {id: res.insertId, ...newUser});
      result(null, { id: res.insertId, ...newUser });
    });
  };
  


  //FOR login we need to look up the user by username, not by ID
  User.findByUsername = (username, result) => {
    // prevent SQL injection

    console.log("query = "+ username);
    mysql.query('SELECT * FROM users WHERE username = ?', [username], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res.length = "+ res.length);
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }

      // user not found
      result(null, false); // needed to change the order for the callback function
    });
  };
  
  User.findById = (id, result) => {
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
  
  //FIXME: id template literal needs to be replaced by ? 
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