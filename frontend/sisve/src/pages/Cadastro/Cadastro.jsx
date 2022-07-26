import './Cadastro.css'
import api from '../../api'
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'


function Cadastro() {

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [userNameEmpresa, setUserNameEmpresa] = useState('');
  const [password, setPassword] = useState('');
  const [admPassword, setAdmPassword] = useState('');
  const [mensagem,setMensagem] = useState('');
  const [sucesso,setSucesso] = useState('');

  function cadastrarEmpresa() {
    const newEmpresa = {
      name: nomeEmpresa,
      username: userNameEmpresa,
      password: password,
      admin_password: admPassword
    }
    //esvaziar mensagem    
    setMensagem("");
    /* Mandar para o backend */
    api.post("/store/api",newEmpresa)
    .then( response => {      
      //cadastrada com sucesso
      if(response.status == 200)
      {       
        setSucesso('S');
        alert("Loja cadastrada com sucesso!");
        var token = response.data.token;
        localStorage.setItem("token",JSON.stringify(token));
      }
    })
    .catch(error => {
      setSucesso('N')
      //erros que podem acontecer
      if(error.message = "error message" )
      {
        setMensagem("Erro ao cadastrar loja. Os dados não respeitam os critérios ou uma loja com esse nome já existe.")
      }
      else
      {
        setMensagem("Não é possível acessar a loja logado em uma conta");
      }
    })
  }

  return (
    
    <div>

      <div className='formulario'>

        <h1>Cadastre-se!</h1>
        
          <p>E comece a desfrutar de todos os benefícios de um app totalmente intuitivo e gratuito para turbinar seu negócio!</p>
        
          <label>Nome da empresa:</label>
          <br />
          <input 
            type="text"
            placeholder="Digite o nome real da sua empresa"
            onChange={e => setNomeEmpresa(e.target.value)}         
          />
          <br />

          <label>Escolha um nome de usuário para sua empresa:</label>
          <br />
          <input  
            type="text" 
            placeholder="Crie um nome para sua empresa no nosso app"
            onChange={e => setUserNameEmpresa(e.target.value)}
          />
          <div className="form-text"> O nome deverá conter no mínimo 4 caracteres. </div>
          <br />

          <label>Senha de login:</label>
          <br />
          <input  
            type="password" 
            placeholder="Crie uma senha para acessar sua empresa no app"
            onChange={e => setPassword(e.target.value)}
          />
          <div className="form-text"> A senha deverá conter no mínimo 4 caracteres. </div>
          <br />

          <label>Senha de administrador:</label>
          <br />
          <input  
            type="password" 
            placeholder="Crie uma senha de administrador para a sua empresa "
            onChange={e => setAdmPassword(e.target.value)}
    
          />
          <div className="form-text">A senha de administrador deverá conter no mínimo 4 caracteres e deverá ser de conhecimento apenas do dono ou supervisor de seu negócio. </div>
          <br />
          <button type="button" onClick={cadastrarEmpresa} >
          Cadastrar empresa
          </button>

          {/*Caso houver erro com as entradas acima*/}
          {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">{mensagem} </div> : null}
          {/*Caso houver sucesso com as entradas acima redirecionar a página*/}
          {sucesso === 'S' ? <div> {<Navigate to="/Store" /> } </div> : null}
     
      </div>
    </div>
  )
}
export default Cadastro
