var express = require('express');
var router = express.Router();

const menus =  require("../inc/menus")
const connection = require('../inc/db');
const reservations = require('../inc/reservations');
const contacts = require('../inc/contacts');
const email = require('../inc/emails')

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results => {

    res.render("index" , {
      title: "Saboroso!" ,
      menus : results ,
      isHome : true
    })

  })

});


router.get("/contacts" , function(req , res , next){

    contacts.render(req , res);

})



router.post('/contacts' , (req , res , next ) => {
  console.log(req.body)

  if(!req.body.name){

    contacts.render(req , res , 'Obrigatorio colocar o nome')

  }
  else if(!req.body.email){

    contacts.render(req , res , 'Obrigatorio o email')

  }
  else if(!req.body.message){

    contacts.render(req , res , 'Digite sua messagem')

  }else {

    contacts.save(req.body).then(results => {

      req.body = {}

      contacts.render(req , res , null , "Contato enviado com sucesso!")
      
    }).catch(err => {

      contacts.render(req , res  , err.message)

    })

  }

})

router.post('/subscribe' , (req , res , next ) => {


    email.save(req).then(results => {

      res.send(results)
      
    }).catch(err => {
      
      res.send(err)

    })
})


router.get('/menus' , (req , res ,next )=>{

    menus.getMenus().then(results => {

      res.render("menus" , {
        title : "Saboroso",
        background: 'images/img_bg_1.jpg',
        h1:'Saboreie nosso menu!',
        menus: results
      })

    })
})

//exibindo dados com o metodo get
router.get('/reservations' , (req, res , next ) => {

  reservations.render(req , res )

})

//envio de dados com o metodo post para a base de dados 
router.post('/reservations' , (req ,res , next) => {

  if(!req.body.name){

    reservations.render(req , res , "Digite o nome")

  }else if(!req.body.email){
    
    reservations.render(req , res , "Coloque seu email para fazer uma reserva")

  }else if(!req.body.people){

    reservations.render(req , res, "Preencha quantas pessoas")

  }else if(!req.body.date){

    reservations.render(req ,  res , "Selecione a data que deseja fazer a reserva")

  }else if(!req.body.time){

    reservations.render(req , res , "Selecione a hora da que deseja fazer a reserva")

  }else {

    reservations.save(req.body).then(results => {

        req.body = {}

        reservations.render(req , res , null , "Reserva realizada com sucesso")

    }).catch(err => {

        reservations.render(req , res , err.message)

    })
  }

})


router.get('/services' , (req , res , next ) => {
    res.render("services" , {
      title: 'Saboroso',
      background: 'images/img_bg_1.jpg',
      h1:'É um prazer poder servir!'
    })
})


module.exports = router;
