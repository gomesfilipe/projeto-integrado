import React, { useState , useEffect} from 'react';
import api from '../../api'
import './Products.css'
import Header from "../../Components/Header";
import {Link} from 'react-router-dom'
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";


function Products() {

  /* Dados do sessionStorage para personalizar página */
  const stringName = sessionStorage.getItem('name')
  const name = JSON.parse(stringName)
  const [products, setProducts] = useState([]); 
  const [input, setInput] = useState('')

  useEffect(() =>{
    api.get('/product/api')
    .then( res => {
      setProducts(res.data.products);
    })
    .catch((error) => {
      console.error('err : ' , error);
    })
  }, []);
  
  async function apagarProduto(id_product) {
    await api.delete(`/product/api/${id_product}`)
    setProducts(products.filter(product => product._id !== id_product))
    alert('Produto deletado com sucesso!')
  }

  function searchProduct(product_name){
    api.get(`/product/api/${product_name}`)
    .then(res =>{
      setProducts(res.data.products); 
    })
    .catch((error) => {
      console.error('err : ' , error);
    })       
  }

  return (     
    <div>        
      <div style={{ display: "flex" }}>
        <Header/>   

        <div className='Products'>
          <h1> Todos os produtos da {name}: </h1>

          <div className='cabecalho'>
            
          <div className='Search'>
              <h5>Nome do Produto</h5>
              <input type="text" 
                onChange={(e) =>  {setInput(e.target.value)}}         
              />

              <button type='button' onClick={(e) => {searchProduct(input)}}>
                {<FaSearch />}
              </button>
            </div>


            <div className='Botao'>
              <Link to="/Product_registration"> <button>{<FaPlus />}</button> </Link>
            </div>

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
                <th scope="col">Editar</th>
                <th scope="col">Apagar</th>
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
                    <td>
                    <div className='Edicao'>
                     <Link to={`/Product_edit/${product.name}`}> <button> {<FaPen/>} </button> </Link> 
                    </div>
                     
                    </td>
                    <td>
                    <div className='Delecao'>
                       <button onClick={(e) => apagarProduto(product._id)}> {<FaTrash/>} </button>
                    </div>
                    </td>     
                  </tr> 
              })}

            </tbody>
          </table>
         
        </div> 
      </div>
    </div>



)}export default Products
  