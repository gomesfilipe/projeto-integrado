import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import axios from 'axios';


function Products() {
   
  /* Dados do sessionStorage para personalizar página */
  const stringName = sessionStorage.getItem('name')
  const name = JSON.parse(stringName)

  // const[produtos,setProdutos] = useState([]);
  const [products, setProducts] = useState([]); 
  const stringToken = sessionStorage.getItem('token')
  // const Token = JSON.parse(stringToken)

  // useEffect(function(){ 
  //   console.log("oi")
  //   api.get("/product/api")
  //   .then( async function(response){
  //     await response.products.forEach(function(product){
  //       console.log(product)
  //     })
  //   })
  //   .catch(error => console.error(error))
  // },[])

      useEffect(() =>{
        api.get('/product/api')
        .then( res => {
          setProducts(res.data.products); //yey
        })
        .catch((error) => {
            console.error('err : ' , error);
          })
        
      }, []);


  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/>   

        <div className='Botao'>
            <button type="button" /*onClick={cadastrarProduto}*/ > 
              {<FaPlus />}
            </button>  
        </div>  

        <div className='Products'>
          <h1> Todos os produtos da {name}: </h1>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Custo</th>
                <th scope="col">Preço</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Unidade</th>
              </tr>
            </thead>
            <tbody>


              {/* <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr> */}

              
                      {products.map( (product,i) =>{
                          return <tr key = {i+1}>
                            <th scope="row">{i+1}</th>
                              <td> {product.name}</td>
                              <td> {product.cost}</td>
                              <td> {product.sale}</td>
                              <td> {product.quantity}</td>
                              <td> {product.unity}</td>
                              
                        </tr> 
                        })
                      } 



            </tbody>
          </table>
        </div> 
      </div>
    </div>



    
                      /* {
                        Products.map( (product) =>{
                          return <tr key = {product.id}>
                            <th scope="row">{product}.id}</th>
                              <td> {product.name}</td>
                              <td> {product.cost}</td>
                              <td> {product.price}</td>
                              <td> {product.quantity}</td>
                              <td> {product.unity}</td>
                              
                        </tr> 
                        })
                      }  */
)}export default Products
  