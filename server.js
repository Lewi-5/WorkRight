const express = require('express');
const app = express();
const PORT = process.env.PORT || 7077;
const dbConfig = require("./app/models/db.js");

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(express.static('public'));

// const apiRouter = require('./app/routes/api');

// app.use('/api', apiRouter);



app.listen(PORT, () => {
  console.log(`The server is now running on ${PORT}`);
});

