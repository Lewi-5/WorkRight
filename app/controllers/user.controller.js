// ctrl+F 'changey' for some of the easier to miss fields that need to be changed for a new model

const User = require("../models/user.model");
const Auth = require("../utils/auth");


//TODO have not validated that last bid price is higher than database last bid price, seems asynchronous, how to check database before executing UPDATE commnand?
//TODO have not implemented logger yet? morgan? custom logger?

//Create and Save a new User
exports.create = function (req, res) {
        if (req.body.role == 'admin') {
            Auth.execIfAuthValid(req, res, ['admin'], (req, res, user) => { // we check to make sure only admins are making admins
                
            });
        } else
    
        isUserValid(req, res, false, function (result) {
            if (!result) {

                // user submitted invalid data, though username may not be taken
                // res.status(400).send({ message: "Invalid user data" });
                return;
            } else {

                // Create a User
                // TODO: encrypt the password SHA256
                const user = new User({
                    username: req.body.username,
                    password: Auth.hash(req.body.password),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    // FIXME: only admin can create admins, anonymous registration only creates users
                    role: req.body.role || 'User', // need to think how this works - does role input appear ? where? where does admin see it?
                    industry: req.body.industry || 'Finance'
                });

                // Save user in the database
                User.create(user, (err, data) => {
                    if (err)
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the User."
                        });
                    else {
                        delete data['password'];
                        res.status(201).send(data); // better to send data.id only
                    }
                });
            }
        });
    
};

exports.findMe = (req, res) => {
    Auth.execIfAuthValid(req, res, ['user', 'admin'], (req, res, user) => { // null because no roles in the todos project
        res.status(200).send(user);
    });
};

// only admin can see all users
exports.findAll = (req, res) => {
    Auth.execIfAuthValid(req, res, ['admin'], (req, res, user) => {
        // not sure why the below was here, was the original 
        // copy paste source trying to use getAll to also get specific Ids??
        //console.log("req.query.username = " + req.query.username);
        //const id = req.query.id;

        // Auth.execIfAuthValid(req, res, ['admin'], (req, res, user) => { // remeber to make the role an array e.g. ['admin']
        // res.status(200).send(user);

        User.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Users."
                });
            else res.send(data);
        });
    });
    // });
};

//find a user by username
exports.findByName = (req, res) => {
    //console.log("req.query.username = " + req.query.username);
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
        } else {
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
    Auth.execIfAuthValid(req, res, ['admin', 'user'], (req, res, user) => {

        //console.log(req.body);
        isUserValid(req, res, true, function (result) {
            if (!result) {
                console.log('invalid data !result')
                // user submitted invalid data, though username may not be taken
                // res.status(400).send({ message: "Invalid user data" });
                return;
            } else {
                //console.log('invalid data true result')
                // let password = req.body.password;
                // let updateObj = req.body;
                let id = req.params.id;
                let passHash = Auth.hash(req.body.password);
                // updateObj[password] = passHash;
                User.updateById(
                    id,
                    {
                        username: req.body.username,
                        password: passHash,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        role: req.body.role,
                        industry: req.body.industry
                    },
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
                        } else res.status(200).send({ ...data });
                    }
                );

            }
        });
    });
};

exports.delete = (req, res) => {
    console.log("headers 1st time: " + req.headers)
    Auth.execIfAuthValid(req, res, ['admin'], (req, res, user) => {
        User.remove(req.params.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete user with id " + req.params.id
                    });
                }
            } else res.status(200).send({ message: true });
        });
    });
};


//TODO: update validation
// -cannot be empty
// password requirements??
// first name and last name cannot be empty
// white spaces checked?

function isUserValid(req, res, isUpdate, callback) {
    //console.log("isValid: ",res);

    // validate to make sure the request has all the necessary properties
    const industryArr = ['Medical','Agriculture','Finance','Information','Catering','Transportation','Insurance','Customer Service'];
    const userProps = ['username', 'password', 'firstName', 'lastName']; // we dont need 'role' because the controller defaults to 'user' role, ditto industry and finance

    let reqProps = Object.keys(req.body);

    let allPropsInReq = userProps.every(prop => reqProps.includes(prop))

    if (!allPropsInReq) {
        res.status(400).send({
            message: "You are missing some required fields"
        });
        callback(false);
        return;
    }

    if (someEmpty(req.body)) {
        console.log(req.body);
        res.status(400).send({
            message: "you left a required field empty"
        });
        callback(false);
        return;
    }

    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by the system. User not saved",
            result: false
        });
        //console.log("if cond: ",res.send.result);
        callback(false);
        return;
    }
    // console.log(JSON.stringify(req.body));
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).send({ message: "username and password must be provided" });
        callback(false);
        return;
    }
    // FIXME: verify quality of password (length 8+, at least one uppercase, lowercase, digit, and special character)
    // FIXME: username must not exist yet, check database, may require you add a callback to this method instead of returning a value
    let username = req.body.username;
    if (!username.match(/^[a-zA-Z0-9_]{5,45}$/)) {
        res.status(400).send({ message: "username must be 5-45 characters long made up of letters, digits and underscore" });
        callback(false);
        return;
    }
    if (req.body.role !== undefined) {
        if (req.body.role != "user" && req.body.role !== "admin" && req.body.role !== "employer") {
            res.status(400).send({ message: "Role must be User or Admin or Employer" });
            callback(false);
            return;
        }
    }
    if (req.body.industry !== undefined) {
        if (!industryArr.includes(req.body.industry )) {
            res.status(400).send({ message: "Industry not valid" });
            callback(false);
            return;
        }
    }

    if (!isUpdate) {

        User.findByUsername(req.body.username, function (err, exists) {
            //console.log(req.body.username);
            if (err) {
                // Handle error case
                res.status(500).send({ message: "Error occurred while checking username" });
                return;
            }

            if (exists) {
                res.status(400).send({ message: "Username already exists" });
                return;
            }

            // Username is valid and does not exist in the database
            callback(true);
        });
    } else {
        callback(true);
    }
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

    if (isNaN(req.params.id)) {
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