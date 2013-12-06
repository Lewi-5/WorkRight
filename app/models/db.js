const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// TODO: Change over to sequelize for ORM and to prevent SQL injection

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
// });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;


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

module.exports = connection;


// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.users = require("./user.model.js")(sequelize, Sequelize);
// db.companies = require("./company.model.js")(sequelize, Sequelize);
// db.jobs = require("./job.model.js")(sequelize, Sequelize);

// db.users.   (db.companies, { foreignKey: 'userId' });
// db.companies.   (db.users, { foreignKey: 'userId' });

// db.companies.   (db.jobs, { foreignKey: 'companyId' });
// db.jobs.    (db.companies, { foreignKey: 'companyId' });

// hasOne belongsTo hasMany

