class NegociacaoController {

    constructor(){
        let $ = document.querySelector.bind(document);

        this._inputQuantidade = $("#quantidade");
        this._inputData = $("#data");
        this._inputValor = $("#valor");
        
    }

    adiciona(event){
        
        event.prentDefault;

        let data = new Date(...
                            this._inputData.value
                                           .split("-")
                                           .map( (item, indice) => item - indice % 2));

        let negociacao = new Negociacao( data, 
                                        this._inputQuantidade.value, 
                                        this._inputValor.value );
        
            console.log(negociacao);
        
    }

}