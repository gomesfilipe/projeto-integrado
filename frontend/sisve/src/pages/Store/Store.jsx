import React, { useState, useEffect } from 'react';
import Header from "../../Components/Header";
import "./Store"
import api from '../../api'

//Icon
import { FaShoppingCart } from "react-icons/fa"


function Store(){

    const [usuario,setUsuario] = useState('');
    
    //executar quando a página for carregada
    useEffect(function()
    {
        setUsuario('Hoop Cadernos')
        api.get("/store/api")
        .then( response => {
            //consulta efetuada com sucesso
        })
        .catch(error => console.error(error))
    },[])
    

    return (
       <div>        
            <div style={{ display: "flex" }}>
                <Header/>            
                <div className='Store' >

                    {/*Pegar dados da loja pra montar a página*/}
                    <h1> Hello, {usuario}! </h1>
                    
                    {/*Nome da loja*/}
                    <p>Name: Hoop</p>
                    <p>Username: hoop_cadernos</p>

                    {/* <Button variant="contained" Icon=   {<FaShoppingCart />}       >
                     Editar
                    </Button> */}

                    {/* <button type="submit">
                        Editar
                    </button> */}

                    {/* <IconButton aria-label="fingerprint" color="secondary">
                        <FaShoppingCart />
                    </IconButton> */}
                    {/* <div>
                        <Button color="primary">
                            <Icon name="left" />
                        </Button>
                    </div> */}

                    {/* <h2>Dashboards</h2> */}
                </div> 
            </div>
        </div>
    )
}
export default Store