const Application = require('../models/applications.model');

function validateApplication(application) {
  if (!application.fullname || application.fullname.trim() === '') return 'Full name is required.';
  if (!application.email || application.email.trim() === '') return 'Email is required.';
  if (!application.phone || application.phone.trim() === '') return 'Phone number is required.';
  if (application.applied == null) return 'Application status is required.';
  if (!application.resume || application.resume.trim() === '') return 'Resume is required.';
  return null;
}

exports.submitApplication = (req, res) => {
  const errorMessage = validateApplication(req.body);
  if (errorMessage) {
    res.status(400).send({ message: errorMessage });
    return;
  }

  let maxSize = 5000000;
  if (Buffer.byteLength(req.body.data, 'base64') > maxSize) {
    res.status(400).send({ message: `Data exceeds max size of ${maxSize} bytes.` });
    return;
  }

  const newApplication = new Application({
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    // applied: req.body.applied,
    title: req.body.title,
    data: Buffer.from(req.body.data, 'base64'),
    mimeType: req.body.mimeType || 'Pending'
  });

  Application.create(newApplication, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Internal error occurred making the Application."
      });
    else res.send(data);
  });
};

