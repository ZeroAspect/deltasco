const express = require("express")
const app = require("./config/config.js");
const hbs = require("express-handlebars")
const path = require("path");
const GetIP = require("./tools/ip.js");
const createConnection = require("./mysql/connection.js");
const User = require("./data/User.js");
const { marked } = require("marked");
const Post = require("./data/Post.js");


app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', async(req, res)=>{
  const mysql = await createConnection()
  const ip = await GetIP()
  try {
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    // console.log(user)
    const notify = {
      success: {
        title: "Login realizado com sucesso!",
        message: `Login realizado com sucesso por ${ip.ip}`
      },
      error: {
        title: "Erro ao realizar login!",
        message: "Houve um erro ao realizar o login com este IP"
      }
    }
    if(user === null){
      console.error("Nenhum usuario encontrado no IP", ip.ip)
      // console.log(notify.error.message)
      res.redirect('/login')
    } else {
      console.log("Usuario encontrado no IP", ip.ip)
      const [ posts, results ] = await mysql.query(`SELECT * FROM Posts ORDER BY id DESC`)
      console.log(posts)

      res.render('home', { posts })
      // console.log(notify.success.message)
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
  const { email, senha } = await req.body
  console.log(req.body)
  try{
    const user = await User.findOne({
      where: {
        email: email,
        senha: senha
      }
    })
    if(user === null){

      res.redirect('/login')
    } else {
      const newUser = await User.update(
        { ip: ip.ip },
        {
          where: {
            email: email,
            senha: senha
          },
        },
      )
      console.log(newUser)
      res.redirect('/')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.get('/cadastro', async(req, res)=>{
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
      res.render('cadastro')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.post('/cadastro', async(req, res)=>{
  const ip = await GetIP()
  try{
    const {
      nome,
      email,
      senha,
      descricao
    } = await req.body
    console.log(req.body)
    const removeSpaces = nome.replace(' ', '')
    const nameFormated = removeSpaces.toLowerCase()
    const user = await User.findOne({
      where: {
        nome: nameFormated,
        email: email
      }
    })

    if(user === null){
      const newUser = await User.create({
        nome: nameFormated,
        email: email,
        senha: senha,
        descricao: marked(descricao),
        ip: ip.ip
      })
      console.log(newUser)
      res.redirect('/')
    } else {
      const validation = `
      <div class="alert alert-danger" role="alert">
        <h4>Cuidado!</h4>
        <p>
          Preencha dados ainda não usados.
        </p>
        <hr>
        <p class="mb-0">Crie um nome de usuario que ainda não foi usado.</p>
      </div>
      `
      res.render('cadastro', { validation })
    }
 
    
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.get('/publicar', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else {
      res.render('publicar')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})

app.post('/publicar', async(req, res)=>{
  const ip = await GetIP()
  try{
    const {
      titulo,
      conteudo,
      fonte
    } = await req.body
    console.log(req.body)
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    if(user === null){
      res.redirect('/login')
    } else {
      const newPost = await Post.create({
        nome: user.nome,
        titulo: titulo,
        conteudo: marked(conteudo),
        fonte: fonte
      })
      console.log(newPost)
      res.redirect('/')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})