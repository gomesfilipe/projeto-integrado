import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import axios from 'axios';


function Products() {
   
    //const [products, setProducts] = useState([]);  //nao consegui fazer por esse
    //const [products, setProducts] = useState({name: '', price : ''});  //nao consegui fazer por esse

    //Fazendo por lista
    var listPro = [];

    //Fazendo por objeto
    var Pro = {
      liPro : [],
    } ; //objeto produtos

    
  
      //Pega os produtos de todas as lojas   Dando certo aqui
      // api.get('product/api/', {
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
          // setProducts(res.data.products);
          // console.log(res.data);
          //console.log(products);
        })
        .catch((error) => {
            console.error('err frioso no front : ' , error);
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
                <td colSpan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div> 
      </div>
    </div>



    
                      /* {
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
                      }  */
)}export default Products
  