


const express = require('express')
const admin = require('../inc/admin')
const menus = require('../inc/menus')
const users = require('../inc/users')
const router = express.Router()

router.use(function(req , res, next ){

    //so vai para tela de login  se não houver ningem logado
    //importante para não deixar acessar uma pagina destinada somente para quem esta logado na pagina
    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect("/admin/login")
    }else{
        next()
    }


})

//usando o middwere para direcionar a rota da administração
router.use(function(req , res , next){

    req.menus = admin.getMenus(req )

    next()

})

//rota para deslogar um usario da pagina 
router.get("/logout" , function(req , res , next ){

    delete req.session.user 

    res.redirect("/admin/login")

})


router.get('/' , (req , res , next )=> {

    admin.dashbord().then(data => {
        //aqui estou passando a tela inicial 
        res.render('admin/index' , admin.getParams(req , {
            data
        }))
    }).catch(err => {
        console.log(err)
    })

})


// rota para fazer login
router.post('/login' , (req , res, next) => {

    if(!req.body.email){
        users.render(req, res , "Preencha o campo e-mail")
    }else if(!req.body.password){
        users.render(req ,res ,"Preencha o campo password")
    }else {
        users.login(req.body.email , req.body.password).then(user => {

            req.session.user = user

            res.redirect('/admin')

        }).catch(err => {
            
            users.render(req , res , err.message || err);

        })
    }

})

router.get("/login" , (req , res , next ) => {
    users.render(req, res, null)
})

router.get('/contacts' ,(req , res , next )=> {
    res.render("admin/contacts" , admin.getParams(req))
})


router.get('/emails' , (req , res , next ) => {
    res.render('admin/emails' , admin.getParams(req))
})


router.get('/menus' , (req , res , next ) => {

    menus.getMenus().then( data => {
        res.render('admin/menus' , admin.getParams( req , {
            data
        }))
    })
})

router.post('/menus' , (req , res , next ) => {
    menus.save(req.fields , req.files).then(results => {
        res.send(results)
    }).catch(err => {
        res.send(err)
    })
   
})


router.get('/reservations' , ( req , res , next ) => {
    res.render('admin/reservations',  admin.getParams(req , {date: {}}))
})


router.get('/users' , ( req , res , next ) => {
    users.getUsers().then(user => {
        res.render('admin/users' , admin.getParams(req , {
            user
        })) 
    })
})

module.exports = router
