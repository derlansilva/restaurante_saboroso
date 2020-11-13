
class Grid{

    constructor(configs ){

        configs.listeners = Object.assign({

            afterUpdateClick :( e) => {
                  
                $('#modal-update').modal('show');

              },

            after : (e) => {

                window.location.reload()

            },

            afterFormUpdateError: e => {

                alert("Não foi possivel enviar o formulário.")

            },

            afterFormCreateError : e => {

                alert('Não foi possivel enviar o formulário.')

            }

        } , configs.listeners)

        this.options = Object.assign({} , {
            //configurações comuns para todos não necessariamente devem ficar em suas respectivas telas .
            formCreate : '#modal-create form',
            formUpdate  : '#modal-update form',
            btnUpdate : 'btn-update',
            btnDelete : 'btn-delete',
            onUpdateLoad: (form , name , data) => {

                let input = form.querySelector(`[name=${name}]`)
                if(input) input.value = data[name]

            }
        } ,  configs )

        this.rows =[...document.querySelectorAll('table tbody tr')];

        this.initForms();
        this.initBottons()

    }

    initForms(){
        this.formCreate = document.querySelector(this.options.formCreate)

        this.formCreate.save({
            success:()=> {
                this.fireEvent('after')
            },
            failure: () => {
                this.fireEvent('afterFormCreateError')
            }

        })

        this.formUpdate = document.querySelector(this.options.formUpdate)

        this.formUpdate.save({

                success:()=> {
                    this.fireEvent('after')
                },
                failure: () => {
                    this.fireEvent('afterFormUpdateError')
                }

        })
    }

    fireEvent(name , args ){

        if( typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this  , args )
    }

    getTrdata(e ){
        let tr = e.path.find(el => {
            return(el.tagName.toUpperCase() === 'TR')
        })

        return JSON.parse(tr.dataset.row)
    }

    btnUpdateClick(e){

        this.fireEvent('beforeUpdateClick'  , [e])

        let data = this.getTrdata(e)

        
        for(let name in data){

            this.options.onUpdateLoad(this.formUpdate , name , data )

            
        }

         this.fireEvent('afterUpdateClick' , [e])

    }

    btnDeleteClick(e){

        this.fireEvent('beforeDeleteClick'  , [e]) 

        let data = this.getTrdata(e)

        if(confirm(eval('`' + this.options.deleteMsg + '`'))){

            fetch( eval('`' + this.options.deleteUrl + '`'), {

                method: 'DELETE'
                
            })  .then(response => response.json())

                .then(json => {

                    this.fireEvent('after')

            })
        }

    }


    initBottons(){

        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click' , e => {

                    if(e.target.classList.contains(this.options.btnUpdate)){

                        this.btnUpdateClick(e)

                    }else if(e.target.classList.contains(this.options.btnDelete)){

                        this.btnDeleteClick(e)

                    }else{
                        this.fireEvent('buttonClick' , [e.target , this.getTrdata(e) , e ])
                    }

                })

            })

        });
        

    }


}