import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import Product_registration from "../Product_registration/Product_registration";


function Products() {

  // state = {
  //   seen: false
  // };

  // togglePop = () => {
  //   this.setState({
  //     seen: !this.state.seen
  //   });
  // };

 






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

        <div className='Products'>
          <h1> Todos os produtos da {name}: </h1>

          <div className='Botao'>
            <button type="button" /*onClick={cadastrarProduto}*/ > 
              {<FaPlus />}
            </button>  
          </div> 

          <table className="table table-hover table-bordered table-striped ">
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

              {products.map( (product,i) =>{
                return <tr key = {i+1}>
                  <th scope="row">{i+1}</th>
                    <td> {product.name}</td>
                    <td> {product.cost}</td>
                    <td> {product.sale}</td>
                    <td> {product.quantity}</td>
                    <td> {product.unity}</td>      
                  </tr> 
              })}

            </tbody>
          </table>


     

         
        </div> 
      </div>
    </div>



)}export default Products
  