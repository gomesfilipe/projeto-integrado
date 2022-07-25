import React, { useState } from 'react';
import Header from "../../Components/Header";
import Home from "../Home/Home"

import "./Store.css"

//Icon
import { FaShoppingCart } from "react-icons/fa"


function Store () {
    return (
       <div>
        
            <div style={{ display: "flex" }}>
                <Header/>
            
                <div className='Store' >
                    <h1>Hoop</h1>
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

                    <h2>Dashboards</h2>
                </div> 





            </div>

      
        </div>
       

      );
  };
  export default Store