const connection = require('./db')


module.exports ={
    getEmail(){

        return  new Promise((resolve , reject ) => {
            connection.query(`
                SELECT * FROM tb_emails
            `, (err , results) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })

    },

    save(req){

        return new Promise((resolve, reject ) => {

            if(!req.fields.email ){
                reject("Preencha o e-mail")
            }else{

                connection.query(`
                INSERT INTO tb_emails (email)
                VALUES (?)
            `, [
                req.fields.email
            ], (err , results )=> {
                if(err){

                    reject(err.message)
                }else{
                    resolve(results)
                }
            })}
        })
    },

    deleteEmails(id){
        return new Promise((resolve , reject) => {
            connection.query(`
                DELETE FROM tb_emails WHERE id=?
            `,[
                id
            ], (err , results ) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    }
}