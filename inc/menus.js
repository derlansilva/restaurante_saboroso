const connection = require("./db")
const path = require('path')


module.exports = {


    //metodo para buscar no barco da tabela menus em ordem  por titulo 

    getMenus(){

        return new Promise((resolve , reject ) => {

            connection.query(`
                SELECT * FROM tb_menus ORDER BY title
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

            fields.photo = `images/${path.parse(files.photo.path).base}`;

            let query, queryPhoto = '' , params =[
                fields.title ,
                fields.description ,
                fields.price
            ]

            //se a photo vim vazia continuara a antiga , isso e importante para que o prato atualizado 
            //não fique sem photo apos apdate

            if( files.photo.name){
                queryPhoto = ',photo = ?'

                params.push(fields.photo)

            }

            if(parseInt(fields.id) > 0 ){
                params.push(fields.id)

                query = `
                UPDATE tb_menus 
                SET title = ? , 
                    description = ? , 
                    price = ? 
                    ${queryPhoto}
                    WHERE   id = ?
                
                `;
            }else{

                if(!files.photo.name){
                    reject('Obrigatorio enviar a foto do prato')
                }
                query = `
                    INSERT INTO tb_menus (title , description , price , photo)
                    VALUES(?,?,?,?)
                `;
            }
            
            connection.query(query , params, ( err , results) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    },

    deleteMenus(id){

        return new Promise((resolve , reject) => {
            connection.query(`
                DELETE FROM tb_menus WHERE id=?
            ` , [
                id
            ] , (err , results ) => {
                if(err ){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
        
    }
}