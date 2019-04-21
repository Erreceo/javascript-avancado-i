import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService{

    constructor(){
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana(){
        
        return this._http
                .get('negociacoes/semana')
                .then(negociacoes => {
                    return negociacoes.map( objeto => new Negociacao( new Date(objeto.data), objeto.quantidade, objeto.valor ));
                })
                .catch( erro => {
                    console.log(erro);
                    throw new Error('N�o foi possivel obter as negociacoes da semana');
                });
            
    }
    
    obterNegociacoesDaSemanaAnterior(){
        
        return this._http
                .get('negociacoes/anterior')
                .then(negociacoes => {
                    return (negociacoes.map( objeto => new Negociacao( new Date(objeto.data), objeto.quantidade, objeto.valor )));
                })
                .catch( erro => {
                    console.log(erro);
                    throw new Error('N�o foi possivel obter as negociacoes da semana anterior');
                });
    }

    obterNegociacoesDaSemanaRetrasada(){
        
        return this._http
                .get('negociacoes/retrasada')
                .then(negociacoes => {
                     return (negociacoes.map( objeto => new Negociacao( new Date(objeto.data), objeto.quantidade, objeto.valor )));
                })
                .catch( erro => {
                    console.log(erro);
                    throw new Error('N�o foi possivel obter as negociacoes da semana retrasada');
                });
        
    }

    obterNegociacoes(){
        return Promise.all( [this.obterNegociacoesDaSemana(), 
                            this.obterNegociacoesDaSemanaAnterior(), 
                            this.obterNegociacoesDaSemanaRetrasada()])
                        .then(periodos => {
                                            let negociacoes = periodos;
                                            return (negociacoes.reduce((arrayAchatado, array)=> arrayAchatado.concat(array),[]))
                        })
                        .catch( error => {throw new Error(error)} );
    }

    cadastra( negociacao ){
            
          return  ConnectionFactory.getConnection()
                             .then( connection => new NegociacaoDao(connection))
                             .then( dao => dao.adiciona(negociacao))
                             .then(()=> 'Negocia��o adicionada com sucesso')
                             .catch( () => {throw new Error('N�o foi poss�vel adicionar a negocia��o')});
    }

    lista(){
        
        return ConnectionFactory.getConnection()
                                .then( connection => new NegociacaoDao(connection))
                                .then( dao => dao.listaTodos() )
                                .catch( erro => {
                                    console.log(erro)
                                    throw new Error('N�o foi possivel obter as negocia��es');
                                });

    }

    apaga(){
        return ConnectionFactory.getConnection()
                                 .then( connection => new NegociacaoDao(connection))
                                 .then(dao => dao.apagaTodos())
                                 .then( () => 'Negocia��es apagadas com sucesso' )
                                 .catch( erro => {
                                    console.log(erro);
                                    throw new Error('N�o foi possivel apagar as negocia��es')
                                 } );
    }

    importa( listaAtual ){
        return this.obterNegociacoes()
                    .then(negociacoes => negociacoes.filter( negociacao => 
                        !listaAtual.some( negociacaoLista =>  negociacaoLista.isEquals(negociacao) ) ) )
                    .catch(error => {
                            console.log(error);
                            throw new Error('N�o foi possivel importar a lista de negocia��es');
                    });
    }

}