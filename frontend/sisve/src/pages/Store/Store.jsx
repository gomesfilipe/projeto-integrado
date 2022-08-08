import React from 'react';
import Header from "../../Components/Header";
import "./Store.css"

function Store(){

    /* Dados do sessionStorage para personalizar página */
    const stringName = sessionStorage.getItem('name')
    const name = JSON.parse(stringName)
    const stringUsername = sessionStorage.getItem('username')
    const username = JSON.parse(stringUsername)

    return (
       <div>        
            <div style={{ display: "flex" }}>
                <Header/>            
                <div className="Store" >

                    <h1> Seja bem vindo(a), {name}! </h1>
                   
                    <h2>Dados da Loja:</h2>
                    
                    <p>Nome da loja: {name}</p>
                    <p>Username da loja: {username}</p>

                    <h2>Dashboards da Loja:</h2>
                    <p>Você ainda não tem dashboards !</p>
                </div> 
            </div>
        </div>
    )
}
export default Store