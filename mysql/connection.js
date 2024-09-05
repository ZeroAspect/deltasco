const mysql = require("mysql2");


async function createConnection(){
  try {
    const connection = await mysql.createPool({
      uri: 'mysql://root:thPLoXhqOjMXtBNcZamgMIwkGsbgqzHj@junction.proxy.rlwy.net:46001/railway'
    })

    console.log("Connected to the database")
    const pool = connection.promise()
    return pool
  } catch (error){
    console.error("Error connecting to the database", error)
    return null
  }
}

module.exports = createConnection