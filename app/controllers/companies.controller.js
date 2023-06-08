

const Companies = require('../models/companies.model');






// get all Companies for Companies.html search page
// TODO: how to randomize the Companies? or sort by date?
exports.getCompanies = (req, res) => {
    let page = req.query.page || 0;
    let offset = page * 10;

    Companies.find(offset, 10, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Companies."
            });
        } else {
            res.send(data);
        }
    });
};