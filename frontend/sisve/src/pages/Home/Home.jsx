import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import './Home.css'

function Home() {

  const [userName,setUserName] = useState();
  const [password,setPassword] = useState();

  function loginUsuario(){
    const usuario = {
      name: userName,
      senha: password
    } 
    /*funcionando perfeitamente*/
    console.log(usuario)
  }
 
  return ( 

    <div>
      <div className="linha">
        <div className="coluna-50">
           <h1>SISVE</h1>
           <h2>Sistema de Vendas e Estoque</h2>
           <p>Um sistema criado para facilitar a vida do empreendedor brasileiro.</p>
           <p>O sisve é uma plataforma gratuita criada para ajudar o pequeno empreendedor brasileiro a lidar melhor com seus estoques e conhecer um pouco mais sobre suas vendas e seu faturamento. </p>
           <h3>Ainda não possui uma conta?</h3>
           <Link to="/Cadastro"> <button>Cadastre-se</button> </Link>
        </div>

        <div className="coluna-100">
          <h2>Já Sou cadastrado</h2>
          <h3>Acessar a minha loja</h3>
          
          <label>Username:</label>
          <br />
          <input 
            type="text"
            placeholder="Digite o seu nome de usuário"
            onChange={e => setUserName(e.target.value)}         
          />
          <br />
          <label>Senha:</label>
          <br />
          <input  
            type="password" 
            placeholder="digite sua senha"
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <button type="button" onClick={loginUsuario} >
              Entrar
          </button> 
        </div>
      </div>
    </div>
  )
}
export default Home

