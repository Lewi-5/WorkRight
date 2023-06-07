const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// TODO: Change over to sequelize 

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// db.users = require("./user.model.js")(sequelize, Sequelize);
// db.companies = require("./company.model.js")(sequelize, Sequelize);
// db.jobs = require("./job.model.js")(sequelize, Sequelize);

// db.users.   (db.companies, { foreignKey: 'userId' });
// db.companies.   (db.users, { foreignKey: 'userId' });

// db.companies.   (db.jobs, { foreignKey: 'companyId' });
// db.jobs.    (db.companies, { foreignKey: 'companyId' });

// hasOne belongsTo hasMany

module.exports = connection;
