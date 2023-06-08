const express = require('express');

const app = express();


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('static'));
app.use(express.static('views'));


const apiRouter = require("./app/routes/api.js");
// const jobsRouter = require("./app/routes/jobs.js");

app.use('/api', apiRouter);
// app.use('/jobs', jobsRouter);


// set port, listen for requests
const PORT = process.env.PORT || 7077;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

