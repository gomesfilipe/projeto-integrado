import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Vendas.css'
import Header from "../../Components/Header";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { Navigate } from "react-router-dom"

function Vendas() {

  const [products, setProducts] = useState([]); 
  const [pQtd, setpQtd] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [input_search, setInput] = useState('');

  const [pItens, setpItens] = useState([]);
  const [totalSale, setTotalSale] = useState(0);

  const [mensagem,setMensagem] = useState('');
  const [sucesso,setSucesso] = useState('');

      useEffect(() =>{
        api.get('/product/api')
        .then( res => {
          setProducts(res.data.products);
        })
        .catch((error) => {
            console.error('err : ' , error);
          })
        
      }, []);


      function searchProduct(product_name){
        api.get(`/product/api/${product_name}`)
        .then(res =>{
          setProducts(res.data.products); 
        })
        .catch((error) => {
          console.error('err : ' , error);
        })       
      }
      //Adiciona um produto ao carrinho
      function addProduct(product){
        if(carrinho.indexOf(product) > -1){ //ja possui esse produto no carrinho
          alert(`${product.name} já está no carrinho!`);
          
        }else{  //nao possui esse produto no carrinho
          setCarrinho([...carrinho,product]);
          let item = {
            product,
            qtd: 1,
            total : product.sale,
          }
          setTotalSale(totalSale + product.sale)
          setpItens([...pItens, item]);
          
        } 
        
      }
     

      function alt_qtd(value_qtd, product, i) {
        let alt_item = {
            product,
            qtd: value_qtd,
            total : product.sale * value_qtd,
        }
        
        const old_value = pItens[i].total
        const current_value = alt_item.total

        
        setTotalSale(totalSale - old_value + current_value)

        pItens.splice(i, 1, alt_item)
        const aux = pItens
        setpItens([...aux])
        
      }

      function efetuarVenda() {
        let itemList = []
        for(let i = 0; i < pItens.length; i++) {
          const itemVenda = {
            id_product: pItens[i].product._id,
            quantity: pItens[i].qtd
          }

          itemList.push(itemVenda)
        }
        
        const newVenda = {
          items: itemList,
          value: totalSale
        }
        
        api.post('/sale/api', newVenda) 
          .then(res => {
            alert('Venda efetuada com sucesso!')
            setSucesso('S')
          })
          .catch(error => {
            setSucesso('N')
            //erros que podem acontecer
            if(error.message === "Request failed with status code 400")
            {
              setMensagem("Erro ao realizar venda. Há campos com valores inválidos.")
            }
            else
            {
            console.error(error)
            }
          })
        }


        function removeItem(item, i){
          pItens.splice(i, 1)
          carrinho.splice(i, 1)
          const aux = pItens
          setpItens([...aux])
          const aux2 = carrinho
          setCarrinho([...aux2])
          setTotalSale(totalSale - item.total)
        }

     
  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/> 

        <div className='Screen-sale'>
          <h1> Realizar Venda </h1>
          <div className='Sale'>
            
          <div className='Search'>
              <h5>Nome do Produto</h5>
              <input type="text" 
                onChange={(e) =>  {setInput(e.target.value)}}         
              />

              <button type='button' onClick={(e) => {searchProduct(input_search)}}>
                {<FaSearch />}
              </button>
            </div>

            <table className="table table-borderless ">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Estoque</th>
                  <th scope="col">Carrinho</th>
                  
                </tr>
              </thead>
              <tbody>

                {products.map( (product,i) =>{
                  return <tr key = {i+1}>
                    <th scope="row">{i+1}</th>
                      <td> {product.name}</td>
                      <td> {product.sale}</td>
                      <td> {product.quantity}</td>
                      <td> 
                        <button type='button' onClick={(e) => {addProduct(product)}} >
                          {<FaPlus />}
                        </button>
                      </td>
                    </tr> 
                })}

              </tbody>
            </table>
          </div> 
        </div>

        <div className='Shop-cart'>
          <h2>Carrinho de compras</h2>

          <table className="table table-borderless ">
              <thead>
                <tr>
                  <th scope="col">Remover</th>
                  <th scope="col">Produto</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Qtd</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>

              {pItens.map( (item,i) =>{
                  return <tr key = {i}>
                      <td> 
                        <button type='button' onClick={(e) =>{removeItem(item, i)}} >
                        {<FaTrash />}
                        </button>
                      </td>
                      <td> {item.product.name}</td>
                      <td> {item.product.sale}</td>
                      <td>
                        <input type="text" defaultValue={1}
                          onChange={(e) => alt_qtd(e.target.value, item.product, i) }
                        />
                      </td>
                      <td>
                        {item.total} 
                      </td>
                   
                    </tr> 
                })}
              </tbody>
            </table>

            <p>
              Total:  {totalSale}
            </p>
            
            <button type='button' onClick={efetuarVenda}> <strong> Finalizar</strong></button>
            {/*Caso houver erro com as entradas acima*/}
            {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">{mensagem} </div> : null}
            {/*Caso houver sucesso com as entradas acima redirecionar a página*/}
            {sucesso === 'S' ? <div> {<Navigate to="/Store" /> } </div> : null}
        </div>
      </div>
    </div>

)}export default Vendas
  