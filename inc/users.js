const connection = require("./db")


//função para fazer login
    module.exports = {

        getUsers(){
            return new Promise((resolve , reject )=> {
                connection.query(`
                    SELECT * FROM tb_users
                 ` , (err , results)=> {
                     if(err){
                         reject(err)
                     }else{
                         resolve(results)
                     }
                 })
            })
        },


        render(req , res , error){
            
            res.render("admin/login" , {
                body : req.body ,
                error
            })
        },

        login(email , password){
            return new Promise((resolve , reject) => {
                connection.query(`
                    SELECT * FROM tb_users  WHERE email = ?
                ` , [
                    email
                ] , (err , results) => {
                    if(err){
                        reject(err)
                    }else{

                        if(!results.length > 0){
                            reject("Usuario ou senha incorretos");
                        }else{
                            let row = results[0]

                            if(row.password !== password){
                                reject("Usuario ou senha incorretos.")
                            }else{
                                resolve(row)
                            }
                        }

                    }
                })
            })
        }
    }