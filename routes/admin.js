

const express = require('express')
const admin = require('../inc/admin')
const menus = require('../inc/menus')
const users = require('../inc/users')
const reservations = require('../inc/reservations')
const contacts = require('../inc/contacts')
const moment = require('moment')
const emails = require('../inc/emails')

moment.locale('pt-BR')

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
    contacts.getContacts().then( data => {

        res.render("admin/contacts" , admin.getParams(req , {
            data
        }))

    })
})


router.delete('/contacts/:id', (req, res ,next ) => {
    contacts.deleteContacts(req.params.id).then(results => {
        res.send(results)
    }).catch(err => {
        res.send(err)
    })
})


router.get('/emails' , (req , res , next ) => {
    emails.getEmail().then(data => {

        res.render("admin/emails" , admin.getParams(req , {
            data
        }))

    })
})

router.delete('/emails/:id' , (req , res , next ) => {
    emails.deleteEmails(req.params.id).then(results => {
        res.send(results)
    }).catch(err => {
        res.send(err)
    })
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

router.delete('/menus/:id' , function(req , res , next){
    menus.deleteMenus(req.params.id).then(results => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    })
})


router.get('/reservations' , ( req , res , next ) => {

    let start =  (req.query.start) ? req.query.start : moment().subtract( 1 , "year").format("YYYY-MM-DD")
    let end =    (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD")

    reservations.getReservations(req).then(pag =>{
         res.render('admin/reservations' , admin.getParams(req, 
            {
                date: {
                    start,
                    end
                },
                data: pag.data,
                moment,
                links : pag.links 
             }
        )
        )
    })
    
    
})

router.post('/reservations' ,(req , res , next ) => {

    reservations.save( req.fields , req.files ).then(results => {

        res.send(results)

    }).catch(err => {
        res.send(err)
    })
})

router.delete('/reservations/:id' , (req , res , next) => {

    reservations.deleteReservations(req.params.id).then(results => {
        res.send(results)
    }).catch(err => {
        res.send(err)
    })

})

router.get('/users' , ( req , res , next ) => {
    users.getUsers().then(data => {
        res.render('admin/users' , admin.getParams(req , {
            data
        })) 
    })
})

router.post('/users' , (req , res , next ) => {

    users.save(req.fields).then(results   => {

        res.send(results)

    }).catch(err => {

        res.send(err)

    })
})

router.post('/users/password-change' , (req , res , next ) => {
    users.changePassword(req).then(results => {
        res.send(results)
    }).catch(err => {
        res.send({
            error: err
        })
    })
})


router.delete('/users/:id', (req , res ,next ) => {
    users.deleteUser(req.params.id).then(results => {
        res.send(results)
    }).catch(err => {
        res.send(err)
    })
})


module.exports = router
