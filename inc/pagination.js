const { startTLS } = require("./db");
const connection = require("./db");


//classe para paginar a tela de usuarios , cardapio , email , reservas
class Pagination {

    constructor(
        //aqui são passados os parametros para a classe que ira fazer a paginação
        query ,
        params = [],
        itensPerPage = 10
    ){

        this.query = query;
        this. params = params;
        this.itensPerPage =  itensPerPage;
        this.currentPage =  1
    
    }

    getPage(page){

        this.currentPage = page -  1 ;

        this.params.push(

            this.currentPage * this.itensPerPage,

            this.itensPerPage
        )

        return new Promise((resolve , reject ) => {

            connection.query([this.query , "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";") ,  this.params , (err , results ) => {
                if(err){
                    reject(err)
                }else{
                    this.data = results[0]
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itensPerPage); //função matematica que sempre converte para cima
                    this.currentPage++;

                    console.log(this.total)
                    resolve( this.data )
                }
            })

        })
    }

    getTotal(){

        return this.total

    }

    getCurrentPage(){

        return this.currentPage
        
    }

    getTotalPages(){
        return this.totalPages;
    }

    getNavigation(params){

        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0;
        let nrend = 0

        if(this.getTotalPages() < limitPagesNav){
            limitPagesNav = this.getTotalPages()
        }


        //se estamos nas primeiras paginas
        if((this.getCurrentPage() -  parseInt(limitPagesNav/2)) < 1 ){
            nrstart = 1;
            nrend = limitPagesNav;
        }
        //estamos chegando nas ultimas paginas 
        else if((this.getCurrentPage() + parseInt(limitPagesNav/1)) > this.getTotalPages()){

            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages()
            
        }else{
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2)
            nrend =   this.getCurrentPage() + parseInt(limitPagesNav/2)
        }

        for (let x = nrstart; x <= nrend ; x++ ){

            links.push({
                text : x,
                href: '?'+ this.getQueryString(Object.assign({} , params  , {page: x })),
                active : (x=== this.getCurrentPage())
            })

        }

        return links

    }

    getQueryString(params){
        let querystring = [] ;

        for (let name in params ){

            querystring.push(`${name}=${params[name]}`)

        }

        return querystring.join("&")
    }
}

module.exports = Pagination