var express = require('express');
var router = express.Router();

const connection = require("../inc/db")

/* GET users listing. */
router.get('/',(req, res, next) =>{
    connection.query("SELECT * FROM tb_users ORDER BY name" , (err , results )=> {

        if(err){
          res.send(err)
        }else {
           res.send(results)
        }

    })
});

module.exports = router;
