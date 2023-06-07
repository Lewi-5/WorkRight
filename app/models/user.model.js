const { response } = require('express');
const mysql = require('./db.js');

// constructor
const User = function(newUser) {
    this.aCode = newUser.aCode;
    this.city = newUser.city;
    this.latitude = newUser.latitude;
    this.longitude = newUser.longitude;
    this.kind = newUser.kind;
  };
  
  User.create = (newUser, result) => {
    mysql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') { //trying to send sql duplicate warning
          console.log("denied request to submit an User code or city already present in database");
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
  
  User.findByaCode = (aCode, result) => {
    mysql.query(`SELECT * FROM Users WHERE aCode = ?`, [aCode], (err, res) => {
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
  
      // not found Users with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  User.getAll = (aCode, result) => {
    let query = "SELECT * FROM Users";
  
    if (aCode) {
      query += ` WHERE aCode LIKE '%${aCode}%'`;
    }
  
    mysql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("Users: ", res);
      result(null, res);
    });
  };
  
//   User.getAllKind = (kind, result) => {
//     mysql.query(`SELECT * FROM Users WHERE kind LIKE '%${kind}%'`, (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }
  
//       console.log("Users: ", res);
//       result(null, res);
//     });
//   };
  
  User.updateByaCode = (aCode, User, result) => {
    mysql.query(
      "UPDATE Users SET city = ?, latitude = ?, longitude = ?, kind = ? WHERE aCode = ?",
      [User.city, User.latitude, User.longitude, User.kind, aCode],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Users with the aCode
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated User: ", { aCode: aCode, ...User });
        result(null, { aCode: aCode, ...User });
      }
    );
  };
  
  User.remove = (aCode, result) => {
    mysql.query("DELETE FROM Users WHERE aCode = ?", aCode, (err, res) => {
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
  
      console.log("deleted Users with aCode: ", aCode);
      result(null, res);
    });
  };
  
  User.removeAll = result => {
    mysql.query("DELETE FROM Users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log(`deleted ${res.affectedRows} Users`);
      result(null, res);
    });
  };
  
  module.exports = User;

  // the User.create above works but the one below does not, all that's different is a few 
  // return statements - need to figure out why the below greats multiple headers error
  // but the above does not
  // User.create = (newUser, result) => {
  //   mysql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
  //     if (err) {
  //       if (err.code === 'ER_DUP_ENTRY') { //trying to send sql duplicate warning
  //            result({
  //           message: "Duplicate entry: " + err.sqlMessage
  //         }, null)}
  //       console.log("error: ", err);
  //       result(err, null);
  //       return;
  //     }
  
  //     console.log("created User: ", { ...newUser });
  //     result(null, { ...newUser });
  //   });
  // };