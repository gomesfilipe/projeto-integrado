import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import api from '../../api'
import './Home.css'

function Home() {

  const [userName,setUserName] = useState();
  const [password,setPassword] = useState();
  const [mensagem,setMensagem] = useState();
  const [sucesso,setSucesso] = useState();

  function loginUsuario(){
    const usuario = {
      username: userName,
      password: password
      }

    //esvaziar mensagem    
    setMensagem("");
    
    /* Mandar para o backend */
    api.post("/store/authenticate",usuario)
    .then( response => {      
      //login efetuado com sucesso
      if(response.status == 200)
        {       
        setSucesso('S');
        alert("Login efetuado com sucesso!");
        var token = response.data.token;
        localStorage.setItem("token",JSON.stringify(token));
      }
    })
    .catch(error => {
      setSucesso('N')
      //erros que podem acontecer
      if(error.message = "error message" )
      {
        setMensagem("Login Incorreto! Usuário não existe ou senha incorreta.")
      }
      else
      {
        setMensagem("Não é possível acessar a loja logado em uma conta.");
      }
    })
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
          
          <label>Nome de usuário:</label>
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
          {/*Caso houver erro com as entradas acima*/}
          {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">{mensagem} </div> : null}
          {/*Caso houver sucesso com as entradas acima redirecionar a página*/}

        </div>
      </div>
    </div>
  )
}
export default Home

