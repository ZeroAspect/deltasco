const express = require("express")
const app = require("./config/config.js");
const hbs = require("express-handlebars")
const path = require("path");
const GetIP = require("./tools/ip.js");
const createConnection = require("./mysql/connection.js");
const User = require("./data/User.js");


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', async(req, res)=>{
  const mysql = createConnection()
  const ip = await GetIP()
  try {
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    console.log(user)
    if(user === null){
      console.error("Nenhum usuario encontrado no IP", ip.ip)
      res.redirect('/login')
    } else {
      res.render('home')
      console.log("Usuario encontrado no IP", ip.ip)
    }
  } catch (error) {
    console.log("Houve um erro:", error)
  }
  
})

app.get('/login', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    if(user !== null){
      res.redirect('/')
    } else {
      res.render('login')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.post('/login', async(req, res)=>{
  const ip = await GetIP()
  const { email, password } = await req.body
  try{
    const user = await User.findOne({
      where: {
        email: email,
        password: password
      }
    })
    if(user === null){

      res.redirect('/login')
    } else {
      const newUser = User.update(
        { ip: ip.ip },
        {
          where: {
            email: email,
            senha: senha
          },
        },
      )
      res.redirect('/')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})