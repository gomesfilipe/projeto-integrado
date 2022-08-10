import React, { useState , useEffect} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";
import {Link} from 'react-router-dom'
import { FaPlus } from "react-icons/fa";

function Products() {

  /* Dados do sessionStorage para personalizar página */
  const stringName = sessionStorage.getItem('name')
  const name = JSON.parse(stringName)
  const [products, setProducts] = useState([]); 


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
          <Link to="/Product_registration"> <button>{<FaPlus />}</button> </Link>
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
  