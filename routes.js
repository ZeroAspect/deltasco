const express = require("express")
const app = require("./config/config.js");
const hbs = require("express-handlebars")
const path = require("path");
const GetIP = require("./tools/ip.js");
const createConnection = require("./mysql/connection.js");
const User = require("./data/User.js");
const { marked } = require("marked");
const Post = require("./data/Post.js");
const Comentarios = require("./data/Comentarios.js");


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
app.get('/perfil', async(req, res)=>{
  const mysql = await createConnection()
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
      const user_id = user.id
      const [ row, results ] = await mysql.query(`SELECT * FROM Users WHERE id = '${user_id}'`)
      res.render('profile', { row })
    }
  } catch (error){
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
app.get('/post/:id', async(req, res)=>{
  const mysql = await createConnection()
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
      const post_id = req.params.id
      const post = await Post.findOne({
        where: {
          id: post_id
        }
      })
      if(post === null){
        res.render('error_post_not_localized')
      } else {
        const [ row, results ] = await mysql.query(`SELECT * FROM Posts WHERE id = '${post_id}'`)
        const [ comentario, response ] = await mysql.query(`SELECT * FROM Comentarios WHERE post_id = '${post_id}' ORDER BY id DESC`)
        res.render('post', { row, comentario })
      }
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.post('/post/:id/likes', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    if(user === null){
      res.status(401).json({ error: 'Unauthorized' })
    } else {
      const post_id = req.params.id
      const post = await Post.findOne({
        where: {
          id: post_id
        }
      })
      if(post === null){
        res.redirect('/login')
      } else {
        const post_like = await Post.update({
          post_likes: post.post_likes + 1
        },
        {
          where: {
            id: post_id
          }
        })
        console.log(post_like)
        res.status(200).redirect(`/`)
      }
    }
  } catch (error){
    console.log("Houve um erro:", error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
app.post('/post/:id/comentario', async(req, res)=>{
  const ip = await GetIP()
  try{
    const user = await User.findOne({
      where: {
        ip: ip.ip
      }
    })
    if(user === null){
      res.status(401).json({ error: 'Unauthorized' })
    } else {
      const post_id = req.params.id
      const { conteudo } = await req.body
      console.log(req.body)
      const post = await Post.findOne({
        where: {
          id: post_id
        }
      })
      if(post === null){
        res.redirect('/login')
      } else {
        const newComment = await Comentarios.create({
          nome: user.nome,
          conteudo: marked(conteudo),
          post_id: post_id
        })
        return res.redirect(`/post/${post_id}`)
      }
    }
  } catch (error){
    console.log("Houve um erro:", error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
app.get('/:nome', async(req, res)=>{
  const mysql = await createConnection()
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
      const nome = req.params.nome
      const [ row, results ] = await mysql.query(`SELECT * FROM Users WHERE nome = '${nome}'`)
      const userVerificed = "josecipriano"
      res.render('findUser', { row, userVerificed })
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.post('/perfil', async(req, res)=>{
  const mysql = await createConnection()
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
      const { nome, email, senha, descricao } = await req.body
      console.log(req.body)
      const [ update, results ] = await mysql.query(`
        UPDATE Users
        SET nome = '${nome}', email = '${email}', senha = '${senha}', descricao = '${marked(descricao)}'
        WHERE ip = '${ip.ip}'
        `)
      console.log(update)
      res.redirect(`/${nome}`)
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.get('/pesquisa', async(req, res)=>{
  const mysql = await createConnection()
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
      res.render('pesquisa')
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.post('/pesquisa', async(req, res)=>{
  const mysql = await createConnection()
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
      const { pesquisa } = await req.body
      console.log(req.body)
      const [ row, results ] = await mysql.query(`SELECT * FROM Posts WHERE titulo = '${pesquisa}'`)
      res.render('pesquisa', { row })
    }
  } catch (error){
    console.log("Houve um erro:", error)
  }
})
app.get('/api', async(req, res)=>{
  const mysql = await createConnection()
  try{
    res.render('api/v1/page')
  } catch (error){
    console.log("Houve um erro:", error)
    res.status(500).json({ error: 'Internal server error' })
  }
})