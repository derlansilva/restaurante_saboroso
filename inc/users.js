
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

                console.log(' salvar ou update')
                let query , params = [
                    fields.name,
                    fields.email
            
                ];

                if(parseInt(fields.id) > 0){

                    console.log('update')

                    query=`

                        UPDATE tb_users
                        SET 
                            name =?,
                            email =?

                        WHERE id =?
                    `;
                    params.push(fields.id)

                }else{

                    query=`

                    INSERT INTO tb_users (name , email , password) VALUES(?,?,? )

                    `;

                    params.push(fields.password)

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
        },

        changePassword(req){
            return new Promise((resolve , reject) => {
                //aqui confirma se os dois campos para auterar senha são identicos
                if(!req.fields.password){
                    reject("Preencha a senha")
                }else if(req.fields.password !== req.fields.passwordConfirm ){
                    reject("As senha não batem")
                }else{
                    connection.query(`
                        UPDATE tb_users
                        SET 
                            password =?
                        WHERE id=?
                    ` , [
                        req.fields.password,
                        req.fields.id
                    ], (err , results) => {
                        if(err){
                            reject(err.message)
                        }else{
                            resolve(results)
                        }
                    }) 
                }
            })
        }

    }


    


    