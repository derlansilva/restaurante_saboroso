const connection = require("./db");
const Pagination = require("./pagination");


module.exports ={

    render(req , res , error , success ){

        res.render('reservations' , {
            title : 'Reservas - Saboroso!',
            background : 'images/img_bg_2.jpg',
            h1: 'Reserve uma mesa!',
            body : req.body,
            error,
            success 
        });
    },

    getReservations(req){

        return new Promise(( resolve , reject ) => {

            let page = req.query.page;
            let dtstart = req.query.start;
            let dtend = req.query.end;

            if(!page) page =  1

            let params = []

            if(dtstart && dtend) params.push(dtstart , dtend )

            let pag = new Pagination(
                //SELECIONE TUDO DA TABELA POR ORDEM NAME COM LIMITE DE ATE 
                //TRECHO PARA FILTRAR RESERVAS COM MYSQL
                `SELECT SQL_CALC_FOUND_ROWS * 
                FROM tb_reservations
                ${( dtstart && dtend ) ? 'WHERE date BETWEEN ? AND ?' : ''} 
                ORDER BY name LIMIT ? ,?
                `,
                //LINHA 38 IF TERNARIO SE DTSTART E DTEND EXISTIR MOSTRE WHERE SE NÃO 
                params
                //AQUI O TOTAL DE ITENS POR PAGINA
            )

            return pag.getPage(page).then(data =>{
                resolve({
                    data,
                    links : pag.getNavigation(req.query )
                })
            })

        })
    }

    ,
    save(fields){

        return new Promise(( resolve , reject ) => {

            if(fields.date.indexOf('/') > -1 ){

                let date = fields.date.split('/')

                fields.date = `${date[2]}-${date[1]}-${date[0]}`

            }


            let query , params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ]; 

            if(parseInt(fields.id) >0) {
 
                query = `

                    UPDATE tb_reservations 
                    SET 
                        name = ?,
                        email = ?,
                        people =  ?,
                        date = ?,
                        time =  ? 
                    WHERE id =?
                `;

                params.push(fields.id )
                

            }else{
                query= `
                    INSERT INTO tb_reservations (name , email , people , date , time )
                    VALUES(?,?,?,?,?)
                `
                
            }

            connection.query( query , params , (err , results) => {

                console.log(err)
                
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }

            })


        })

    },

    deleteReservations(id){
        return new Promise((resolve , reject) => {
            connection.query(`

                DELETE FROM tb_reservations WHERE id=?
            
            `, [
                id
            ] , (err , results)=> {

                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    }

   

}