
const express = require("express")
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
        },

        save(fields){
            return new Promise((resolve , reject) => {

                let query , params = [
                    fields.name,
                    fields.email,
                    fields.password
            
                ];

                if(parseInt(fields.id) > 0){

                    params.push(fields.id)

                    query=`

                        UPDATE tb_users
                        SET 
                            name =?,
                            email =?,
                            password=?

                        WHERE id =?
                    `;

                }else{

                    query=`

                    INSERT INTO tb_users (name , email , password) VALUES(?,?,? )

                    `;

                }

                connection.query( query ,params , (err , results) => {
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        resolve(results)
                    }
                })

            })
        },

        deleteUser(id){
            return new Promise((resolve , reject) => {
                connection.query(`
                    DELETE FROM tb_users WHERE id=?
                `, [
                    id
                ] , (err , results) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(results)
                    }
                })
            })
        }

    }


    


    