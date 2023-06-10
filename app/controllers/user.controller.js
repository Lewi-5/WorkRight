// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const User = require("../models/user.model");

//TODO have not validated that last bid price is higher than database last bid price, seems asynchronous, how to check database before executing UPDATE commnand?
//TODO have not implemented logger yet? morgan? custom logger?

//Create and Save a new User
exports.create = (req, res) => {


    var isValidResult = isValidPost(req, res);
    console.log('isValidResult',isValidResult);
    if (isValidResult === true) {
        console.log('Creating a new user...');
        // Create a User
        const user = new User({
            username: req.body.username, // ! changey you need to put req.body.body.<<property>>
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        // Save User in the database
        User.create(user, (err, data) => {
            if (err){
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the User."
                });
                
            }else{ 
                delete data['password'];
                res.status(201).send(data);
            }
        });
    } return false;
};

exports.findAll = (req, res) => {
console.log("req.query.username = " + req.query.username);


    const id = req.query.id;
  
    User.getAll(id, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      else res.send(data);
    });
  };

//find a user by username
exports.findByName = (req, res) => {
console.log("req.query.username = " + req.query.username);
    const userName = req.query.username;
    User.findByUsername(userName, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(405).send({
                message: `Not found user with name ${userName}.`
                });
            } else {
                res.status(500).send({
                message: "Error retrieving company with name " + userName
                });
            }
        }else{
            res.status(200);
            res.send(data);
        }
    });
};

//Find a single User by the id
exports.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found User with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with id " + req.params.id
                });
            }
        } else res.status(200).send(data);
    });
};

//Update a User by id
exports.update = (req, res) => {
    // Validate Request
    /* if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
 */
    console.log(req.body);

    
    if (isValidPatch(req, res)) {

        patch = req.body;
        let id = req.params.id;
        User.updateById(
            id,
            patch,
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found User with id ${id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating User with id " + id
                        });
                    }
                } else res.status(200).send(`your new account details for account with id ${id}: new password ${patch.password}`); // why does this get sent as response to patch but not the results of the model updatebyId?
            }
        );
   }


};


//TODO: update validation
// -cannot be empty
// password requirements??
// first name and last name cannot be empty
// white spaces checked?


function isValidPost(req, res) {

    // TODO: i dont think we need to check if the body is empty because it is a special case of someEmpty, but double check this is true
    // if (!req.body) {
    //     res.status(400).send({
    //         message: "Content can not be empty!"
    //     });
    // }

    if (someEmpty(req.body)){
        console.log(req.body);
        res.status(400).send({
            message: "you left a required field empty"
        });
        return false;// remember to return false or your server will send headers twice and crash
    }

    //console.log("isValid: ",res);
    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by System!!! User not saved ;)",
            result: false
        });
        //console.log("if cond: ",res.send.result);
        return false;
    }

    // let regex= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // let email = req.body.sellerEmail;
    // if(!email.match(regex)){
    //     console.log('denied request to post an invalid seller email');
    //     res.status(400).send({
    //         message: "Please enter a valid email address",
    //         result: false
    //     });
    //     //console.log("if cond: ",res.send.result);
    //     return false;
    // }


    return true;

}

function someEmpty(obj) {
    for (let prop in obj) {
      if (obj[prop] === "" || obj[prop] === null || obj[prop] === undefined) {
        return true;
      }
    }
    return false;
  }; 

//TODO: what should we be allowed to patch in a given row?
// username should be unique, password can change, first and last name cannot change

function isValidPatch(req, res) {

    if (isNaN(req.params.id)){
        console.log('invalid id format entered');
        res.status(400).send({
            message: "ids of Users are always numbers - invalid id format entered",
            result: false
        });
        
        return false;
    }

    
    if (req.body.id) {
        res.status(400).send({
            message: "you cannot change the id of an existing record ;)",
            result: false
        });
        
        return false;
    }
    if (req.body.username) {
        res.status(400).send({ message: "you cannot change your username" });
        return false;
    }
    if (req.body.firstName) {
        res.status(400).send({ message: "you cannot change your first name" });
        return false;
    }
    if (req.body.lastName) {
        res.status(400).send({ message: "you cannot change your last name" });
        return false;
    }

    // let regex= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // let email = req.body.lastBidderEmail;
    // if(!email.match(regex)){
    //     console.log('denied request to post an invalid last bidder email');
    //     res.status(400).send({
    //         message: "Please enter a valid email address",
    //         result: false
    //     });
    //     //console.log("if cond: ",res.send.result);
    //     return false;
    // }
    return true;

}