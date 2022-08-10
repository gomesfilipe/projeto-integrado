import React, { useState , useEffect, Component} from 'react';
import api from '../../api'
import './Vendas.css'
import Header from "../../Components/Header";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";


function Vendas() {

  const [products, setProducts] = useState([]); 
  const [pQtd, setpQtd] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [input_search, setInput] = useState('');

  const [pItens, setpItens] = useState([]);



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
          const item = {
            product,
            qtd: 1,
            total : product.sale,
          }
          setpItens([...pItens, item]);
          // setCarrinho([...carrinho,product])

        } 
        // console.log(pItens);
      }
      // console.log(pItens[0].qtd);  //pra pegar o nome do primeiro produto

      function alt_qtd(value_qtd, product, i) {
        console.log('qtd eh : ' + value_qtd);
        console.log('i eh : ' + i);
        let alt_item = {
            product,
            qtd: value_qtd,
            total : product.sale * value_qtd,
        }
        // setpItens(state => {
        //   return { ...state[i], ...alt_item };

        // });
        // setpItens(pItens.filter(item => item.product.name !== product.name));
        // console.log(pItens);
        // setpItens(...pItens, alt_item);
        // console.log(pItens);

        // setpItens(prevpItens => {
        //   return { ...prevpItens, ...alt_item};

        // });
        // return total;
        // const index = pItens.indexOf(i); 

        // pItens.splice(i, 1, alt_item);
        // console.log(pItens);
        setpItens(pItens.splice(i, 1, alt_item));
        console.log(pItens);

      }

      // console.log(pItens);


      //   function handleClickAlterar(value, i, product) {
      //     let alt_item = {
      //       product,
      //       qtd: value,
      //       total : product.sale * value,
      //     }
      //     setpItens(state => {
      //     return { ...state[i], ...alt_item };
      //   });


      // }


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
                  {/* <th scope="col">ID</th> */}
                  <th scope="col">Produto</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Qtd</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>

                {/* {carrinho.map( (item,i) =>{
                  return <tr key = {i}>
                      <td> {item.name}</td>
                      <td> {item.sale}</td>
                      <td>
                        <input type="text" defaultValue={1} 
                        onChange={(e) => setpQtd(e.target.value)} //muda na parte de Qtd
                        />
                      </td>
                      <td>
                        {item.sale }  

                      </td>
                   
                    </tr> 
                })} */}


              {pItens.map( (item,i) =>{
                  return <tr key = {i}>
                      <td> {item.product.name}</td>
                      <td> {item.product.sale}</td>
                      <td>
                        <input type="text" /*defaultValue={1} */
                        //onChange={(e) => setpQtd(e.target.value)} //muda na parte de Qtd
                        //onChange={(e) => setCarrinho(e.target.value)}
                        // onChange={(e) => setpItens(...pItens, item.qtd)}
                        onChange={(e) => alt_qtd(e.target.value, item.product, i) }
                        // onChange={(e) => handleClickAlterar() }
                        // onChange={this.handleClickAlterar(e.target.value, i, item.product) }
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
              Total: 
            </p>
            
            <button type='button'>Finalizar</button>
          
        </div>

      

      </div>
    </div>

)}export default Vendas
  