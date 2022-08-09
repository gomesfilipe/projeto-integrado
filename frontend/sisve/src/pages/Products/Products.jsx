import React, { useState, useEffect } from 'react';
import './Products.css'
import Header from "../../Components/Header";
import api from '../../api'


function Products() {

  /* Dados do sessionStorage para personalizar página */
  const stringName = sessionStorage.getItem('name')
  const name = JSON.parse(stringName)

  const[produtos,setProdutos] = useState([]);
  const stringToken = sessionStorage.getItem('token')
  const Token = JSON.parse(stringToken)
/*
  useEffect(function(){ 
    console.log("oi")
    api.get("/product/api",{
      headers: {
        'Authorization': `token ${Token}`
      }
    })
    .then( async function(response){
      await response.products.forEach(function(produto){
        console.log(produto)
      })
    })
    .catch(error => console.error(error))
  },[]);*/

  
  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/>      
        <div className='Products'>
          <h1> Todos os produtos da {name}: </h1>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nome</th>
                <th scope="col">Qtd disponível</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div> 
      </div>
    </div>
)}export default Products
  