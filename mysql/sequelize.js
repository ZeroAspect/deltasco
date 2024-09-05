const { Sequelize } = require("sequelize");

const db = new Sequelize('mysql://root:thPLoXhqOjMXtBNcZamgMIwkGsbgqzHj@junction.proxy.rlwy.net:46001/railway')

module.exports = db;