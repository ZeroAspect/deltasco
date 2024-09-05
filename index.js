const app = require("./config/config.js");
const hbs = require("express-handlebars")
const path = require("path")
require("./routes.js")

app.engine('handlebars', hbs.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.listen(3000, ()=>{
  console.log("Server running on host http://localhost:3000")
})