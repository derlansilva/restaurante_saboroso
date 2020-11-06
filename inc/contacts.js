const connection = require('./db')

module.exports = {
    render(req , res , error , success ){

        res.render('contacts' , {
            title: 'Contato - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi',
            body : req.body,
            error ,
            success
        })

    } ,

    getContacts(){
        return new Promise((resolve , reject) => {
            connection.query(`
                SELECT * FROM tb_contacts
            `, (err , results) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    },

    save(fields){

        return new Promise((resolve , reject ) => {
            let query , params = [
                fields.name ,
                fields.email
            ]


            if(parseInt(fields.id ) > 0 ){

                query= `
                    UPDATE tb_contacts 
                    SET 
                        name = ?,
                        email=?

                    WHERE id=?
                `
                params.push(fields.id)

            }else{
                query=`
                    INSERT INTO tb_contacts (name , email , message)
                    VALUE(? , ? , ?)
                `
            }
            
            connection.query(query , params ,(err ,  results) => {

                    if (err ){

                        reject(err)

                    }else {

                        resolve(results)

                    }
                })

        })

    },

    deleteContacts(id){
        return new Promise((resolve , reject) => {
            connection.query(`
                DELETE FROM tb_contacts WHERE id=?
            
            `, [
                id
            ] , (err , results) =>{
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    }
}