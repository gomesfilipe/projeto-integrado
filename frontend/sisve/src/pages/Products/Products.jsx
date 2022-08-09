import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import axios from 'axios';


function Products() {
   
    // const [products, setProducts] = useState([]);  //nao consegui fazer por esse
    const [products, setProducts] = useState({name: '', price : ''});  //nao consegui fazer por esse

    //Fazendo por lista
    var listPro = [];

    //Fazendo por objeto
    var Pro = {
      liPro : [],
    } ; //objeto produtos

      //Capturando o token
      const stringToken = localStorage.getItem('token')
      const token = JSON.parse(stringToken)

    
      //Pega os produtos de todas as lojas   Dando certo aqui
      // axios.get('http://localhost:8000/product/api/all', {
      // })
      // .then((res) => {
      //   //Fazendo por objeto:
      //   //Pro.liPro.push(res.data);
      //   //console.log(Pro.liPro);
      //   //console.log(Pro.liPro[0].products[0]);

      //   //Fazendo por lista
      //   listPro.push(res.data);
      //   // console.log(listPro);
      //   //Imprimindo primiero produto
      //   console.log(listPro[0].products[0].name);
      //   console.log(listPro[0].products[0].cost);


      
      // })
      // .catch((error) => {
      //   console.error(error)
      // })
      // const name =  JSON.stringify(listPro[0].products[0].name);
      // console.log(listPro[0].products[0].name);
      // const produto_name = JSON.stringify(listPro[0].products[0].name);
      

      
      //Tentativa de pegar os produtos de uma unica loja
      // axios.get('http://localhost:8000/product/api', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
          
      //   }
      // })
      // .then((res) => {
      //   console.log(res.data)
      // })
      // .catch((error) => {
      //   console.error(error)
      // })

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

      useEffect(() =>{
        axios.get('http://localhost:8000/product/api/all')
        .then(res => res.json())
        .then(data => {
          setProducts(products);
        })
        .catch((error) => {
            console.error(error)
          })
        
      }, [products]);

  

    
    return (
      
      <div>        
            <div style={{ display: "flex" }}>
                <Header/>
                  <div className='cabecalho'>
                    <h1> Meus Produtos </h1> 
                    {/* {name}; */}
                    

                    
                  
                    {/* <button type="button" onClick={cadastrarProduto}> New </button>    */}
                  </div>

                  <div className='Botao'>
                        <button type="button" > 
                        {<FaPlus />}
                     </button>     
                    </div>




                    {/* <div className="produto-container">
                        <ul>
                          {products.map(product => (
                            <li key={product.id}>
                                <b>Nome:</b>{product.name}<br/>
                                <b>Preço:</b>{product.price}<br/>
                            </li>
                        ))}
                        </ul>
                    </div> */}

                    


              
                {/* <table className="table table-hover table-bordered">

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
                      <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td> oi</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                      </tr> */}


                      {/* <tr>
                         <th scope="row">{res.data.id}</th>
                              <td> {res.data.name}</td>
                              <td> {res.data.cost}</td>
                              <td> {res.data.price}</td>
                              <td> {res.data.quantity}</td>
                              <td> {res.data.unity}</td>
                      </tr> */}
                      
                      {/* <tr>
                        <th scope="row">3</th>
                        <td colspan="2">Larry the Bird</td>
                        <td>@twitter</td>
                      </tr> */}

                      {/* {
                        Products.map( (product) =>{
                          return <tr key = {res.data.id}>
                            <th scope="row">{res.data}.id}</th>
                              <td> {res.data.name}</td>
                              <td> {res.data.cost}</td>
                              <td> {res.data.price}</td>
                              <td> {res.data.quantity}</td>
                              <td> {res.data.unity}</td>
                              
                        </tr> 
                        })
                      }  */}

                    {/* </tbody>
                </table>  */}

                {/* <div>
                  console.log(products.len)
                </div> */}


            </div>
        </div>
      
  
  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/>      
        <div className='Products'>
          <h1> Todos os produtos da {name}: </h1>
          <table class="table table-hover table-bordered">
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
  