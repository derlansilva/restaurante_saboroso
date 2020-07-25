var express = require('express');
var router = express.Router();
const menus =  require("../inc/menus")

const connection = require('../inc/db')

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results => {

    res.render("index" , {
      title: "Saboroso!" ,
      menus : results
    })

  })

});


router.get("/contacts" , function(req , res , next){
  res.render('contacts', {
    title : 'Saboroso',
    background: 'images/img_bg_3.jpg',
    h1:'Diga um oi!'
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

router.get('/reservations' , (req, res , next ) => {
    res.render('reservations' ,{
      title : 'Saboroso',
      background: 'images/img_bg_2.jpg',
      h1:'Reserve uma Mesa!'
    
    })
})

router.get('/services' , (req , res , next ) => {
    res.render("services" , {
      title: 'Saboroso',
      background: 'images/img_bg_1.jpg',
      h1:'É um prazer poder servir!'
    })
})
module.exports = router;
