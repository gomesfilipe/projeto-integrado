import './Product_edit.css'
import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import api from '../../api'
import {Navigate, useParams} from 'react-router-dom'



function Product_edit() {
  const { name } = useParams()

  const [nomeProduto, setNomeProduto] = useState('');
  const [precoCustoProduto, setPrecoCustoProduto] = useState('');
  const [precoVendaProduto, setPrecoVendaProduto] = useState('');
  const [unidadeProduto, setUnidadeProduto] = useState('');
  const [qtdProduto, setQtdProduto] = useState('');
  const [qtdMinProduto, setQtdMinProduto] = useState('');
  const [idProduto, setIdProduto] = useState('');

  const [mensagem,setMensagem] = useState('');
  const [sucesso,setSucesso] = useState('');

  useEffect(() => {
    api.get(`/product/api/${name}`)
        .then(res => {
            setNomeProduto(res.data.products[0].name)
            setPrecoCustoProduto(res.data.products[0].cost)
            setPrecoVendaProduto(res.data.products[0].sale)
            setUnidadeProduto(res.data.products[0].unity)
            setQtdProduto(res.data.products[0].quantity)
            setQtdMinProduto(res.data.products[0].min)
            setIdProduto(res.data.products[0]._id)
        })
        .catch(error => {
            console.error(error)
        })
    
  }, []);

  function editarProduto(){
    const editedProduct = {
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
    api.put(`/product/api/${idProduto}`,editedProduct)
    .then( response => {         
      setSucesso("S")  
      alert("Produto editado com sucesso!");
    })
    .catch(error => {
      setSucesso('N')
      //erros que podem acontecer
      if(error.message === "Request failed with status code 400" )
      {
        setMensagem("Erro ao editar produto. Os dados não respeitam os critérios ou o produto já existe.")
      }
      else
      {
        console.error(error)
      }
    })
  }


  return (
    <div>
      <div style={{ display: "flex" }}>
        <Header/> 

        <div className='cadastrarProdutos'>

          <h1>Edição de Produto: {name}</h1>

            <div className="coluna-1">
              <div >      
                <label> <strong>Nome do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: Caderno A5"
                  defaultValue={nomeProduto}        
                  onChange={(e) => setNomeProduto(e.target.value)} 
                />
              </div>

              <div >      
                <label> <strong>Unidade do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: Kg,m2,caixas,unid"
                  defaultValue={unidadeProduto}          
                  onChange={(e) => setUnidadeProduto(e.target.value)}
                />
              </div>

              <div >      
                <label> <strong>Estoque mínimo do produto:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 45.00 - separado por ponto"
                  defaultValue={qtdMinProduto}          
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
                  defaultValue={precoCustoProduto}          
                  onChange={(e) => setPrecoCustoProduto(e.target.value)}
                />
              </div>

              <div >      
                <label> <strong>Preço de venda:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 50.00 - separado por ponto"
                  defaultValue={precoVendaProduto}          
                  onChange={(e) => setPrecoVendaProduto(e.target.value)}
                />
              </div>

              <div >      
                <label> <strong>Quantidade disponível:</strong> </label>
                <input 
                  type="text"
                  placeholder="Ex: 90.00 - separado por ponto"
                  defaultValue={qtdProduto}          
                  onChange={(e) => setQtdProduto(e.target.value)}
                />
              </div>
            </div>  
            <button type="button" onClick={editarProduto}> Editar produto </button>
            {/*Caso houver erro com as entradas acima*/}
            {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">{mensagem} </div> : null}
            {/*Caso houver sucesso com as entradas acima redirecionar a página*/}
            {sucesso === 'S' ? <div> {<Navigate to="/Products" /> } </div> : null}

        </div>
      </div>
    </div>
  )
}
export default Product_edit