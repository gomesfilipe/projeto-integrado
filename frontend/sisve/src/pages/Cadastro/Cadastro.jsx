import './Cadastro.css'
import React, { useState } from 'react';


{/*A senha deve conter mais de 4 chars*/ }

function Cadastro() {

  const [nomeEmpresa, setNomeEmpresa] = useState();
  const [userNameEmpresa, setUserNameEmpresa] = useState();
  const [password, setPassword] = useState();
  const [admPassword, setAdmPassword] = useState();

  function cadastrarEmpresa() {
    const newEmpresa = {
      name: nomeEmpresa,
      username: userNameEmpresa,
      password: password,
      admin_password: admPassword
    }
    /* Mandar para o backend */
    axios.get("http://localhost:6500/sale/api/all")
    .then( response => {
      console.log(response.status)
    })
    .catch( error => console.error(error))
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
            placeholder="Escolha um nome para sua empresa no nosso app"
            onChange={e => setUserNameEmpresa(e.target.value)}
          />
          <br />

          <label>Crie uma senha de login:</label>
          <br />
          <input  
            type="password" 
            placeholder="Crie uma senha para acessar sua empresa no app"
            onChange={e => setPassword(e.target.value)}
          />
          <br />

          <label>Crie uma senha de administrador:</label>
          <br />
          <input  
            type="password" 
            placeholder="Crie uma senha de administrador para a sua empresa "
            onChange={e => setAdmPassword(e.target.value)}
          />
          <br />

          <button type="button" onClick={cadastrarEmpresa} >
          Cadastrar empresa
          </button> 

      </div>
    </div>
  )
}
export default Cadastro
