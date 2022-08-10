import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Vendas.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";


function Vendas() {

  const [products, setProducts] = useState([]); 
  const [pQtd, setpQtd] = useState('');

      useEffect(() =>{
        api.get('/product/api')
        .then( res => {
          setProducts(res.data.products); 
        })
        .catch((error) => {
            console.error('err : ' , error);
          })
        
      }, []);


  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/> 

        <div className='Screen-sale'>
          <h1> Realizar Venda </h1>
          <div className='Sale'>
            {/* <h1> Realizar Venda </h1> */}
            
            <div className='Search'>
              <h5>Nome do Produto</h5>
              <input type="text" />

              <button>{<FaSearch />}</button>
            </div>

            <table className="table table-borderless ">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Estoque</th>
                  <th scope="col">Carrinho</th>
                  {/* <th scope="col">Retirar</th> */}

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
                        
                        <button type='button'>
                          {<FaPlus />}
                        </button>
                        
                      </td>
                      {/* <td> 
                        <button>
                          {<FaMinus />}
                        </button>
                      </td> */}
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
                  {/* <th scope="col">ID</th> */}
                  <th scope="col">Produto</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Qtd</th>
                  <th scope="col">Total</th>
                  {/* <th scope="col">Retirar</th> */}

                </tr>
              </thead>
              <tbody>

                {products.map( (product,i) =>{
                  return <tr key = {i+1}>
                    {/* <th scope="row">{i+1}</th> */}
                      <td> {product.name}</td>
                      <td> {product.sale}</td>
                      <td>
                        <input type="text" defaultValue={1} 
                        onChange={(e) => setpQtd(e.target.value)}
                        />
                      </td>
                      <td>
                        {pQtd}  
                      </td>
                   
                    </tr> 
                })}


              </tbody>
            </table>


            <p>
              Total: 
            </p>
            
            <button type='button'>Finalizar</button>
          
        </div>

        






      </div>
    </div>

)}export default Vendas
  