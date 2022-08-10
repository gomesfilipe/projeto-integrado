import './Product_registration.css'
import React, { useState } from 'react';
import Header from "../../Components/Header";
import api from '../../api'
import {Navigate} from 'react-router-dom'



function Product_registration() {

  const [nomeProduto, setNomeProduto] = useState('');
  const [precoCustoProduto, setPrecoCustoProduto] = useState('');
  const [precoVendaProduto, setPrecoVendaProduto] = useState('');
  const [unidadeProduto, setUnidadeProduto] = useState('');
  const [qtdProduto, setQtdProduto] = useState('');
  const [qtdMinProduto, setQtdMinProduto] = useState('');

  const [mensagem,setMensagem] = useState('');
  const [sucesso,setSucesso] = useState('');

  function cadastrarProduto(){
    console.log("cadastrar")
    const newProduct = {
      name: nomeProduto,
      cost:precoCustoProduto,
      sale:precoVendaProduto,
      quantity:qtdProduto,
      unity:unidadeProduto,
      min:qtdMinProduto
    }

    //esvaziar variáveis de controle    
    setMensagem("");
    setSucesso("");
  
    /* Mandar para o backend */
    api.post("/product/api",newProduct)
    .then( response => { 
      //cadastro efetuado com sucesso            
      setSucesso("S")  
      alert("Produto cadastrado com sucesso!");
    })
    .catch(error => {
      setSucesso('N')
      //erros que podem acontecer
      if(error.message === "Request failed with status code 400" )
      {
        setMensagem("Erro ao cadastrar produto. Os dados não respeitam os critérios ou o produto já existe.")
      }
      else
      {
        //apenas para fim de desenvolvimento, não vale a pena mostrar essa mensagem
        //de token inválido ao usuário
        console.error(error)
      }
    })
  }


  return (
    <div>
      <div style={{ display: "flex" }}>
        <Header/> 

        <div className='cadastrarProdutos'>

          <h1>Cadastrar novo produto</h1>

            <div className="coluna-1">
              <div >      
                <label> <strong>Nome do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: Caderno A5"
                  onChange={(e) => setNomeProduto(e.target.value)}         
                />
              </div>

              <div >      
                <label> <strong>Unidade do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: Kg,m2,caixas,unid"
                  onChange={(e) => setUnidadeProduto(e.target.value)}         
                />
              </div>

              <div >      
                <label> <strong>Estoque mínimo do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 45.00 - separado por ponto"
                  onChange={(e) => setQtdMinProduto(e.target.value)}         
                />
              </div>
            </div>

            <div className="coluna-2">
              <div >      
                <label> <strong>Custo do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 28.50 - separado por ponto"
                  onChange={(e) => setPrecoCustoProduto(e.target.value)}         
                />
              </div>

              <div >      
                <label> <strong>Preço de venda:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 50.00 - separado por ponto"
                  onChange={(e) => setPrecoVendaProduto(e.target.value)}         
                />
              </div>

              <div >      
                <label> <strong>Quantidade disponível:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 90.00 - separado por ponto"
                  onChange={(e) => setQtdProduto(e.target.value)}         
                />
              </div>
            </div>  
            <button type="button" onClick={cadastrarProduto}> Cadastrar produto </button>
            {/*Caso houver erro com as entradas acima*/}
            {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">{mensagem} </div> : null}
            {/*Caso houver sucesso com as entradas acima redirecionar a página*/}
            {sucesso === 'S' ? <div> {<Navigate to="/Products" /> } </div> : null}

        </div>
      </div>
    </div>
  )
}
export default Product_registration