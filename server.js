const express = require('express');

const app = express();


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./app/routes/api.js")(app);

app.use(express.static('public'));

// set port, listen for requests
const PORT = process.env.PORT || 7077;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

