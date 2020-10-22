const connection = require("./db")
const path = require('path')


module.exports = {

    //metodo para buscar no barco da tabela menus em ordem  por titulo 

    getMenus(){

        return new Promise((resolve , reject ) => {

            connection.query(`
                SELECT * FROM tb_menus
            ` , (err , results) => {
                if(err){
                    reject(err)
                }

                resolve(results)
            })
        })

    },

    //metodo para salvar na tabela menus

    save(fields , files ){
        return new Promise((resolve , reject ) => {

            fields.photo = `images/${path.parse(files.photo.path).base}`
            
            connection.query(`
                INSERT INTO tb_menus (title , description , price , photo)
                VALUES(?,?,?,?)
            ` , [
                fields.title ,
                fields.description ,
                fields.price,
                fields.photo
            ], ( err , results) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    }
}