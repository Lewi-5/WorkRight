// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const User = require("../models/user.model");

//TODO have not validated that last bid price is higher than database last bid price, seems asynchronous, how to check database before executing UPDATE commnand?
//TODO have not implemented logger yet? morgan? custom logger?

//Create and Save a new User
exports.create = (req, res) => {


    //var isValidResult = isValidPost(req, res);
    //if (isValidResult === true) {
        // Create a User
        const user = new User({
            username: req.body.username, // ! changey you need to put req.body.body.<<property>>
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        // Save User in the database
        User.create(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the User."
                });
            else res.status(201).send(data);
        });
    } 
//};

exports.findAll = (req, res) => {
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

    
    //if (isValidPatch(req, res)) {

        patch = req.body;
        User.updateById(
            req.params.id,
            patch,
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found User with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating User with id " + req.params.id
                        });
                    }
                } else res.status(200).send(true);
            }
        );
   // }


};


//TODO: update validation

// function isValidPost(req, res) {

//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }
//     //console.log("isValid: ",res);
//     if (req.body.id) {
//         res.status(400).send({
//             message: "id is provided by System!!! User not saved ;)",
//             result: false
//         });
//         //console.log("if cond: ",res.send.result);
//         return false;
//     }
//     if (req.body.lastBid) {
//         res.status(400).send({
//             message: "you cannot assign a last bid to a newly created User;)",
//             result: false
//         });
//         //console.log("if cond: ",res.send.result);
//         return false;
//     }
//     if (req.body.lastBidderEmail) {
//         res.status(400).send({
//             message: "you cannot assign a last bidder email to a newly created User;)",
//             result: false
//         });
//         //console.log("if cond: ",res.send.result);
//         return false;
//     }
//     let regex= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     let email = req.body.sellerEmail;
//     if(!email.match(regex)){
//         console.log('denied request to post an invalid seller email');
//         res.status(400).send({
//             message: "Please enter a valid email address",
//             result: false
//         });
//         //console.log("if cond: ",res.send.result);
//         return false;
//     }


//     return true;

// }

// function isValidPatch(req, res) {

//     if (isNaN(req.params.id)){
//         console.log('invalid id format entered');
//         res.status(400).send({
//             message: "ids of Users are always numbers - invalid id format entered",
//             result: false
//         });
        
//         return false;
//     }

    
//     if (req.body.id) {
//         res.status(400).send({
//             message: "you cannot change the id of an existing record ;)",
//             result: false
//         });
        
//         return false;
//     }
//     if (req.body.itemCode) {
//         res.status(400).send({ message: "you cannot update the item code of a record" });
//         return false;
//     }
//     if (req.body.itemDesc) {
//         res.status(400).send({ message: "you cannot update the item description of a record" });
//         return false;
//     }
//     if (req.body.sellerEmail) {
//         res.status(400).send({ message: "you cannot update the seller email of a record" });
//         return false;
//     }

//     let regex= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     let email = req.body.lastBidderEmail;
//     if(!email.match(regex)){
//         console.log('denied request to post an invalid last bidder email');
//         res.status(400).send({
//             message: "Please enter a valid email address",
//             result: false
//         });
//         //console.log("if cond: ",res.send.result);
//         return false;
//     }
//     return true;

// }