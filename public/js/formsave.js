//atualizar o cardapio 


HTMLFormElement.prototype.save = function(){
    let form = this

    return new Promise((resolve , reject )=>{

        form.addEventListener('submit' , e => {

            e.preventDefault()

            let formData = new FormData(form)
            
            fetch(form.action , {
                method : form.method ,
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                //recarrega a pagina

                resolve(json)
              
            }).catch(err => {
                reject(err)
            })
        })

    })
}